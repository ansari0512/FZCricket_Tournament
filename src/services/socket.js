import { io } from 'socket.io-client';

// Initialize Socket.io client connection
const socket = io(process.env.SOCKET_SERVER_URL);

// Event listener for score updates
socket.on('scoreUpdate', (data) => {
    console.log('Score Update:', data);
    // Handle score update logic here
});

// Event listener for match status updates
socket.on('matchStatus', (status) => {
    console.log('Match Status Update:', status);
    // Handle match status update logic here
});

export default socket;
