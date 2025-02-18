function fetchFriendsData() {
    fetch('../SQL/client_include/discoverPeople.inc.php')
        .then(response => response.json())
        .then(data => {
            // Update Current Friends List
            const friendsList = document.getElementById('current-friends-list');
            friendsList.innerHTML = '';
            data.friends.forEach(friend => {
                friendsList.innerHTML += `
                    <button class="current-friend" onclick="window.location.href='viewFriendProfilePage.php?user_id=${friend.user_id}'">
                        <div class="profile-current-friend">
                            <img src="images/profile_img/profile_1.jpg" alt="profile">
                        </div>
                        <div class="name-current-friend">
                            <h3>${friend.firstName} ${friend.lastName}</h3>
                        </div>
                        <div class="online-or-not">
                            <span class="online-status ${friend.is_online == 1 ? 'online' : 'offline'}">
                                ${friend.is_online == 1 ? 'Online' : 'Offline'}
                            </span>
                        </div>
                    </button>
                `;
            });

            // Update Suggested Friends List
            const suggestedFriendsList = document.getElementById('suggested-friends-list');
            suggestedFriendsList.innerHTML = '';
            data.nonFriends.forEach(nonfriend => {
                suggestedFriendsList.innerHTML += `
                    <div class="profile-container" data-name="${nonfriend.firstName} ${nonfriend.lastName}" onclick="window.location.href='viewFriendProfilePage.php?user_id=${nonfriend.user_id}'">
                        <div class="profile-img">
                            <img src="images/profile_img/profile_1.jpg" alt="profile">
                        </div>
                        <div class="name">
                            <h2>${nonfriend.firstName} ${nonfriend.lastName}</h2>
                        </div>
                        ${nonfriend.is_pending == 0 ? `
                            <form class="addFriendForm" data-user-id="${nonfriend.user_id}" onclick="event.stopPropagation();">
                                <button type="button" class="add-icon">
                                    <img src="images/icons/addUser_icon.png" alt="add">
                                </button>
                            </form>
                        ` : `
                            <button class="add-icon pending-btn" disabled onclick="event.stopPropagation();">
                                <span>Pending</span>
                            </button>
                        `}
                    </div>
                `;
            });

            // Update Friend Requests List
            const friendRequestList = document.getElementById('friend-request-list');
            friendRequestList.innerHTML = '';
            if (data.friendRequests.length === 0) {
                friendRequestList.innerHTML = '<p>No friend requests.</p>';
            } else {
                data.friendRequests.forEach(request => {
                    friendRequestList.innerHTML += `
                        <div class="fr-profile-container">
                            <div class="fr-profile-img">
                                <img src="images/profile_img/profile_1.jpg" alt="profile">
                            </div>
                            <div class="fr-name">
                                <h2>${request.firstName} ${request.lastName}</h2>
                            </div>
                            <form class="handleRequestForm" data-user-id="${request.user_id}">
                                <button type="button" class="acceptBtn buttons">Accept</button>
                                <button type="button" class="rejectBtn buttons">Reject</button>
                            </form>
                        </div>
                    `;
                });
            }

            attachEventListeners();
            filterSuggestedFriends(); // <- Always filter after updating DOM
        })
        .catch(error => console.error('Error fetching data:', error));
}

function filterSuggestedFriends() {
    const searchValue = document.getElementById('search').value.toLowerCase();
    const profiles = document.querySelectorAll('#suggested-friends-list .profile-container');

    profiles.forEach(profile => {
        const nameText = profile.querySelector('.name h2').textContent.toLowerCase();

        if (nameText.includes(searchValue)) {
            profile.style.display = 'flex';
        } else {
            profile.style.display = 'none';
        }
    });
}

function attachEventListeners() {
    document.querySelectorAll('.addFriendForm').forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const friendId = this.dataset.userId;
            addFriend(friendId);
        });

        form.querySelector('button').addEventListener('click', function () {
            const friendId = form.closest('.addFriendForm').dataset.userId;
            addFriend(friendId);
        });
    });

    document.querySelectorAll('.handleRequestForm').forEach(form => {
        const friendId = form.dataset.userId;
        form.querySelector('.acceptBtn').addEventListener('click', () => handleFriendRequest(friendId, 'accept'));
        form.querySelector('.rejectBtn').addEventListener('click', () => handleFriendRequest(friendId, 'reject'));
    });
}

function addFriend(friendId) {
    fetch('../SQL/dbquery/addFriend.php', {
        method: 'POST',
        body: new URLSearchParams({ add_friend_id: friendId }),
    })
        .then(() => fetchFriendsData())
        .catch(error => console.error('Error adding friend:', error));
}

function handleFriendRequest(friendId, action) {
    fetch('../SQL/dbquery/handleFriendRequest.php', {
        method: 'POST',
        body: new URLSearchParams({ friend_id: friendId, [action]: true }),
    })
        .then(() => fetchFriendsData())
        .catch(error => console.error(`Error ${action}ing friend request:`, error));
}

document.addEventListener('DOMContentLoaded', () => {
    fetchFriendsData();
    document.getElementById('search').addEventListener('keyup', filterSuggestedFriends);

    //interval for refresh AJAX
    setInterval(fetchFriendsData, 1000);
});
