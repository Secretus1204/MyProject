//function to load inbox
let isFirstLoad = true;

function loadInbox() {
    const inboxContainer = document.querySelector('.inbox');

    if (!inboxContainer) {
        console.error('Inbox container not found!');
        return;
    }

    // show loading status first
    if (isFirstLoad && inboxContainer.innerHTML.trim() === '') {
        inboxContainer.innerHTML = '<p>Loading...</p>';
    }

    fetch('../SQL/dbquery/inbox.php')
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data)) {
                console.error('Expected an array but got:', data);
                if (isFirstLoad) inboxContainer.innerHTML = '<p>Error loading inbox.</p>';
                return;
            }

            inboxContainer.innerHTML = ''; // reset content

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
                        <img src="images/profile_img/default_profile.jpg" alt="">
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

            isFirstLoad = false; // Mark that the first load is done
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            if (isFirstLoad) inboxContainer.innerHTML = '<p>Error fetching inbox data.</p>';
        });
}

function openChat(friendId) {
    console.log('Open chat with friend ID:', friendId);
}

document.addEventListener('DOMContentLoaded', function () {
    loadInbox();
    setInterval(loadInbox, 5000);
}); 
