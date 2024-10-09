// public/script.js
document.getElementById('sendBtn').onclick = async function() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value;

    if (message.trim() === '') return;

    // Tambahkan pesan pengguna ke chatbox
    addMessage(message, 'user');

    try {
        // Kirim pesan ke server
        const response = await sendMessageToServer(message);
        if (response && response.reply) {
            addMessage(response.reply, 'bot');
        } else {
            addMessage('Maaf, terjadi kesalahan pada server.', 'bot');
        }
    } catch (error) {
        addMessage('Gagal menghubungi server. Silakan coba lagi.', 'bot');
        console.error('Error:', error);
    }

    // Kosongkan input
    userInput.value = '';
};

function addMessage(message, sender) {
    const chatbox = document.getElementById('chatbox');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = message;
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight; // Scroll ke bawah
}

async function sendMessageToServer(message) {
    const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}
