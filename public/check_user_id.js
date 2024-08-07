// Function to get a cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null;
}

// Function to check user ID and modify CSS
function checkUserId() {
    const cookieValue = getCookie('username'); // Assuming the cookie name is 'username'
    if (cookieValue) {
        const userId = cookieValue.split('=')[1]; // Extract the part after '='
        if (userId === '0') {
            const style = document.createElement('style');
            style.innerHTML = `
                .project_x {
                    display: block !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Execute the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', checkUserId);
