const socket = io("http://localhost:5500"); // Change if deployed

const messageInput = document.getElementById("message");
const chatContainer = document.querySelector(".main-message");
const typingIndicator = document.querySelector(".activity h3");
const loadMoreBtn = document.createElement("button");

let currentUser = null;
let currentChat = null;
let typingTimeout;
let lastMessageTime = null; // Track the oldest message loaded
let messages = []; // Declare messages array

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

    socket.on("join_leftChat", (data) => {
        displayUserJoined(data.user_id, data.text);
    });

    socket.on("message", (message) => {
        messages.push(message); // Add new message to array
    
        // Display the new message at the bottom
        displayMessage(message.user_id, message.text, message.time, true);
    
        // Scroll to the bottom to show the latest message
        chatContainer.scrollTop = chatContainer.scrollHeight;
    });
    


    socket.on("userList", (data) => {
        updateUserList(data.users);
    });

    socket.on("errorMessage", (msg) => {
        console.error("Error:", msg);
    });

    socket.on("typing", async (user_id, chat_id) => {
        const user = await fetchUserProfile(user_id);
        if (user_id !== currentUser) {
            typingIndicator.innerText = `${user.firstName} is typing...`;
        }
    });
    

    socket.on("stopTyping", (user_id, chat_id) => {
        typingIndicator.innerText = "";
    });
}

// load latest 20 messages
async function loadMessages() {
    try {
        const response = await fetch(`http://localhost/Projects/CST5-Final-Project/SQL/dbquery/getMessages.php?chat_id=${currentChat}&limit=20`);
        const data = await response.json();

        if (!data.success) {
            console.error("Error loading messages:", data.message);
            return;
        }

        // Clear chat UI before displaying messages
        chatContainer.innerHTML = "";
        chatContainer.appendChild(loadMoreBtn);

        // Sort messages in ascending order by timestamp
        data.messages.sort((a, b) => new Date(a.time) - new Date(b.time));

        // Display sorted messages
        data.messages.forEach((msg) => {
            displayMessage(msg.user_id, msg.text, msg.time, true);
        });

        // Update lastMessageTime to the oldest message
        if (data.messages.length > 0) {
            lastMessageTime = data.messages[0].time;
        }

        // Hide Load More button if fewer than 20 messages are loaded
        loadMoreBtn.style.display = data.messages.length < 20 ? "none" : "block";
    } catch (error) {
        console.error("Fetch error:", error);
    }
}


// load more messages when clicking "load more" button
async function loadMoreMessages() {
    if (!lastMessageTime) return; // No older messages to load

    try {
        const response = await fetch(`http://localhost/Projects/CST5-Final-Project/SQL/dbquery/getMessages.php?chat_id=${currentChat}&limit=20&last_time=${encodeURIComponent(lastMessageTime)}`);
        const data = await response.json();

        if (!data.success) {
            console.error("Error loading more messages:", data.message);
            return;
        }

        // Sort messages in ascending order before inserting at the top
        data.messages.sort((a, b) => new Date(a.time) - new Date(b.time));

        // Insert messages at the top in order
        data.messages.forEach((msg) => {
            displayMessage(msg.user_id, msg.text, msg.time, false);
        });

        // Update lastMessageTime to the new oldest message timestamp
        if (data.messages.length > 0) {
            lastMessageTime = data.messages[0].time;
        }

        // Hide Load More button if there are no more messages to load
        if (data.messages.length < 20) {
            loadMoreBtn.style.display = "none";
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}


// load message details
function loadChatInfo(chatId) {
    fetch(`../SQL/dbquery/getChatInfo.php?chat_id=${chatId}`)
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                console.error("Error loading chat:", data.message);
                return;
            }

            // Update profile picture
            document.querySelector(".profile img").src = data.profile_picture;

            // Update chat name
            document.querySelector(".profileName h2").textContent = data.chat_name;

            // Select UI containers
            const addMembersContainer = document.querySelector(".add-members-container");
            const createChatContainer = document.querySelector(".create-chat-container");
            const groupMembersContainer = document.querySelector(".group-member-container");
            const groupMembersList = document.querySelector(".group-members");

            if (data.is_group) {
                // Show "Add Members" and group members list
                addMembersContainer.style.display = "block";
                createChatContainer.style.display = "none"; // Hide "Create Group"

                // Clear existing group members
                groupMembersList.innerHTML = "";

                // Populate group members list
                data.group_members.forEach(member => {
                    const memberElement = document.createElement("h2");
                    memberElement.textContent = member;
                    groupMembersList.appendChild(memberElement);
                });

                groupMembersContainer.style.display = "block";
            } else {
                // Show "Create Group" button
                createChatContainer.style.display = "block";
                addMembersContainer.style.display = "none"; // Hide "Add Members"
                groupMembersContainer.style.display = "none"; // Hide group members
            }
        })
        .catch(error => console.error("Fetch error:", error));
}

// call function when page loads
document.addEventListener("DOMContentLoaded", () => {
    const chat_id = document.querySelector("#chat_id").value;
    loadChatInfo(chat_id);
});


// sends a message
function sendMessage() {
    const text = messageInput.value.trim();

    if (text === "" || !currentChat || !currentUser) return;

    socket.emit("message", { user_id: currentUser, chat_id: currentChat, text });

    messageInput.value = "";
}

// display messages
async function displayMessage(user_id, text, time, appendToBottom = true) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add(user_id == currentUser ? "message-me" : "message-others");

    if (user_id !== currentUser) {
        const userProfile = await fetchUserProfile(user_id);
        const profileImage = userProfile && userProfile.profile_picture 
        ? userProfile.profile_picture 
        : "images/profile_img/default_profile.jpg";

        messageDiv.innerHTML = `
            <img src="${profileImage}" alt="chathead">
            <div>
                <h2>${userProfile.firstName}</h2>
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

    // order using timestamp
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

    // If no earlier message exists, append to the bottom
    if (!inserted) {
        chatContainer.appendChild(messageDiv);
    }

    // Scroll only if the user is at the bottom
    if (appendToBottom) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}


// To display when joining
async function displayUserJoined(user_id, text) {
    const user = await fetchUserProfile(user_id);
    console.log(`${user.firstName} ${text}`);
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

//to display profile per message
async function fetchUserProfile(user_id) {
    try {
        const response = await fetch(`http://localhost/Projects/CST5-Final-Project/SQL/dbquery/getUserProfile.php?user_id=${user_id}`);
        const data = await response.json();

        if (!data.success) {
            console.error("Error fetching user profile:", data.message);
            return null;
        }

        return data.profile;
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
}
