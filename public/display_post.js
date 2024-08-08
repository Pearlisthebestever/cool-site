function createDailyPost() {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    return {
        id: dateString, // Use the date as a unique ID
        title: `Daily Post - ${dateString}`,
        description: `This is the daily post for ${dateString}.`,
        isDaily: true // Mark as daily post
    };
}

function getESTDate() {
    // Create a Date object with current UTC time
    const utcDate = new Date();
    
    // Convert UTC to EST (UTC-5 hours)
    const estOffset = -5; // EST is UTC-5
    const estDate = new Date(utcDate.getTime() + (estOffset * 60 * 60 * 1000));

    // Return date string in YYYY-MM-DD format
    return estDate.toISOString().split('T')[0];
}

function postDailyPost() {
    fetch('/data/posts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(posts => {
            console.log('Existing posts:', posts);

            const today = getESTDate(); // Get EST date in YYYY-MM-DD format
            const currentHour = new Date().getUTCHours() - 5; // Get current hour in EST

            // Check if the daily post for today already exists
            const postExists = posts.some(post => post.id === today);

            // Create a new daily post if it doesn't exist and it's close to midnight EST
            if (!postExists && (currentHour === 0 || currentHour === 23)) {
                console.log('Creating new daily post.');

                const dailyPost = createDailyPost();

                return fetch('/update-posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dailyPost),
                });
            } else {
                console.log('Daily post for today already exists or not time to create.');
                return Promise.resolve();
            }
        })
        .then(response => {
            if (response && response.ok) {
                console.log('Daily post created successfully.');
                return response.text();
            } else {
                console.error('Failed to create daily post:', response.statusText);
            }
        })
        .then(() => {
            loadPosts();
        })
        .catch(error => console.error('Error posting daily post:', error));
}

function loadPosts() {
    fetch('/data/posts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(posts => {
            console.log('Fetched posts:', posts);
            displayPosts(posts);
        })
        .catch(error => console.error('Error fetching posts:', error));
}

function displayPosts(posts) {
    // Sort posts so that daily posts come first and in descending order of date
    posts.sort((a, b) => {
        if (a.isDaily && !b.isDaily) return -1; // Daily posts come first
        if (!a.isDaily && b.isDaily) return 1;
        return new Date(b.id) - new Date(a.id); // Sort by date in descending order
    });

    const postContainer = document.getElementById('blog-container');
    postContainer.innerHTML = ''; // Clear existing content

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('blog-item'); // Apply CSS class for styling

        // Optionally handle post images
        if (post.image) {
            const postImage = document.createElement('img');
            postImage.src = post.image;
            postImage.alt = post.title;
            postElement.appendChild(postImage);
        }

        const postDetails = document.createElement('div');
        postDetails.classList.add('blog-details'); // Apply CSS class for details

        const postDescription = document.createElement('p');
        postDescription.textContent = post.description; // Add description

        const postTitle = document.createElement('h3');
        const postLink = document.createElement('a');
        postLink.href = `post.html?id=${post.id}`;
        postLink.textContent = post.title; // Title is part of the link

        postTitle.appendChild(postLink);
        postDetails.appendChild(postDescription); // Append description
        postDetails.appendChild(postTitle);

        if (post.message) {
            const postMessage = document.createElement('p');
            postMessage.textContent = post.message; // Add message if present
            postDetails.appendChild(postMessage);
        }

        postElement.appendChild(postDetails);
        postContainer.appendChild(postElement);
    });
}

// Call postDailyPost to check for new daily posts and load them
document.addEventListener('DOMContentLoaded', () => {
    postDailyPost(); // Check and post daily post if necessary
    loadPosts(); // Load posts when the page loads
});
