import { ref, onMounted, onUnmounted } from 'vue';
import { io, Socket } from 'socket.io-client';

export const useWebSocket = () => {
  const socket = ref<Socket | null>(null);
  const connected = ref(false);
  const error = ref<string | null>(null);

  const config = useRuntimeConfig();
  const socketUrl = config.public.apiBase.replace('/api/v1', '');

  const connect = () => {
    if (socket.value?.connected) {
      return socket.value;
    }

    try {
      socket.value = io(socketUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socket.value.on('connect', () => {
        connected.value = true;
        error.value = null;
        console.log('WebSocket connected');
      });

      socket.value.on('disconnect', () => {
        connected.value = false;
        console.log('WebSocket disconnected');
      });

      socket.value.on('connect_error', (err) => {
        error.value = err.message;
        console.error('WebSocket connection error:', err);
      });

      return socket.value;
    } catch (err: any) {
      error.value = err.message;
      console.error('Failed to create socket:', err);
      return null;
    }
  };

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
      connected.value = false;
    }
  };

  const joinJourney = (journeyId: string) => {
    if (socket.value && connected.value) {
      socket.value.emit('join-journey', journeyId);
      console.log('Joined journey room:', journeyId);
    }
  };

  const leaveJourney = (journeyId: string) => {
    if (socket.value && connected.value) {
      socket.value.emit('leave-journey', journeyId);
      console.log('Left journey room:', journeyId);
    }
  };

  const onLocationUpdate = (callback: (data: any) => void) => {
    if (socket.value) {
      socket.value.on('location-update', callback);
    }
  };

  const onJourneyStatus = (callback: (data: any) => void) => {
    if (socket.value) {
      socket.value.on('journey-status', callback);
    }
  };

  const offLocationUpdate = (callback?: (data: any) => void) => {
    if (socket.value) {
      socket.value.off('location-update', callback);
    }
  };

  const offJourneyStatus = (callback?: (data: any) => void) => {
    if (socket.value) {
      socket.value.off('journey-status', callback);
    }
  };

  return {
    socket,
    connected,
    error,
    connect,
    disconnect,
    joinJourney,
    leaveJourney,
    onLocationUpdate,
    onJourneyStatus,
    offLocationUpdate,
    offJourneyStatus,
  };
};
