//function to load inbox
function loadInbox() {
    const inboxContainer = document.querySelector('.inbox');

    if (!inboxContainer) {
        console.error('Inbox container not found!');
        return;
    }

    inboxContainer.innerHTML = '<p>Loading...</p>';

    fetch('../SQL/dbquery/inbox.php')
        .then(response => response.json())
        .then(data => {
            inboxContainer.innerHTML = '';

            if (Array.isArray(data)) {
                data.forEach(chat => {
                    const chatButton = document.createElement('button');
                    chatButton.classList.add('last-message');
                    chatButton.setAttribute('data-chat-id', chat.chat_id);
                    chatButton.setAttribute('data-friend-id', chat.user_id);
                    chatButton.onclick = function () {
                        openChat(chat.user_id);
                    };

                    const lastMessage = chat.message_text ? chat.message_text : 'No messages yet';
                    const timestamp = chat.created_at ? new Date(chat.created_at).toLocaleString() : '';

                    chatButton.innerHTML = `
                            <div class="img-container">
                                <img src="images/profile_img/profile_1.jpg" alt="">
                            </div>
                            <div class="names-msg">
                                <h3>${chat.firstName} ${chat.lastName}</h3>
                                <h4>${lastMessage}</h4>
                            </div>
                            <div class="timeSent">
                                <h4>${timestamp}</h4>
                            </div>
                    `;

                    inboxContainer.appendChild(chatButton);
                });
            } else {
                inboxContainer.innerHTML = '<p>Error loading inbox.</p>';
                console.error('Expected an array but got:', data);
            }
        })
        .catch(error => {
            inboxContainer.innerHTML = '<p>Error fetching inbox data.</p>';
            console.error('Error fetching data:', error);
        });
}

function openChat(friendId) {
    console.log('Open chat with friend ID:', friendId);
}

document.addEventListener('DOMContentLoaded', function () {
    loadInbox();
    setInterval(loadInbox, 5000);
}); 
