import { io } from 'socket.io-client';

const URL = 'http://192.168.10.144:4001/';

export const socket = io(URL);
