document.addEventListener("DOMContentLoaded", function () {
    const usersList = document.querySelector(".show-users");

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

                    // Profile Image
                    const profileImg = document.createElement("img");
                    profileImg.classList.add("profilePic");
                    profileImg.src = user.profile_img;
                    profileImg.alt = "Profile";

                    // User Name
                    const userName = document.createElement("h2");
                    userName.textContent = `${user.first_name} ${user.last_name}`;

                    // Select Button
                    const selectBtn = document.createElement("button");
                    selectBtn.classList.add("selectBtn");
                    const selectImg = document.createElement("img");
                    selectImg.src = "images/icons/select_icon.png";
                    selectImg.alt = "Select";
                    selectBtn.appendChild(selectImg);

                    // Append Elements
                    userDiv.appendChild(profileImg);
                    userDiv.appendChild(userName);
                    userDiv.appendChild(selectBtn);
                    usersList.appendChild(userDiv);
                });
            })
            .catch(error => {
                console.error("Error fetching users:", error);
                usersList.innerHTML = "<p>Something went wrong. Please try again later.</p>";
            });
    }

    loadUsers();
});
