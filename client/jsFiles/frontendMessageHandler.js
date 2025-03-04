const socket = io("http://localhost:5500"); // Change if deployed

const messageInput = document.getElementById("message");
const chatContainer = document.querySelector(".main-message");
const typingIndicator = document.querySelector(".activity h3");
const loadMoreBtn = document.createElement("button");
const fileInput = document.createElement("input");
const modifyMembersContainer = document.querySelector(".modify-members-container");
const createGroupChatContainer = document.querySelector(".create-group-chat-container");
const groupMembersContainer = document.querySelector(".group-member-container");
const groupMembersList = document.querySelector(".group-members");

let currentUser = null;
let currentChat = null;
let typingTimeout;
let lastMessageTime = null;
let messages = [];

//for load more button
loadMoreBtn.innerText = "Load More...";
loadMoreBtn.classList.add("load-more-btn");
loadMoreBtn.addEventListener("click", loadMoreMessages);
chatContainer.prepend(loadMoreBtn);

// for file selection
fileInput.type = "file";
fileInput.accept = "image/jpeg, image/png, video/mp4"; // Allowed file types
fileInput.style.display = "none";
document.body.appendChild(fileInput);

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
        console.log("Received message:", message);
        const { user_id, text, file_url, file_type, timestamp } = message;
        // Ensure timestamp is valid
        const time = timestamp ? new Date(timestamp) : new Date();
        displayMessage(user_id, text, time, file_url, file_type);
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

// load message details
function loadCurrentChatDetails(chatId) {
    fetch(`../SQL/dbquery/getChatInfo.php?chat_id=${chatId}`)
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                console.error("Error loading chat:", data.message);
                return;
            }

            // Update profile picture and chat name
            const profileImg = document.querySelector(".profile img");
            const profileName = document.querySelector(".profileName h2");

            // Check if the profile picture and name exist in the data
            if (profileImg && data.profile_picture) {
                profileImg.src = data.profile_picture;
            }

            if (profileName && data.chat_name) {
                profileName.textContent = data.chat_name;
            }

            // Set userId on the profile container if the chat is not a group chat
            const createChatBtn = document.querySelector(".create-group-chat");
            if (createChatBtn && !data.is_group && data.user_id) {
                createChatBtn.dataset.userId = data.user_id;
            }

            // Handle group chat
            if (data.is_group) {
                modifyMembersContainer.style.display = "block";
                createGroupChatContainer.style.display = "none";
                groupMembersList.innerHTML = "";

                if (data.group_members && data.group_members.length > 0) {
                    data.group_members.forEach(member => {
                        const memberElement = document.createElement("h2");
                        memberElement.textContent = member;
                        groupMembersList.appendChild(memberElement);
                    });
                }

                groupMembersContainer.style.display = "block";
            } else {
                // Hide group chat related containers
                createGroupChatContainer.style.display = "block";
                modifyMembersContainer.style.display = "none";
                groupMembersContainer.style.display = "none";
            }

            // handles group
            if (!data.is_group) {
                createChatBtn.addEventListener("click", function () {
                    const userId = createChatBtn.dataset.userId;
                    if (userId) {
                        // Redirect to the createGroupPage.php with the selected user
                        window.location.href = `createGroupPage.php?preselected_users=${userId}`;
                    } else {
                        console.error("User ID not found for creating group chat");
                    }
                });
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}




// sends a message
function sendMessage() {
    const text = messageInput.value.trim();

    if (text === "" || !currentChat || !currentUser) return;

    socket.emit("message", { user_id: currentUser, chat_id: currentChat, text });

    messageInput.value = "";
}

//update the log of current users on chat
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

// Function to format timestamps
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // Convert "0" (midnight) to "12"
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    return `${month} ${day}, ${year} | ${hours}:${formattedMinutes} ${ampm}`;
}

// Load latest 20 messages
async function loadMessages() {
    try {
        const response = await fetch(`http://localhost/Projects/CST5-Final-Project/SQL/dbquery/getMessages.php?chat_id=${currentChat}&limit=20`);
        const data = await response.json();

        if (!data.success) {
            console.error("Error loading messages:", data.message);
            return;
        }

        chatContainer.innerHTML = "";
        chatContainer.appendChild(loadMoreBtn);

        // Sort messages by timestamp before displaying
        data.messages.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

        // Wait for all messages to be properly built before appending
        const messageElements = await Promise.all(data.messages.map(msg =>
            displayMessage(msg.user_id, msg.text, msg.time, msg.file_url, msg.file_type)
        ));

        messageElements.forEach(msgElement => chatContainer.appendChild(msgElement));

        if (data.messages.length > 0) {
            lastMessageTime = data.messages[0].time;
        }

        loadMoreBtn.style.display = data.messages.length < 20 ? "none" : "block";

        // Scroll to the bottom after loading messages
        chatContainer.scrollTop = chatContainer.scrollHeight;
    } catch (error) {
        console.error("Fetch error:", error);
    }
}


// Load older messages
async function loadMoreMessages() {
    if (!lastMessageTime) return;

    console.log("Loading more messages. Last message time:", lastMessageTime);

    try {
        const response = await fetch(`http://localhost/Projects/CST5-Final-Project/SQL/dbquery/getMessages.php?chat_id=${currentChat}&limit=20&last_time=${encodeURIComponent(lastMessageTime)}`);
        const data = await response.json();

        console.log("Response data:", data);

        if (!data.success) {
            console.error("Error loading more messages:", data.message);
            return;
        }

        if (data.messages.length === 0) {
            console.log("No more messages to load.");
            loadMoreBtn.style.display = "none";
            return;
        }

        // Sort messages in ascending order before displaying
        data.messages.sort((a, b) => new Date(a.time) - new Date(b.time));

        // Save current scroll position before adding messages
        const oldScrollHeight = chatContainer.scrollHeight;
        const oldScrollTop = chatContainer.scrollTop;

        // Insert messages manually at the top  
        const newMessageElements = await Promise.all(
            data.messages.map((msg) => displayMessage(msg.user_id, msg.text, msg.time, msg.file_url, msg.file_type))
        );

        // Insert messages at the top
        newMessageElements.reverse().forEach((msgElement) => {
            chatContainer.insertBefore(msgElement, chatContainer.children[1]); // Put messages below "Load More" button
        });

        // Update lastMessageTime to the oldest message's time  
        lastMessageTime = data.messages[0].time;  
        console.log("Updated lastMessageTime:", lastMessageTime);

        // Check if we just loaded the first message in the database
        if (data.messages.length < 20) {
            console.log("Reached the oldest message. Hiding Load More button.");
            loadMoreBtn.style.display = "none";
        }

        // Keep scroll position
        chatContainer.scrollTop = oldScrollTop + (chatContainer.scrollHeight - oldScrollHeight);

    } catch (error) {
        console.error("Fetch error:", error);
    }
}


// Display messages properly
async function displayMessage(user_id, text = null, time, file_url = null, file_type = null) {
    console.log("Displaying message:", { user_id, text, file_url, file_type });

    const messageDiv = document.createElement("div");
    messageDiv.classList.add(user_id == currentUser ? "message-me" : "message-others");

    let content = "";
    
    if (file_url && file_url !== "NULL") {
        if (file_type === "image") {
            content = `<img src="${file_url}" alt="Sent Image" class="chat-image">`;
        } else if (file_type === "video") {
            content = `<video controls class="chat-video"><source src="${file_url}" type="video/mp4"></video>`;
        } else {
            content = `<a href="${file_url}" target="_blank">Download File</a>`;
        }
    }

    if (text) {
        content += `<h3>${text}</h3>`;
    }

    const formattedTime = formatTimestamp(time); // Apply formatting

    if (user_id === currentUser) {
        messageDiv.innerHTML = `
            <div class="my-message">
                ${content}
                <h4>${formattedTime}</h4>
            </div>
        `;
    } else {
        // Fetch profile for other users
        let profileImage = "images/profile_img/default_profile.jpg";
        let userName = "Unknown";

        try {
            const userProfile = await fetchUserProfile(user_id);
            if (userProfile) {
                profileImage = userProfile.profile_picture || profileImage;
                userName = userProfile.firstName || userName;
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }

        messageDiv.innerHTML = `
            <img src="${profileImage}" alt="chathead" class="profile-pic-others">
            <div>
                <h2>${userName}</h2>
                ${content}
                <h4>${formattedTime}</h4>
            </div>
        `;
    }

    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    return messageDiv;
}

// To display when joining
async function displayUserJoined(user_id, text) {
    const user = await fetchUserProfile(user_id);
    console.log(`${user.firstName} ${text}`);
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

// Join chat when page loads
document.addEventListener("DOMContentLoaded", () => {
    const user_id = document.querySelector("#sender_id").value;
    const chat_id = document.querySelector("#chat_id").value;

    console.log("Current User Online:", user_id);
    console.log("Current Chat Id:", chat_id);
    joinChat(user_id, chat_id);
});

// call function when page loads
document.addEventListener("DOMContentLoaded", () => {
    const chat_id = document.querySelector("#chat_id").value;
    loadCurrentChatDetails(chat_id);
});

// Typing event
messageInput.addEventListener("input", () => {
    socket.emit("typing", { user_id: currentUser, chat_id: currentChat });

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        socket.emit("stopTyping", { user_id: currentUser, chat_id: currentChat });
    }, 500);
});

// Send message on button click
document.getElementById("sendBtn").addEventListener("click", sendMessage);

// Send message on Enter key press
messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Function to trigger file selection
function selectFile() {
    fileInput.click();
}

// Handle file upload
fileInput.addEventListener("change", async () => {
    if (!fileInput.files.length) return;

    const file = fileInput.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "video/mp4"];
    const maxSize = 20 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
        alert("Only JPG, JPEG, PNG, and MP4 files are allowed.");
        return;
    }

    if (file.size > maxSize) {
        alert("File size must not exceed 20MB.");
        return;
    }

    fileInput.value = "";

    if (typeof currentUser === "undefined" || typeof currentChat === "undefined") {
        alert("User or chat ID is missing.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", currentUser);
    formData.append("chat_id", currentChat);

    try {
        console.log("Uploading file...");

        const uploadResponse = await fetch("http://localhost/Projects/CST5-Final-Project/SQL/dbquery/uploadFileMessage.php", {
            method: "POST",
            body: formData,
        });

        const uploadData = await uploadResponse.json();
        if (!uploadData.success) {
            console.error("Upload error:", uploadData.message);
            alert("File upload failed: " + uploadData.message);
            return;
        }

        const { file_url, file_type } = uploadData;
        console.log("File uploaded successfully:", file_url, file_type);

        console.log("Emitting file message:", { file_url, file_type });
        socket.emit("message", { user_id: currentUser, chat_id: currentChat, text: null, file_url, file_type });

    } catch (error) {
        console.error("File upload failed:", error);
        alert("An error occurred while uploading the file.");
    }
});

// Attach event listener to the attachment button
document.getElementById("sendAttachmentBtn").addEventListener("click", selectFile);

const modal = document.getElementById("modifyGroupModal");
const openModalBtn = document.getElementById("modifyMembersBtn");
const closeModal = document.querySelector(".close");
const groupMembersListModal = document.getElementById("groupMembersList");
const addUserSelect = document.getElementById("addUserSelect");
const addUserBtn = document.getElementById("addUserBtn");

// Open modal and load members
openModalBtn.addEventListener("click", () => {
    modal.style.display = "block";
    loadGroupMembers();
    loadAvailableUsers();
});

// Close modal
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// Load current group members
function loadGroupMembers() {
    if (!currentChat) {
        console.error("No chat selected.");
        return;
    }
    
    fetch(`../SQL/dbquery/getGroupMembers.php?group_id=${currentChat}`)
        .then(response => response.json())
        .then(data => {
            groupMembersListModal.innerHTML = "";
            data.forEach(member => {
                let li = document.createElement("li");
                li.classList.add("currentMembersListModal");

                // Create an h2 element for the username
                let usernameText = document.createElement("h2");
                usernameText.textContent = member.username;
                li.appendChild(usernameText);

                // Only show remove button if the member is not the current user
                if (member.user_id !== currentUser) {
                    let removeBtn = document.createElement("button");
                    removeBtn.classList.add("removeMemberBtn");
                
                    let removeText = document.createElement("h2");
                    removeText.textContent = "Remove";
                
                    removeBtn.appendChild(removeText); // Append h2 inside button
                    li.appendChild(removeBtn); // Append button to the list item
                }
                

                groupMembersListModal.appendChild(li);
            });
        });
}


function loadAvailableUsers() {
    if (!currentChat) {
        console.error("Error: chat_id is undefined.");
        return;
    }

    fetch(`../SQL/dbquery/getUsers.php?group_id=${currentChat}`)
        .then(response => response.json())
        .then(data => {
            addUserSelect.innerHTML = "";
            
            if (data.error) {
                console.error("Error:", data.error);
                return;
            }

            data.forEach(user => {
                let option = document.createElement("option");
                option.value = user.user_id;
                option.textContent = user.username;
                addUserSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Fetch error:", error));
}


// Add user to group
addUserBtn.addEventListener("click", () => {
    let userId = addUserSelect.value;
    let selectedOption = addUserSelect.options[addUserSelect.selectedIndex]; // Get the selected option

    if (!currentChat) {
        console.error("No chat selected.");
        return;
    }

    fetch("../SQL/dbquery/addUserToGroup.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `group_id=${currentChat}&user_id=${userId}`
    })
    .then(response => response.json()) // Assuming PHP returns a JSON response
    .then(data => {
        if (data.error) {
            console.error("Error:", data.error);
            return;
        }

        // Remove the added user from the available users dropdown
        selectedOption.remove();

        // Reload the group members list
        loadGroupMembers();
    })
    .catch(error => console.error("Fetch error:", error));
});

// Remove user from group
function removeUser(userId) {
    if (!currentChat) {
        console.error("No chat selected.");
        return;
    }
    
    fetch("../SQL/dbquery/removeUserFromGroup.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `group_id=${currentChat}&user_id=${userId}`
    }).then(() => loadGroupMembers());
}
