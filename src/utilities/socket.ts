import { io } from 'socket.io-client';
import { SOCKET_SERVER_URL } from './constants';

export const connectSocket = () => io(SOCKET_SERVER_URL);
