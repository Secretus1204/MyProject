document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchMember");
    const usersList = document.querySelector(".show-users");
    const addedMembersList = document.querySelector(".added-members");
    const createGroupBtn = document.querySelector(".createGroupbtn");
    const errorContainer = document.querySelector(".error_message");
    let selectedUsers = [];

    // Load users
    function loadUsers() {
        fetch("../SQL/dbquery/showUsersCreateGroup.php")
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    console.error("Error:", data.error);
                    usersList.innerHTML = "<p>Failed to load users.</p>";
                    return;
                }

                usersList.innerHTML = "";
                data.friends.forEach(user => {
                    const userDiv = document.createElement("div");
                    userDiv.classList.add("user");
                    userDiv.dataset.userId = user.id;

                    userDiv.innerHTML = `
                        <img class="profilePic" src="${user.profile_img}" alt="Profile">
                        <h2>${user.first_name} ${user.last_name}</h2>
                        <button class="selectBtn"><img src="images/icons/select_icon.png" alt="Select"></button>
                    `;

                    usersList.appendChild(userDiv);
                });
            })
            .catch(error => {
                console.error("Error fetching users:", error);
                usersList.innerHTML = "<p>Something went wrong. Please try again later.</p>";
            });
    }

    loadUsers();

    // Search for users
    searchInput.addEventListener("input", function () {
        const searchValue = searchInput.value.toLowerCase();
        document.querySelectorAll(".show-users .user").forEach(user => {
            const userName = user.querySelector("h2").textContent.toLowerCase();
            user.style.display = userName.includes(searchValue) ? "flex" : "none";
        });
    });

    // Add user to group
    usersList.addEventListener("click", function (event) {
        if (event.target.closest(".selectBtn")) {
            const userDiv = event.target.closest(".user");
            const userId = userDiv.dataset.userId; 
            const userName = userDiv.querySelector("h2").textContent;
            const userImage = userDiv.querySelector(".profilePic").src;

            if (!selectedUsers.includes(userId)) {
                selectedUsers.push(userId);

                // Remove from .show-users
                userDiv.remove();

                // Add to .added-members
                const addedUserDiv = document.createElement("div");
                addedUserDiv.classList.add("added-user");
                addedUserDiv.dataset.userId = userId;
                addedUserDiv.innerHTML = `
                    <img class="profilePic" src="${userImage}" alt="profile">
                    <h2>${userName}</h2>
                    <button class="removeBtn"><img src="images/icons/remove_icon.png" alt="remove"></button>
                `;
                addedMembersList.appendChild(addedUserDiv);
            }
        }
    });

    // Remove user from group
    addedMembersList.addEventListener("click", function (event) {
        if (event.target.closest(".removeBtn")) {
            const userDiv = event.target.closest(".added-user");
            const userId = userDiv.dataset.userId;
            const userName = userDiv.querySelector("h2").textContent;
            const userImage = userDiv.querySelector(".profilePic").src;

            // Remove from selected users
            selectedUsers = selectedUsers.filter(id => id !== userId);

            // Move back to .show-users
            const originalUserDiv = document.createElement("div");
            originalUserDiv.classList.add("user");
            originalUserDiv.dataset.userId = userId;
            originalUserDiv.innerHTML = `
                <img class="profilePic" src="${userImage}" alt="profile">
                <h2>${userName}</h2>
                <button class="selectBtn"><img src="images/icons/select_icon.png" alt="Select"></button>
            `;
            usersList.appendChild(originalUserDiv);

            userDiv.remove();
        }
    });

    // Submit group creation
    createGroupBtn.addEventListener("click", function () {
        const groupName = document.getElementById("groupName").value.trim();
        
        // Clear previous error messages
        errorContainer.innerHTML = "";

        //error message if no group name or members are less than 3
        if (groupName === "" || selectedUsers.length < 2) { 
            errorContainer.innerHTML = `<p class="error">Please enter a group name or add at least 3 members!</p>`;
            return; // Stop execution if validation fails
        }
        
        fetch("../SQL/dbquery/createGroup.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ groupName, members: selectedUsers })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Group created successfully!");
                window.location.reload();
            } else {
                alert("Error creating group: " + data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    });
});
