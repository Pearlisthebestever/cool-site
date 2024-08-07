// Function to get a cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const cookieValue = parts.pop().split(';').shift();
        return cookieValue;
    }
    return null;
}

// Function to extract user_id from the username cookie
function getUserIdFromCookie() {
    const usernameCookie = getCookie('username');
    if (usernameCookie) {
        const match = usernameCookie.match(/user_id=(\d+)/);
        if (match) {
            return match[1]; // Extracted user_id
        }
    }
    return null;
}

// Function to delete a cookie by setting its expiry date in the past
function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
}

// Function to handle sign out
function signOut() {
    deleteCookie('username'); // Remove the cookie with username and user_id
    // Redirect to the home page or another page
    window.location.href = 'index.html';
}

// Function to update the authentication link based on cookie presence
function updateAuthButton() {
    const userId = getUserIdFromCookie();
    const authButton = document.getElementById('auth-button');
    const authButtonDropdown = document.getElementById('auth-button-dropdown'); // Updated for dropdown

    if (authButton) {
        if (userId) {
            // User is logged in; change link to Sign Out
            authButton.querySelector('a').href = '#';
            authButton.querySelector('a').textContent = 'Sign Out';
            authButton.querySelector('a').addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default link behavior
                signOut(); // Call the sign-out function
            });
        } else {
            // User is not logged in; ensure link shows Sign In
            authButton.querySelector('a').href = 'signin.html';
            authButton.querySelector('a').textContent = 'Sign In';
        }
    }

    if (authButtonDropdown) {
        if (userId) {
            // User is logged in; change link to Sign Out
            authButtonDropdown.href = '#';
            authButtonDropdown.textContent = 'SIGN OUT';
            authButtonDropdown.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default link behavior
                signOut(); // Call the sign-out function
            });
        } else {
            // User is not logged in; ensure link shows Sign In
            authButtonDropdown.href = 'signin.html';
            authButtonDropdown.textContent = 'SIGN IN';
        }
    }
}

// Run the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', updateAuthButton);
