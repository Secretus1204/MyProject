const socket = io("http://localhost/Projects/CST5-Final-Project/client/messagePage.php"); // Change if deployed

const messageInput = document.getElementById("message");
const chatContainer = document.querySelector(".main-message");

let currentUser = null;
let currentChat = null;
let typingTimeout;

// Connect the user to the chat
function joinChat(user_id, chat_id) {
    currentUser = user_id;
    currentChat = chat_id;

    socket.emit("enterRoom", { user_id, chat_id });

    socket.on("message", (message) => {
        displayMessage(message.user_id, message.text, message.time);
    });

    socket.on("userList", (data) => {
        updateUserList(data.users);
    });

    socket.on("errorMessage", (msg) => {
        console.error("Error:", msg);
    });
}

// Send a message
function sendMessage() {
    const text = messageInput.value.trim();

    if (text === "" || !currentChat || !currentUser) return;

    socket.emit("message", { user_id: currentUser, chat_id: currentChat, text });

    messageInput.value = "";
}

// Display message in the chat UI
function displayMessage(user_id, text, time) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    if (user_id == currentUser) messageDiv.classList.add("my-message");

    messageDiv.innerHTML = `
        <p><strong>${user_id}</strong>: ${text}</p>
        <span class="time">${time}</span>
    `;

    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Typing indicator
document.getElementById("message").addEventListener("input", () => {
    socket.emit("typing", { user_id: currentUser, chat_id: currentChat });

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        socket.emit("stopTyping", { user_id: currentUser, chat_id: currentChat });
    }, 2000);
});

socket.on("typing", (user_id) => {
    document.getElementById("typingIndicator").innerText = `${user_id} is typing...`;
});

socket.on("stopTyping", () => {
    document.getElementById("typingIndicator").innerText = "";
});

// Join chat when page loads
document.addEventListener("DOMContentLoaded", () => {
    const user_id = $_SESSION['currentUserId'];
    const chat_id = document.querySelector("#chat_id").value;

    console.log(user_id);
    joinChat(user_id, chat_id);
});

// Send message on button click
document.getElementById("sendBtn").addEventListener("click", sendMessage);

// Send message on enter key press
document.getElementById("sendBtn").addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});