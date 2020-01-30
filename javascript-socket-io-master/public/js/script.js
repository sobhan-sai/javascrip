let channelsList = [];

/* Appends div tag */
function updateHtml(data) {
	const chatContainer = document.getElementById('chatContainer');
	const newDiv = document.createElement('div');
	newDiv.className = 'col-12';
	newDiv.innerHTML = data;
	chatContainer.insertBefore(newDiv, chatContainer.firstChild);
}

/* Appends div tag for alert message*/
function alertMessage(channel, type) {
	const alertContainer = document.getElementById('alertContainer');
	const messageDiv = `<div class="alert alert-success alert-dismissible fade show" role="alert">
    You are ${type} to <strong>${channel}</strong> successfully!
	<button type="button" class="close" 
	data-dismiss="alert" aria-label="Close">
	<span aria-hidden="true">&times;</span></button></div>`;
	alertContainer.innerHTML = messageDiv;
}

/* Send message function*/
function sendMessage(event, socket) {
	event.preventDefault();
	const channel = document.getElementById('channel').value;
	const message = document.getElementById('message').value;
	const username = document.getElementById('username').value;

	const htmlData = `<div class="card sent-message"><div class="card-body">
 	<p class="card-text">Me : ${message}</p></div></div>`;

	updateHtml(htmlData);

	socket.emit('message', {username, channel, message});
}

/* Function to join a channel*/
function joinChannel(event, socket) {
	event.preventDefault();
	const channel = document.getElementById('newchannel').value;
	socket.emit('joinChannel', {channel});
}

/* Function to leave a channel*/
function leaveChannel(event, socket) {
	event.preventDefault();
	const channel = document.getElementById('newchannel').value;
	socket.emit('leaveChannel', {channel});
}

/* Function to display welcome message*/
function onWelcomeMessageReceived(msg) {
	const htmlData = `<div class="card received-message"><div class="card-body">
 	<p class="card-text">System : ${msg}</p></div></div>`;
	updateHtml(htmlData);
}

function onNewMessageReceived(input) {
	const user = document.getElementById('username').value;
	if (input.username !== user) {
		const htmlData = `<div class="card received-message"><div class="card-body">
		<p class="card-text">${input.username} : ${input.message}</p></div></div>`;
		updateHtml(htmlData);
	}
}

function onAddedToNewChannelReceived(input) {
	channelsList = channelsList.concat(input.channel.split(','));

	for (let channel of channelsList) {
		let option = document.createElement('option');
        option.value = channel;
        document.getElementById('channelsList').appendChild(option);
	}

	alertMessage(input.channel, 'added');
}

function onRemovedFromChannelReceived(input) {
    let options = channelsList.getElementsByTagName('option');
    for (let i = 0; i < options.length; i++) {
        if (options[i].innerHTML === input.channel) {
            channelsList.removeChild(options[i]);
            break;
        }
    }

	alertMessage(input.channel, 'removed');
}

module.exports = {
	sendMessage,
	joinChannel,
	leaveChannel,
	onWelcomeMessageReceived,
	onNewMessageReceived,
	onAddedToNewChannelReceived,
	onRemovedFromChannelReceived
};

// You will get error - Uncaught ReferenceError: module is not defined
// while running this script on browser which you shall ignore
// as this is required for testing purposes and shall not hinder
// it's normal execution

