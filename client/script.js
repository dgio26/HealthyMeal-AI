const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const sendButton = form.querySelector('button');

let conversationHistory = [];

// Welcome message
window.addEventListener('load', () => {
    const welcomeText = "Halo! Saya HealthyMeal AI. Ada yang bisa saya bantu terkait menu sehat hari ini?";
    appendMessage('bot', welcomeText);
    conversationHistory.push({ role: 'model', text: welcomeText });
});


form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const userMessage = input.value.trim();
    if (!userMessage) return;

    appendMessage('user', userMessage);
    conversationHistory.push({ role: 'user', text: userMessage });
    input.value = '';
    sendButton.disabled = true;

    const typingIndicator = appendMessage('bot', '...');
    typingIndicator.classList.add('typing');

    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ conversation: conversationHistory }),
        });

        if (!response.ok) {
            throw new Error('Gagal mendapatkan respon dari server.');
        }

        const data = await response.json();
        
        if (typingIndicator.parentNode === chatBox) {
            chatBox.removeChild(typingIndicator);
        }

        if (data.text) {
            appendMessage('bot', data.text);
            conversationHistory.push({ role: 'model', text: data.text });
        } else {
            appendMessage('bot', 'Maaf, tidak ada respon yang diterima.');
        }
    } catch (error) {
        if (typingIndicator.parentNode === chatBox) {
            chatBox.removeChild(typingIndicator);
        }
        appendMessage('bot', error.message || 'Gagal mendapatkan respon dari server.');
    } finally {
        sendButton.disabled = false;
    }
});

function appendMessage(sender, text) {
    const msgContainer = document.createElement('div');
    msgContainer.classList.add('message', `${sender}-message`);

    const msg = document.createElement('div');
    msg.classList.add('message', sender);
    msg.textContent = text;
    
    msgContainer.appendChild(msg);
    chatBox.appendChild(msgContainer);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msgContainer;
}
