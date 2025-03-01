//to load whenever the messages icon is clicked
document.addEventListener("DOMContentLoaded", function () {
    loadInbox().then(() => loadGroupChats());
});

//fucntion to load private messages
function loadInbox() {
    return fetch("../SQL/dbquery/inbox.php") // Return the fetch promise
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Error:", data.error);
                return;
            }
            displayInbox(data);
        })
        .catch(error => console.error("Fetch Error:", error));
}

//function to load group chat
function loadGroupChats() {
    fetch("../SQL/dbquery/inboxGroup.php")
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Error:", data.error);
                return;
            }
            displayGroups(data);
        })
        .catch(error => console.error("Fetch Error:", error));
}

// Display private messages
function displayInbox(inbox) {
    const inboxContainer = document.getElementById("inbox");
    inboxContainer.innerHTML = ""; // Clear previous content

    if (inbox.length === 0) {
        inboxContainer.innerHTML = "<p>No recent chats</p>";
        return;
    }

    inbox.forEach(user => {
        const profilePic = user.profile_picture 
            ? `${user.profile_picture}` 
            : "images/profile_img/default_profile.jpg"; // Default profile picture

        const lastMessage = user.latest_message || "No messages yet";
        const messageTime = user.message_timestamp ? formatDate(user.message_timestamp) : ""; // Avoid formatting null timestamps

        const chatItem = document.createElement("div");
        chatItem.classList.add("last-message");

        chatItem.innerHTML = `
            <div class="img-container">
                <img src="${profilePic}" alt="${user.firstName}" class="profile-pic">
            </div>
            <div class="names-msg">
                <h3>${user.firstName} ${user.lastName}</h3>
                <h4>${lastMessage}</h4>
            </div>
            <div class="timeSent">
                <h4>${messageTime}</h4>
            </div>
        `;

        chatItem.addEventListener("click", function () {
            openChat(user.chat_id);
        });

        inboxContainer.appendChild(chatItem);
    });
}

// Display group chats
function displayGroups(groups) {
    const inboxContainer = document.getElementById("inbox");

    if (groups.length === 0) {
        inboxContainer.innerHTML += ""; // Append instead of replacing
        return;
    }

    groups.forEach(group => {
        const groupPic = group.group_picture 
            ? `${group.group_picture}`  
            : "images/group_img/default_group.jpg"; // Default group picture

        const latestMessage = group.latest_message ? group.latest_message : "No messages yet";
        const timestamp = group.message_timestamp ? formatDate(group.message_timestamp) : "";

        const chatItem = document.createElement("div");
        chatItem.classList.add("last-message");

        chatItem.innerHTML = `
            <div class="img-container">
                <img src="${groupPic}" alt="${group.chat_name}" class="profile-pic">
            </div>
            <div class="names-msg">
                <h3>${group.chat_name}</h3>
                <h4>${latestMessage}</h4>
            </div>
            <div class="timeSent">
                ${timestamp ? `<h4>${timestamp}</h4>` : ""}
            </div>
        `;

        chatItem.addEventListener("click", function () {
            openChat(group.chat_id);
        });

        inboxContainer.appendChild(chatItem);
    });
}


function formatDate(timestamp) {
    if (!timestamp) return "No messages yet";
    const date = new Date(timestamp);
    return date.toLocaleString(); // Format to readable date
}

function openChat(chatId) {
    window.location.href = `messagePage.php?chat_id=${chatId}`;
}
