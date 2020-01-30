function bootstrapSocketServer(io) {
	io.on('connection', (socket) => {
		socket.on('register', (data) => {
			if (data.username.length > 0) {
				socket.emit('welcomeMessage', 'Welcome ' + data.username + ' !!');
			}
			if (data.channels.length > 0) {
				socket.emit('addedToChannel', { channel: data.channels.join(',') });
			}
		});

		socket.on('joinChannel', (data) => {
			socket.emit('addedToChannel', data);
		});

		socket.on('leaveChannel', (data) => {
			socket.emit('removedFromChannel', data);
		});

		socket.on('message', (data) => {
			socket.broadcast.emit('newMessage', data);
		});
	});
}

module.exports = bootstrapSocketServer;
