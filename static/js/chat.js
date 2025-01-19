class ChatClient {
    constructor() {
        this.ws = new WebSocket(`ws://${window.location.host}/ws/chat`);
        this.messageCallbacks = [];
        
        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            this.messageCallbacks.forEach(callback => callback(message));
        };
    }

    sendMessage(roomId, content) {
        const message = {
            room_id: roomId,
            content: content,
            timestamp: Date.now(),
            user_id: localStorage.getItem('userId') // You'll need to implement user authentication
        };
        
        this.ws.send(JSON.stringify(message));
    }

    onMessage(callback) {
        this.messageCallbacks.push(callback);
    }
}

// Initialize chat when clicking on chat button
document.querySelectorAll('.chat-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const friendCard = this.closest('.friend-card');
        const friendName = friendCard.querySelector('.friend-name').textContent;
        
        // Create chat window
        const chatWindow = document.createElement('div');
        chatWindow.className = 'chat-window';
        chatWindow.innerHTML = `
            <div class="chat-header">
                <h3>${friendName}</h3>
                <button class="close-chat">×</button>
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input">
                <input type="text" placeholder="Type a message...">
                <button>Send</button>
            </div>
        `;
        
        document.body.appendChild(chatWindow);
        
        // Initialize chat client
        const chat = new ChatClient();
        
        // Handle sending messages
        const input = chatWindow.querySelector('input');
        const sendBtn = chatWindow.querySelector('button');
        
        sendBtn.addEventListener('click', () => {
            if (input.value.trim()) {
                chat.sendMessage('room-1', input.value);
                input.value = '';
            }
        });
        
        // Handle receiving messages
        chat.onMessage(message => {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message';
            messageDiv.textContent = message.content;
            chatWindow.querySelector('.chat-messages').appendChild(messageDiv);
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.querySelector('.message-input input');
    const sendButton = document.querySelector('.send-btn');
    const messagesContainer = document.querySelector('.messages-container');

    // Check if user is logged in
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = '/login';  // Redirect to login if not logged in
        return;
    }

    async function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            try {
                // Display sent message immediately (right side)
                const messageElement = document.createElement('div');
                messageElement.className = 'message sent';
                messageElement.innerHTML = `
                    <div class="message-content">
                        <p>${message}</p>
                        <span class="time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                `;
                messagesContainer.appendChild(messageElement);

                const response = await fetch('/api/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        message: message,
                        username: currentUser
                    })
                });
                
                if (!response.ok) {
                    throw new Error('Failed to send message');
                }

                // Display "received" message (left side)
                const receivedElement = document.createElement('div');
                receivedElement.className = 'message received';
                receivedElement.innerHTML = `
                    <div class="message-content">
                        <p>received</p>
                        <span class="time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                `;
                messagesContainer.appendChild(receivedElement);
                
                // Clear input
                messageInput.value = '';
                
                // Scroll to bottom
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            } catch (error) {
                console.error('Error sending message:', error);
                alert('Error sending message. Please try logging in again.');
                window.location.href = '/login';
            }
        }
    }

    // Send button click handler
    sendButton.addEventListener('click', sendMessage);

    // Enter key handler
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}); 