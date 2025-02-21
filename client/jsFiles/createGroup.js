document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchMember");
    const usersList = document.querySelector(".show-users");
    const addedMembersList = document.querySelector(".added-members");
    const createGroupBtn = document.querySelector(".createGroupbtn");
    let selectedUsers = [];

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
            selectedUsers = selectedUsers.filter(id => id !== userId);
            userDiv.remove();
        }
    });

    // Submit group creation
    createGroupBtn.addEventListener("click", function () {
        const groupName = document.getElementById("groupName").value.trim();
        if (groupName === "" || selectedUsers.length === 0) {
            alert("Please enter a group name and select at least one user.");
            return;
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
