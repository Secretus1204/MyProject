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

    socket.on("join_leftChat", (data) => {
        displayUserJoined(data.user_id, data.text);
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

    socket.on("typing", (user_id, chat_id) => {
        if (user_id !== currentUser) {
            typingIndicator.innerText = `User ${user_id} is typing...`;
        }
    });

    socket.on("stopTyping", (user_id, chat_id) => {
        typingIndicator.innerText = "";
    });

    loadMessages();
}

// Load messages from the database (limit 20 initially)
async function loadMessages() {
    try {
        const response = await fetch(`http://localhost/Projects/CST5-Final-Project/SQL/dbquery/getMessages.php?chat_id=${currentChat}&limit=20`);
        const data = await response.json();

        if (!data.success) {
            console.error("Error loading messages:", data.message);
            return;
        }

        // Clear old messages when loading initially
        chatContainer.innerHTML = "";

        data.messages.forEach((msg) => {
            displayMessage(msg.user_id, msg.text, msg.time, true);
        });

        // Set lastMessageId to the oldest message loaded
        if (data.messages.length > 0) {
            lastMessageId = data.messages[data.messages.length - 1].id;
        }

        // Hide Load More button if fewer than 20 messages are loaded
        loadMoreBtn.style.display = data.messages.length < 20 ? "none" : "block";
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

// Send a message
function sendMessage() {
    const text = messageInput.value.trim();

    if (text === "" || !currentChat || !currentUser) return;

    socket.emit("message", { user_id: currentUser, chat_id: currentChat, text });

    messageInput.value = "";
}

// Display message in the chat UI
async function displayMessage(user_id, text, time) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add(user_id == currentUser ? "message-me" : "message-others");

    if (user_id !== currentUser) {
        const userProfile = await fetchUserProfile(user_id);

        messageDiv.innerHTML = `
            ${userProfile && userProfile.profile_picture ? `<img src="${userProfile.profile_picture}" alt="chathead">` : ""}
            <div>
                <h3>${text}</h3>
                <h4>${time}</h4>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div>
                <h3>${text}</h3>
                <h4>${time}</h4>
            </div>
        `;
    }

    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

//to display when joining
async function displayUserJoined(user_id, text){
    const user = await fetchUserProfile(user_id);
    const notifyDiv = document.createElement("div");
    notifyDiv.classList.add("userOnline");
    notifyDiv.innerHTML = `
        <h3>${user.firstName} ${text}</h3>
    `;

    chatContainer.appendChild(notifyDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Typing event
messageInput.addEventListener("input", () => {
    socket.emit("typing", { user_id: currentUser, chat_id: currentChat });

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        socket.emit("stopTyping", { user_id: currentUser, chat_id: currentChat });
    }, 500);
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
    console.log("Current Users:");
    
    if (!Array.isArray(users)) {
        console.error("Invalid user list:", users);
        return;
    }

    users.forEach(user => {
        console.log(`User Joined ID: ${user}`);
    });
}

async function fetchUserProfile(user_id) {
    try {
        const response = await fetch(`http://localhost/Projects/CST5-Final-Project/SQL/dbquery/getUserProfile.php?user_id=${user_id}`);
        const data = await response.json();

        if (!data.success) {
            console.error("Error fetching user profile:", data.message);
            return null;
        }

        return data.profile; // Assuming `data.profile` contains { username, profile_picture }
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
}
