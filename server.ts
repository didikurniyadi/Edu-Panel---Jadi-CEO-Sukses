process.env.DISABLE_HMR = 'true';

import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

interface StudentSubmission {
  id: string;
  nama: string;
  nis: string;
  gender: 'Laki-laki' | 'Perempuan';
  sekolah: string;
  kelas: string;
  waktu: string;
  answers: Record<number, number>; // 1-10 -> 1-5
  totalScore: number;
  kategori: 'Tinggi' | 'Sedang' | 'Rendah' | 'Sangat Rendah';
  refleksi: string;
}

interface GroupResult {
  id: string;
  name: string;
  gender: 'Laki-laki' | 'Perempuan';
  avgScore: number;
  members: StudentSubmission[];
}

interface StrokeData {
  id: string;
  tool: 'pen' | 'highlighter' | 'eraser';
  color: string;
  width: number;
  points: number[];
  author?: string;
  timestamp: number;
}

interface RoomState {
  code: string;
  title: string;
  currentSlide: number;
  laserPointer: { x: number; y: number; active: boolean; author: string } | null;
  strokes: StrokeData[];
  submissions: StudentSubmission[];
  groups: GroupResult[];
  groupSettings: {
    targetGroupSize: number;
    distributionMode: 'balanced' | 'homogeneous'; // balanced (heterogen) or homogeneous
  };
  lkpdByGroup: Record<string, any>;
}

const rooms: Map<string, RoomState> = new Map();
const clientsByRoom: Map<string, Set<WebSocket>> = new Map();

function getOrCreateRoom(code: string): RoomState {
  const normalized = (code || 'WIRA-1').toUpperCase().trim();
  if (!rooms.has(normalized)) {
    rooms.set(normalized, {
      code: normalized,
      title: 'Pembelajaran Wirausaha Interaktif - MGBK Banyumas',
      currentSlide: 0,
      laserPointer: null,
      strokes: [],
      submissions: [],
      groups: [],
      groupSettings: {
        targetGroupSize: 4,
        distributionMode: 'balanced',
      },
      lkpdByGroup: {},
    });
  }
  return rooms.get(normalized)!;
}

function computeGroups(submissions: StudentSubmission[], settings: { targetGroupSize: number; distributionMode: 'balanced' | 'homogeneous' }): GroupResult[] {
  const targetSize = Math.max(2, settings.targetGroupSize || 4);
  const maleStudents = submissions.filter(s => s.gender === 'Laki-laki');
  const femaleStudents = submissions.filter(s => s.gender === 'Perempuan');

  function partitionGender(students: StudentSubmission[], genderLabel: 'Laki-laki' | 'Perempuan'): GroupResult[] {
    if (students.length === 0) return [];

    const sorted = [...students].sort((a, b) => b.totalScore - a.totalScore);
    const numGroups = Math.max(1, Math.ceil(sorted.length / targetSize));
    const groupArrays: StudentSubmission[][] = Array.from({ length: numGroups }, () => []);

    if (settings.distributionMode === 'balanced') {
      // Snake / serpentine distribution so high, medium, and low scores are balanced across groups
      let ascending = true;
      let currentIndex = 0;
      for (const student of sorted) {
        groupArrays[currentIndex].push(student);
        if (ascending) {
          if (currentIndex === numGroups - 1) {
            ascending = false;
          } else {
            currentIndex++;
          }
        } else {
          if (currentIndex === 0) {
            ascending = true;
          } else {
            currentIndex--;
          }
        }
      }
    } else {
      // Homogeneous: chunks of similar abilities
      for (let i = 0; i < sorted.length; i++) {
        const groupIndex = Math.min(numGroups - 1, Math.floor(i / targetSize));
        groupArrays[groupIndex].push(sorted[i]);
      }
    }

    const maleNames = ['Garuda Muda', 'Wira Perkasa', 'Ksatria Bisnis', 'Bimasakti', 'Satriya Banyumas', 'Pelopor Inovasi'];
    const femaleNames = ['Kartini Mandiri', 'Srikandi Usaha', 'Dara Kreatif', 'Putri Bahari', 'Melati Emas', 'Permata Karya'];

    return groupArrays.map((members, idx) => {
      const avgScore = members.length > 0 ? Number((members.reduce((acc, m) => acc + m.totalScore, 0) / members.length).toFixed(1)) : 0;
      const baseName = genderLabel === 'Laki-laki' ? (maleNames[idx % maleNames.length] || `Putra ${idx + 1}`) : (femaleNames[idx % femaleNames.length] || `Putri ${idx + 1}`);
      return {
        id: `${genderLabel.toLowerCase()}-${idx + 1}-${Date.now()}`,
        name: `${baseName} (${genderLabel})`,
        gender: genderLabel,
        avgScore,
        members,
      };
    });
  }

  const maleGroups = partitionGender(maleStudents, 'Laki-laki');
  const femaleGroups = partitionGender(femaleStudents, 'Perempuan');
  return [...maleGroups, ...femaleGroups];
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // API endpoints
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
  });

  app.get('/api/room/:code', (req, res) => {
    const room = getOrCreateRoom(req.params.code);
    res.json(room);
  });

  // Proxy to Google Apps Script / External Webhook to prevent CORS restrictions
  app.post('/api/spreadsheet-proxy', async (req, res) => {
    try {
      const { webhookUrl, payload } = req.body;
      if (!webhookUrl || typeof webhookUrl !== 'string') {
        return res.status(400).json({ error: 'webhookUrl is required' });
      }
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.text();
      return res.json({ success: true, response: data });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Proxy request failed';
      return res.status(500).json({ success: false, error: msg });
    }
  });

  const httpServer = http.createServer(app);
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on('upgrade', (request, socket, head) => {
    try {
      const url = new URL(request.url || '', `http://${request.headers.host || 'localhost'}`);
      if (url.pathname === '/ws') {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request);
        });
      } else {
        socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
        socket.destroy();
      }
    } catch {
      socket.destroy();
    }
  });

  function broadcastToRoom(roomCode: string, payload: unknown, senderWs?: WebSocket) {
    const clients = clientsByRoom.get(roomCode);
    if (!clients) return;
    const message = JSON.stringify(payload);
    for (const ws of clients) {
      if (ws.readyState === WebSocket.OPEN && ws !== senderWs) {
        ws.send(message);
      }
    }
  }

  function broadcastToAllInRoom(roomCode: string, payload: unknown) {
    const clients = clientsByRoom.get(roomCode);
    if (!clients) return;
    const message = JSON.stringify(payload);
    for (const ws of clients) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    }
  }

  // REST API endpoint to reset assessment data
  app.post('/api/room/:code/reset', (req, res) => {
    const rawCode = (req.params.code || 'WIRA-1').trim().toUpperCase();
    const room = getOrCreateRoom(rawCode);
    room.submissions = [];
    room.groups = [];
    broadcastToAllInRoom(rawCode, {
      type: 'assessment:updated',
      submissions: [],
      groups: [],
    });
    res.json({ success: true, message: 'Room assessment data reset successfully' });
  });

  wss.on('connection', (ws: WebSocket) => {
    let currentRoomCode = 'WIRA-1';

    ws.on('message', (raw: string) => {
      try {
        const msg = JSON.parse(raw);
        const { type, roomCode } = msg;
        const normalizedRoom = (roomCode || currentRoomCode || 'WIRA-1').toUpperCase().trim();
        const room = getOrCreateRoom(normalizedRoom);

        switch (type) {
          case 'room:join': {
            // Remove from old room if changed
            if (currentRoomCode && clientsByRoom.has(currentRoomCode)) {
              clientsByRoom.get(currentRoomCode)!.delete(ws);
            }
            currentRoomCode = normalizedRoom;
            if (!clientsByRoom.has(normalizedRoom)) {
              clientsByRoom.set(normalizedRoom, new Set());
            }
            clientsByRoom.get(normalizedRoom)!.add(ws);

            // Send initial room snapshot
            ws.send(JSON.stringify({
              type: 'room:sync',
              roomState: room,
              connectedCount: clientsByRoom.get(normalizedRoom)?.size || 1,
            }));

            // Broadcast user count update
            broadcastToRoom(normalizedRoom, {
              type: 'room:peerJoined',
              connectedCount: clientsByRoom.get(normalizedRoom)?.size || 1,
              user: msg.user,
            });
            break;
          }

          case 'presentation:slide': {
            room.currentSlide = msg.slideIndex;
            broadcastToRoom(normalizedRoom, {
              type: 'presentation:slide',
              slideIndex: msg.slideIndex,
            }, ws);
            break;
          }

          case 'canvas:draw': {
            if (msg.stroke) {
              room.strokes.push(msg.stroke);
              // limit stored strokes to 2000 to keep memory lean
              if (room.strokes.length > 2000) {
                room.strokes = room.strokes.slice(-1500);
              }
              broadcastToRoom(normalizedRoom, {
                type: 'canvas:draw',
                stroke: msg.stroke,
              }, ws);
            }
            break;
          }

          case 'canvas:undo': {
            if (room.strokes.length > 0) {
              room.strokes.pop();
              broadcastToAllInRoom(normalizedRoom, {
                type: 'canvas:syncStrokes',
                strokes: room.strokes,
              });
            }
            break;
          }

          case 'canvas:clear': {
            room.strokes = [];
            broadcastToAllInRoom(normalizedRoom, {
              type: 'canvas:syncStrokes',
              strokes: [],
            });
            break;
          }

          case 'laser:move': {
            room.laserPointer = msg.point;
            broadcastToRoom(normalizedRoom, {
              type: 'laser:move',
              point: msg.point,
            }, ws);
            break;
          }

          case 'assessment:submit': {
            const sub: StudentSubmission = msg.submission;
            // Check if existing student with same NIS or ID exists and update
            const existingIdx = room.submissions.findIndex(s => s.id === sub.id || (s.nis && s.nis === sub.nis));
            if (existingIdx >= 0) {
              room.submissions[existingIdx] = sub;
            } else {
              room.submissions.push(sub);
            }
            // Auto recompute groups
            room.groups = computeGroups(room.submissions, room.groupSettings);

            broadcastToAllInRoom(normalizedRoom, {
              type: 'assessment:updated',
              submissions: room.submissions,
              groups: room.groups,
              newSubmission: sub,
            });
            break;
          }

          case 'group:updateSettings': {
            if (msg.settings) {
              room.groupSettings = {
                targetGroupSize: msg.settings.targetGroupSize || 4,
                distributionMode: msg.settings.distributionMode || 'balanced',
              };
              room.groups = computeGroups(room.submissions, room.groupSettings);
              broadcastToAllInRoom(normalizedRoom, {
                type: 'group:updated',
                groupSettings: room.groupSettings,
                groups: room.groups,
              });
            }
            break;
          }

          case 'group:manualOverride': {
            if (Array.isArray(msg.groups)) {
              room.groups = msg.groups;
              broadcastToAllInRoom(normalizedRoom, {
                type: 'group:updated',
                groupSettings: room.groupSettings,
                groups: room.groups,
              });
            }
            break;
          }

          case 'assessment:loadSample': {
            if (Array.isArray(msg.sampleSubmissions)) {
              room.submissions = msg.sampleSubmissions;
              room.groups = computeGroups(room.submissions, room.groupSettings);
              broadcastToAllInRoom(normalizedRoom, {
                type: 'assessment:updated',
                submissions: room.submissions,
                groups: room.groups,
              });
            }
            break;
          }

          case 'assessment:reset': {
            room.submissions = [];
            room.groups = [];
            broadcastToAllInRoom(normalizedRoom, {
              type: 'assessment:updated',
              submissions: [],
              groups: [],
            });
            break;
          }

          case 'lkpd:update': {
            if (msg.groupId && msg.lkpdData) {
              room.lkpdByGroup[msg.groupId] = msg.lkpdData;
              broadcastToAllInRoom(normalizedRoom, {
                type: 'lkpd:updated',
                groupId: msg.groupId,
                lkpdData: msg.lkpdData,
              });
            }
            break;
          }
        }
      } catch (err) {
        console.error('Error handling WS message:', err);
      }
    });

    ws.on('close', () => {
      if (currentRoomCode && clientsByRoom.has(currentRoomCode)) {
        clientsByRoom.get(currentRoomCode)!.delete(ws);
        broadcastToRoom(currentRoomCode, {
          type: 'room:peerLeft',
          connectedCount: clientsByRoom.get(currentRoomCode)?.size || 0,
        });
      }
    });
  });

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`EduPanel IFP Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
