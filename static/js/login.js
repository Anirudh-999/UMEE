document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginBox = document.getElementById('loginBox');
    const profileBox = document.getElementById('profileBox');

    // Check if user is already logged in
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
        showProfile(currentUser);
    }

    function showProfile(username) {
        loginBox.classList.add('hidden');
        profileBox.classList.remove('hidden');
        document.getElementById('profileUsername').textContent = username;
    }

    // Handle login form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();

        if (!username) {
            alert('Please enter a username');
            return;
        }

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username })
            });

            if (response.ok) {
                sessionStorage.setItem('currentUser', username);
                showProfile(username);
            } else {
                alert('Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Login failed. Please try again.');
        }
    });
});

// Handle logout
function handleLogout() {
    sessionStorage.removeItem('currentUser');
    fetch('/logout')
        .then(() => {
            window.location.reload();
        })
        .catch(error => {
            console.error('Logout error:', error);
        });
} 