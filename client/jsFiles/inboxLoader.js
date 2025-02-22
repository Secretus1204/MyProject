document.addEventListener("DOMContentLoaded", function () {
    loadInbox();
});

function loadInbox() {
    fetch("../SQL/dbquery/inbox.php")
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

function displayInbox(inbox) {
    const inboxContainer = document.getElementById("inbox");
    inboxContainer.innerHTML = ""; // Clear previous content

    if (inbox.length === 0) {
        inboxContainer.innerHTML = "<p>No recent chats</p>";
        return;
    }

    inbox.forEach(user => {
        const chatItem = document.createElement("div");
        chatItem.classList.add("last-message");

        chatItem.innerHTML = `
                <div class="img-container">
                <img src="${user.profile_picture}" alt="${user.firstName}" class="profile-pic">
                </div>
                <div class="names-msg">
                <h3>${user.firstName} ${user.lastName}</h3>
                <h4>${user.message_text || "No messages yet"}</h4>
                </div>
                <div class="timeSent">
                <h4>${formatDate(user.created_at)}</h4>
                </div>
        `;

        chatItem.addEventListener("click", function () {
            openChat(user.chat_id);
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
    window.location.href = `chat.php?chat_id=${chatId}`;
}
