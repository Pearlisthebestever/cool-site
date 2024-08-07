// Function to get a cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null;
}

// Function to replace the name in the div with class 'icon'
function replaceIconName() {
    const iconDiv = document.querySelector('.icon');
    if (iconDiv) {
        const cookieValue = getCookie('username'); // Assuming the cookie name is 'username'
        if (cookieValue) {
            const username = cookieValue.split('&')[0]; // Extract the part before '&'
            iconDiv.textContent = username;
        }
    }
}

// Execute the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', replaceIconName);
