document.getElementById('saveProfileChanges').addEventListener('click', function () {
    const formData = new FormData();
    const fileInput = document.getElementById('file');
    const currentPassword = document.getElementById('currentPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();

    if (fileInput.files.length > 0) {
        formData.append('profile_picture', fileInput.files[0]);
    }

    const firstName = document.getElementById('firstName').value.trim();
    if (firstName !== '') {
        formData.append('firstName', firstName);
    }

    const lastName = document.getElementById('lastName').value.trim();
    if (lastName !== '') {
        formData.append('lastName', lastName);
    }

    const email = document.getElementById('email').value.trim();
    if (email !== '') {
        formData.append('email', email);
    }

    const address = document.getElementById('address').value.trim();
    if (address !== '') {
        formData.append('address', address);
    }

    if (currentPassword !== '') {
        formData.append('currentPassword', currentPassword);

        if (newPassword === '') {
            alert('Please enter a new password if you are changing your password.');
            return;
        }
        formData.append('newPassword', newPassword);
    }

    fetch('../SQL/dbquery/editProfile.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text()) // Get raw text instead of JSON
    .then(text => {
        console.log("Raw Response:", text); // Log the response to check for errors
        return JSON.parse(text); // Parse JSON after logging
    })
    .then(data => {
        if (data.success) {
            alert('Profile updated successfully!');
            location.reload();
        } else {
            alert('Error: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error updating profile:', error);
        alert('An error occurred while updating the profile.');
    });
    
});
