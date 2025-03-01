const socket = io("http://localhost:5500"); // Change if deployed

const messageInput = document.getElementById("message");
const chatContainer = document.querySelector(".main-message");
const typingIndicator = document.querySelector(".activity h3");

let currentUser = null;
let currentChat = null;
let typingTimeout;

// Connect the user to the chat
function joinChat(user_id, chat_id) {
    currentUser = user_id;
    currentChat = chat_id;

    socket.emit("enterRoom", { user_id, chat_id });

    socket.on("joinChat", (data) => {
        displayUserJoined(data.user_id);
    });

    socket.on("message", (message) => {
        displayMessage(message.user_id, message.text, message.time);
    });

    socket.on("userList", (data) => {
        updateUserList(data.users);
    });

    socket.on("errorMessage", (msg) => {
        console.error("Error:", msg);
    });

    socket.on("typing", (user_id) => {
        if (user_id !== currentUser) {
            typingIndicator.innerText = `User ${user_id} is typing...`;
        }
    });

    socket.on("stopTyping", () => {
        typingIndicator.innerText = "";
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
    messageDiv.classList.add(user_id == currentUser ? "message-me" : "message-others");

    messageDiv.innerHTML = `
        <div>
            <h3>${text}</h3>
            <h4>${time}</h4>
        </div>
    `;

    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function displayUserJoined(user_id){
    const notifyDiv = document.createElement("div");
    notifyDiv.classList.add("userOnline");
    notifyDiv.innerHTML = `
        <h3>${user_id}</h3>
    `;

    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Typing event
messageInput.addEventListener("input", () => {
    socket.emit("typing", { user_id: currentUser, chat_id: currentChat });

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        socket.emit("stopTyping", { user_id: currentUser, chat_id: currentChat });
    }, 2000);
});

// Join chat when page loads
document.addEventListener("DOMContentLoaded", () => {
    const user_id = document.querySelector("#sender_id").value;
    const chat_id = document.querySelector("#chat_id").value;

    console.log("Current User Online:", user_id);
    console.log("Current Chat Id:", chat_id);
    joinChat(user_id, chat_id);
});

// Send message on button click
document.getElementById("sendBtn").addEventListener("click", sendMessage);

// Send message on Enter key press (fixes the issue)
messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault(); // Prevent new line in textarea
        sendMessage();
    }
});

function updateUserList(users) {
    const userListElement = document.getElementById("userList"); // Make sure this element exists in your HTML
    if (!userListElement) {
        console.error("User list element not found.");
        return;
    }

    userListElement.innerHTML = ""; // Clear previous list
    users.forEach(user => {
        const li = document.createElement("li");
        li.textContent = `User ID: ${user}`;
        userListElement.appendChild(li);
    });
}