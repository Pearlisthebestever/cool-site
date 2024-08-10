document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    console.log(`Post ID from URL: ${postId}`);

    if (postId) {
        console.log('Fetching posts...');
        fetch('data/posts.json')
            .then(response => response.json())
            .then(posts => {
                console.log('Fetched posts:', posts);
                const post = posts.find(post => post.id === postId);
                if (post) {
                    console.log('Selected post:', post);
                    if (post.isDaily) {
                        console.log('This is a daily post');
                        const postDate = post.id;
                        console.log(`Post Date: ${postDate}`);

                        fetch('data/posts-messages.json')
                            .then(response => response.json())
                            .then(messages => {
                                console.log('Fetched messages:', messages);
                                const messagesForPostDate = messages[postDate] || [];
                                console.log(`Messages for ${postDate}:`, messagesForPostDate);

                                displayPost(post, messagesForPostDate);
                                document.getElementById('create-post-container').style.display = 'block';
                                document.getElementById('post-date').value = postDate;
                            })
                            .catch(error => console.error('Error fetching post messages:', error));
                    } else {
                        displayPost(post);
                        document.getElementById('create-post-container').style.display = 'none';
                    }
                } else {
                    displayError('Post not found');
                }
            })
            .catch(error => console.error('Error fetching posts:', error));
    } else {
        displayError('Post not found');
    }
});

function getCookie(name) {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return null;
}

function getUserIdFromCookie() {
    const cookieValue = getCookie('username');
    if (cookieValue) {
        const userIdMatch = cookieValue.match(/user_id=(\d+)/);
        if (userIdMatch) {
            return userIdMatch[1]; // Returns the user_id as a string
        }
    }
    return null;
}

function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function displayPost(post, messages = []) {
    const postTitle = document.getElementById('post-title');
    const postContent = document.getElementById('post-content');

    if (!postTitle || !postContent) {
        console.error('Required elements for displaying post are not found');
        return;
    }

    // Clear previous content
    postContent.innerHTML = '';

    // Display the post title
    postTitle.textContent = post.title;

    // Display the post description if available
    if (post.description) {
        postContent.innerHTML += `<p class="hide14">${post.description}</p>`;
    }

    // Display messages
    if (messages.length > 0) {
        console.log('Displaying messages...');
        messages.forEach(message => {
            console.log('Message:', message);
            const messageSection = document.createElement('div');
            messageSection.classList.add('message-box');

            // Add user-id to the message box
            const userIdElement = document.createElement('p');
            userIdElement.classList.add('project_x'); // Added class 'project_x'
            userIdElement.textContent = `User ID: ${message['user-id']}`;
            messageSection.appendChild(userIdElement);

            const messageTitle = document.createElement('h4');
            messageTitle.textContent = message.title || 'No Title';

            const messageContent = document.createElement('p');
            messageContent.textContent = message.content || 'Content not available';

            messageSection.appendChild(messageTitle);
            messageSection.appendChild(messageContent);

            postContent.appendChild(messageSection);
        });
    } else if (post.isDaily) {
        postContent.innerHTML += '<p>No messages available for this date.</p>';
    }
}


function displayError(message) {
    const postTitle = document.getElementById('post-title');
    const postContent = document.getElementById('post-content');

    if (postTitle && postContent) {
        postTitle.textContent = message;
        postContent.textContent = '';
    } else {
        console.error('Required elements for displaying error are not found');
    }
}

document.getElementById('create-post-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const postDate = document.getElementById('post-date').value;
    const title = document.getElementById('message-title').value;
    const content = document.getElementById('message-content').value;

    if (!title || !content) {
        alert('Title and content are required.');
        return;
    }

    if (postDate !== getTodayDate()) {
        alert('You can only post messages for the current day.');
        return;
    }

    const userId = getUserIdFromCookie();
    if (!userId) {
        alert('You must be logged in to post messages.');
        return;
    }

    console.log('User ID from cookie:', userId);

    const newMessage = {
        title: title,
        content: content,
        postId: postDate,
        'user-id': userId
    };

    fetch('/update-messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ date: postDate, message: newMessage })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        alert('Message posted successfully!');
        document.getElementById('create-post-form').reset();

        const postContent = document.getElementById('post-content');
        const messageSection = document.createElement('div');
        messageSection.classList.add('message-box');

        const messageTitle = document.createElement('h4');
        messageTitle.textContent = newMessage.title;

        const messageContent = document.createElement('p');
        messageContent.textContent = newMessage.content;

        messageSection.appendChild(messageTitle);
        messageSection.appendChild(messageContent);

        postContent.appendChild(messageSection);
    })
    .catch(error => console.error('Error posting message:', error));
});
