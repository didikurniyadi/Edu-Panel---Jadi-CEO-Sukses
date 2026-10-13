import { useState, useEffect, useRef, useCallback } from 'react';
import { StudentSubmission, GroupResult, StrokeData, LKPDData } from '../types';
import { INITIAL_LKPD_DATA } from '../data/lkpdData';

interface GroupSettings {
  targetGroupSize: number;
  distributionMode: 'balanced' | 'homogeneous';
}

interface RoomStateSnapshot {
  code: string;
  title: string;
  currentSlide: number;
  laserPointer: { x: number; y: number; active: boolean; author: string } | null;
  strokes: StrokeData[];
  submissions: StudentSubmission[];
  groups: GroupResult[];
  groupSettings: GroupSettings;
  lkpdByGroup?: Record<string, LKPDData>;
}

export function useRealtimeSync(roomCode: string = 'WIRA-1', userRole: 'teacher' | 'student' = 'teacher', userName: string = 'Guru') {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected' | 'offline'>('connecting');
  const [connectedCount, setConnectedCount] = useState<number>(1);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [strokes, setStrokes] = useState<StrokeData[]>([]);
  const [laserPointer, setLaserPointer] = useState<{ x: number; y: number; active: boolean; author: string } | null>(null);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(`edupanel_subs_${roomCode}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [groups, setGroups] = useState<GroupResult[]>(() => {
    try {
      const saved = localStorage.getItem(`edupanel_groups_${roomCode}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [groupSettings, setGroupSettings] = useState<GroupSettings>({
    targetGroupSize: 4,
    distributionMode: 'balanced',
  });
  const [lkpdByGroup, setLkpdByGroup] = useState<Record<string, LKPDData>>(() => {
    try {
      const saved = localStorage.getItem(`edupanel_lkpd_${roomCode}`);
      return saved ? { ...INITIAL_LKPD_DATA, ...JSON.parse(saved) } : INITIAL_LKPD_DATA;
    } catch {
      return INITIAL_LKPD_DATA;
    }
  });

  const wsRef = useRef<WebSocket | null>(null);
  const bcRef = useRef<BroadcastChannel | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`edupanel_subs_${roomCode}`, JSON.stringify(submissions));
    } catch {
      // storage error
    }
  }, [submissions, roomCode]);

  useEffect(() => {
    try {
      localStorage.setItem(`edupanel_groups_${roomCode}`, JSON.stringify(groups));
    } catch {
      // storage error
    }
  }, [groups, roomCode]);

  useEffect(() => {
    try {
      localStorage.setItem(`edupanel_lkpd_${roomCode}`, JSON.stringify(lkpdByGroup));
    } catch {
      // storage error
    }
  }, [lkpdByGroup, roomCode]);

  // Setup BroadcastChannel for offline and local-tab sync
  useEffect(() => {
    try {
      const channel = new BroadcastChannel(`edupanel_channel_${roomCode}`);
      bcRef.current = channel;
      channel.onmessage = (event) => {
        const msg = event.data;
        if (!msg) return;
        if (msg.type === 'presentation:slide') setCurrentSlide(msg.slideIndex);
        if (msg.type === 'canvas:draw' && msg.stroke) {
          setStrokes((prev) => (prev.some((s) => s.id === msg.stroke.id) ? prev : [...prev, msg.stroke]));
        }
        if (msg.type === 'canvas:syncStrokes') setStrokes(msg.strokes || []);
        if (msg.type === 'laser:move') setLaserPointer(msg.point);
        if (msg.type === 'assessment:updated') {
          setSubmissions(msg.submissions || []);
          setGroups(msg.groups || []);
        }
        if (msg.type === 'assessment:reset') {
          setSubmissions([]);
          setGroups([]);
        }
        if (msg.type === 'group:updated') {
          setGroupSettings(msg.groupSettings);
          setGroups(msg.groups);
        }
        if (msg.type === 'lkpd:updated' && msg.groupId && msg.lkpdData) {
          setLkpdByGroup((prev) => ({
            ...prev,
            [msg.groupId]: msg.lkpdData,
          }));
        }
      };
      return () => {
        channel.close();
      };
    } catch {
      // BroadcastChannel not supported in some older environments
    }
  }, [roomCode]);

  // WebSocket Connection & Reconnection
  useEffect(() => {
    let isMounted = true;

    function connect() {
      if (typeof window === 'undefined') return;
      if (!navigator.onLine) {
        setConnectionStatus('offline');
        return;
      }

      setConnectionStatus('connecting');
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          if (!isMounted) return;
          setConnectionStatus('connected');
          ws.send(
            JSON.stringify({
              type: 'room:join',
              roomCode,
              user: { name: userName, role: userRole },
            })
          );
        };

        ws.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'room:sync' && data.roomState) {
              const state: RoomStateSnapshot = data.roomState;
              setCurrentSlide(state.currentSlide || 0);
              setStrokes(state.strokes || []);
              if (Array.isArray(state.submissions)) {
                setSubmissions(state.submissions);
              }
              if (Array.isArray(state.groups)) {
                setGroups(state.groups);
              }
              if (state.groupSettings) {
                setGroupSettings(state.groupSettings);
              }
              if (state.lkpdByGroup && Object.keys(state.lkpdByGroup).length > 0) {
                setLkpdByGroup((prev) => ({ ...prev, ...state.lkpdByGroup }));
              }
              if (data.connectedCount) {
                setConnectedCount(data.connectedCount);
              }
            } else if (data.type === 'room:peerJoined' || data.type === 'room:peerLeft') {
              if (data.connectedCount) setConnectedCount(data.connectedCount);
            } else if (data.type === 'presentation:slide') {
              setCurrentSlide(data.slideIndex);
            } else if (data.type === 'canvas:draw' && data.stroke) {
              setStrokes((prev) => (prev.some((s) => s.id === data.stroke.id) ? prev : [...prev, data.stroke]));
            } else if (data.type === 'canvas:syncStrokes') {
              setStrokes(data.strokes || []);
            } else if (data.type === 'laser:move') {
              setLaserPointer(data.point);
            } else if (data.type === 'assessment:updated') {
              setSubmissions(data.submissions || []);
              setGroups(data.groups || []);
            } else if (data.type === 'group:updated') {
              if (data.groupSettings) setGroupSettings(data.groupSettings);
              if (data.groups) setGroups(data.groups);
            } else if (data.type === 'lkpd:updated' && data.groupId && data.lkpdData) {
              setLkpdByGroup((prev) => ({
                ...prev,
                [data.groupId]: data.lkpdData,
              }));
            }
          } catch (e) {
            console.error('Failed to parse WS message:', e);
          }
        };

        ws.onclose = () => {
          if (!isMounted) return;
          setConnectionStatus(navigator.onLine ? 'disconnected' : 'offline');
          // reconnect with gentle delay
          reconnectTimeoutRef.current = setTimeout(connect, 5000);
        };

        ws.onerror = () => {
          if (!isMounted) return;
          setConnectionStatus('disconnected');
          try {
            ws.close();
          } catch {
            // ignore
          }
        };
      } catch {
        setConnectionStatus('disconnected');
        reconnectTimeoutRef.current = setTimeout(connect, 5000);
      }
    }

    connect();

    const handleOnline = () => {
      setConnectionStatus('connecting');
      connect();
    };
    const handleOffline = () => {
      setConnectionStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      isMounted = false;
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [roomCode, userName, userRole]);

  // Outgoing Emitters
  const sendSlideChange = useCallback(
    (slideIndex: number) => {
      setCurrentSlide(slideIndex);
      const payload = { type: 'presentation:slide', roomCode, slideIndex };
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(payload));
      }
      bcRef.current?.postMessage(payload);
    },
    [roomCode]
  );

  const sendDrawStroke = useCallback(
    (stroke: StrokeData) => {
      setStrokes((prev) => [...prev, stroke]);
      const payload = { type: 'canvas:draw', roomCode, stroke };
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(payload));
      }
      bcRef.current?.postMessage(payload);
    },
    [roomCode]
  );

  const sendUndoStroke = useCallback(() => {
    setStrokes((prev) => prev.slice(0, -1));
    const payload = { type: 'canvas:undo', roomCode };
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
    bcRef.current?.postMessage({ type: 'canvas:syncStrokes', strokes: strokes.slice(0, -1) });
  }, [roomCode, strokes]);

  const sendClearCanvas = useCallback(() => {
    setStrokes([]);
    const payload = { type: 'canvas:clear', roomCode };
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
    bcRef.current?.postMessage({ type: 'canvas:syncStrokes', strokes: [] });
  }, [roomCode]);

  const sendLaserMove = useCallback(
    (point: { x: number; y: number; active: boolean; author: string } | null) => {
      setLaserPointer(point);
      const payload = { type: 'laser:move', roomCode, point };
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(payload));
      }
      bcRef.current?.postMessage(payload);
    },
    [roomCode]
  );

  const submitAssessment = useCallback(
    (submission: StudentSubmission) => {
      // Local optimistic update
      setSubmissions((prev) => {
        const idx = prev.findIndex((s) => s.id === submission.id || (s.nis && s.nis === submission.nis));
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = submission;
          return next;
        }
        return [...prev, submission];
      });

      const payload = { type: 'assessment:submit', roomCode, submission };
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(payload));
      }
      bcRef.current?.postMessage(payload);
    },
    [roomCode]
  );

  const updateGroupSettings = useCallback(
    (settings: GroupSettings) => {
      setGroupSettings(settings);
      const payload = { type: 'group:updateSettings', roomCode, settings };
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(payload));
      }
      bcRef.current?.postMessage(payload);
    },
    [roomCode]
  );

  const manualOverrideGroups = useCallback(
    (overrideGroups: GroupResult[]) => {
      setGroups(overrideGroups);
      const payload = { type: 'group:manualOverride', roomCode, groups: overrideGroups };
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(payload));
      }
      bcRef.current?.postMessage(payload);
    },
    [roomCode]
  );

  const loadSampleData = useCallback(
    (sampleSubmissions: StudentSubmission[]) => {
      setSubmissions(sampleSubmissions);
      const payload = { type: 'assessment:loadSample', roomCode, sampleSubmissions };
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(payload));
      }
      bcRef.current?.postMessage(payload);
    },
    [roomCode]
  );

  const resetAssessmentData = useCallback(async () => {
    setSubmissions([]);
    setGroups([]);
    try {
      localStorage.removeItem(`edupanel_subs_${roomCode}`);
      localStorage.removeItem(`edupanel_groups_${roomCode}`);
    } catch {
      // storage error
    }
    const payload = { type: 'assessment:reset', roomCode };
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
    try {
      bcRef.current?.postMessage(payload);
      bcRef.current?.postMessage({
        type: 'assessment:updated',
        submissions: [],
        groups: [],
      });
    } catch {
      // ignore
    }
    try {
      await fetch(`/api/room/${encodeURIComponent(roomCode)}/reset`, { method: 'POST' });
    } catch {
      // ignore
    }
  }, [roomCode]);

  const updateLKPD = useCallback(
    (groupId: string, lkpdData: LKPDData) => {
      setLkpdByGroup((prev) => ({
        ...prev,
        [groupId]: lkpdData,
      }));
      const payload = { type: 'lkpd:update', roomCode, groupId, lkpdData };
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(payload));
      }
      bcRef.current?.postMessage({ type: 'lkpd:updated', groupId, lkpdData });
    },
    [roomCode]
  );

  return {
    connectionStatus,
    connectedCount,
    currentSlide,
    sendSlideChange,
    strokes,
    sendDrawStroke,
    sendUndoStroke,
    sendClearCanvas,
    laserPointer,
    sendLaserMove,
    submissions,
    submitAssessment,
    groups,
    groupSettings,
    updateGroupSettings,
    manualOverrideGroups,
    loadSampleData,
    resetAssessmentData,
    lkpdByGroup,
    updateLKPD,
  };
}
