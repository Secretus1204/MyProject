const socket = io("http://localhost:5500"); // Change if deployed

const messageInput = document.getElementById("message");
const chatContainer = document.querySelector(".main-message");
const typingIndicator = document.querySelector(".activity h3");
const loadMoreBtn = document.createElement("button");

let currentUser = null;
let currentChat = null;
let typingTimeout;
let lastMessageTime = null; // Track the oldest message loaded

// Set up Load More Button
loadMoreBtn.innerText = "Load More...";
loadMoreBtn.classList.add("load-more-btn");
loadMoreBtn.addEventListener("click", loadMoreMessages);
chatContainer.prepend(loadMoreBtn);

// Connect the user to the chat
function joinChat(user_id, chat_id) {
    currentUser = user_id;
    currentChat = chat_id;
    loadMessages();
    socket.emit("enterRoom", { user_id, chat_id });

    socket.on("join_leftChat", (data) => displayUserJoined(data.user_id, data.text));
    socket.on("message", (message) => updateChat(message));
    socket.on("userList", (data) => updateUserList(data.users));
    socket.on("errorMessage", (msg) => console.error("Error:", msg));
    socket.on("typing", async (user_id) => displayTyping(user_id));
    socket.on("stopTyping", () => typingIndicator.innerText = "");
}

// Load latest 20 messages
async function loadMessages() {
    try {
        const response = await fetch(`http://localhost/Projects/CST5-Final-Project/SQL/dbquery/getMessages.php?chat_id=${currentChat}&limit=20`);
        const data = await response.json();
        if (!data.success) return console.error("Error loading messages:", data.message);

        chatContainer.innerHTML = "";
        chatContainer.appendChild(loadMoreBtn);
        data.messages.sort((a, b) => new Date(a.time) - new Date(b.time));
        data.messages.forEach((msg) => displayMessage(msg.user_id, msg.text, msg.time, true));
        if (data.messages.length > 0) lastMessageTime = data.messages[0].time;
        loadMoreBtn.style.display = data.messages.length < 20 ? "none" : "block";
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

// Load more messages
async function loadMoreMessages() {
    if (!lastMessageTime) return;
    try {
        const response = await fetch(`http://localhost/Projects/CST5-Final-Project/SQL/dbquery/getMessages.php?chat_id=${currentChat}&limit=20&last_time=${encodeURIComponent(lastMessageTime)}`);
        const data = await response.json();
        if (!data.success) return console.error("Error loading more messages:", data.message);

        data.messages.sort((a, b) => new Date(a.time) - new Date(b.time));
        data.messages.forEach((msg) => displayMessage(msg.user_id, msg.text, msg.time, false));
        if (data.messages.length > 0) lastMessageTime = data.messages[0].time;
        if (data.messages.length < 20) loadMoreBtn.style.display = "none";
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

// Send message
function sendMessage() {
    const text = messageInput.value.trim();
    if (text === "" || !currentChat || !currentUser) return;
    socket.emit("message", { user_id: currentUser, chat_id: currentChat, text });
    messageInput.value = "";
}

// Display message
async function displayMessage(user_id, text, time, appendToBottom = true) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add(user_id == currentUser ? "message-me" : "message-others");
    
    if (user_id !== currentUser) {
        const userProfile = await fetchUserProfile(user_id);
        messageDiv.innerHTML = `
            ${userProfile?.profile_picture ? `<img src="${userProfile.profile_picture}" alt="chathead">` : ""}
            <div><h3>${text}</h3><h4>${time}</h4></div>
        `;
    } else {
        messageDiv.innerHTML = `<div><h3>${text}</h3><h4>${time}</h4></div>`;
    }

    let inserted = false;
    const messages = chatContainer.querySelectorAll(".message-me, .message-others");
    for (let i = 0; i < messages.length; i++) {
        const existingTime = messages[i].querySelector("h4").innerText.trim();
        if (new Date(time) < new Date(existingTime)) {
            chatContainer.insertBefore(messageDiv, messages[i]);
            inserted = true;
            break;
        }
    }
    if (!inserted) chatContainer.appendChild(messageDiv);
    if (appendToBottom) chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Typing event
messageInput.addEventListener("input", () => {
    socket.emit("typing", { user_id: currentUser, chat_id: currentChat });
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        socket.emit("stopTyping", { user_id: currentUser, chat_id: currentChat });
    }, 500);
});

// Fetch user profile
async function fetchUserProfile(user_id) {
    try {
        const response = await fetch(`http://localhost/Projects/CST5-Final-Project/SQL/dbquery/getUserProfile.php?user_id=${user_id}`);
        const data = await response.json();
        if (!data.success) return console.error("Error fetching user profile:", data.message);
        return data.profile;
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
}

// Page load events
window.addEventListener("DOMContentLoaded", () => {
    const user_id = document.querySelector("#sender_id").value;
    const chat_id = document.querySelector("#chat_id").value;
    console.log("Current User Online:", user_id);
    console.log("Current Chat Id:", chat_id);
    joinChat(user_id, chat_id);
});

document.getElementById("sendBtn").addEventListener("click", sendMessage);
messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

function updateUserList(users) {
    console.log("Current Users:");
    if (!Array.isArray(users)) return console.error("Invalid user list:", users);
    users.forEach(user => console.log(`User Joined ID: ${user}`));
}

async function displayUserJoined(user_id, text) {
    const user = await fetchUserProfile(user_id);
    console.log(`${user.firstName} ${text}`);
}

async function displayTyping(user_id) {
    const user = await fetchUserProfile(user_id);
    if (user_id !== currentUser) typingIndicator.innerText = `${user.firstName} is typing...`;
}
