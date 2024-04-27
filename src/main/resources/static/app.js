let username = null;
let socket = null;
let stompClient = null;

function login() {
    const usernameInput = document.getElementById('usernameInput');
    username = usernameInput.value.trim();
    if (username) {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('chat').style.display = 'block';
        document.getElementById('messageForm').style.display = 'block';
        console.log("Calling connect");
        connect();
    }
}

function connect() {
    socket = new SockJS('/chat');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/public', function (message) {
            showMessage(JSON.parse(message.body));
        });
    },
        function (error) {
            console.log('Connection error: ' + error);
            setTimeout(connect, 5000);
        });
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    if (message) {
        const chatMessage = {
            content: message,
            sender: username
        };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
}

function showMessage(message) {
    console.log('Received: ' + message);
    const chatDiv = document.getElementById('chat');
    const messageElement = document.createElement('div');
    messageElement.textContent = message.sender + ': ' + message.content;
    chatDiv.appendChild(messageElement);
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

document.getElementById('loginButton').addEventListener('click', function (e) {
    e.preventDefault();
    login();
});

document.getElementById('messageForm').addEventListener('submit', function (e) {
    e.preventDefault();
    sendMessage();
});
