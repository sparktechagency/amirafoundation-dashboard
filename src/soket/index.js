import { io } from 'socket.io-client';

const URL = 'http://172.252.13.74:4001/';

export const socket = io(URL);
