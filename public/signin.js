// Function to convert Base64 to CryptoJS WordArray
function base64ToWordArray(base64) {
    try {
        return CryptoJS.enc.Base64.parse(base64);
    } catch (e) {
        console.error('Base64 decoding error:', e);
        return null;
    }
}

// Function to decrypt the ciphertext using the provided key
function decrypt(ciphertextBase64, keyBase64) {
    try {
        const key = CryptoJS.enc.Base64.parse(keyBase64);  // Parse Base64-encoded key
        const combined = CryptoJS.enc.Base64.parse(ciphertextBase64);  // Parse Base64-encoded data

        // Extract IV (16 bytes) and encrypted data
        const iv = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4), 16);
        const encryptedData = CryptoJS.lib.WordArray.create(combined.words.slice(4), combined.sigBytes - 16);

        console.log("IV (Hex):", CryptoJS.enc.Hex.stringify(iv));
        console.log("Encrypted Data (Hex):", CryptoJS.enc.Hex.stringify(encryptedData));

        const decrypted = CryptoJS.AES.decrypt({ ciphertext: encryptedData }, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
        if (!plaintext) {
            throw new Error('Decryption result is empty or invalid');
        }

        return plaintext;
    } catch (e) {
        console.error('Decryption error:', e);
        return null;
    }
}

// Function to set a cookie with both username and user ID
function setCookie(username, userId, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    // Set SameSite attribute to 'Lax' or 'None' (if 'None', include 'Secure')
    const sameSite = "SameSite=Lax"; // Change to 'None' for cross-site requests and add 'Secure'
    const secure = "Secure"; // Required if SameSite is 'None'

    // Format the cookie value with both username and user ID
    const cookieValue = `user_id=${userId}`;
    document.cookie = `username=${encodeURIComponent(username)}&${cookieValue};${expires};path=/;${sameSite};${secure}`;
}

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    const signinForm = document.getElementById('signin-form');
    const errorMessage = document.getElementById('error-message');

    signinForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const idOrUsername = document.getElementById('user-id').value;
        const password = document.getElementById('password').value;

        fetch('data/users.json')
            .then(response => response.json())
            .then(data => {
                fetch('secret.key')
                    .then(response => response.text())
                    .then(keyBase64 => {
                        try {
                            let userFound = false;

                            if (!Array.isArray(data.users)) {
                                throw new Error('Invalid users data format.');
                            }

                            for (const user of data.users) {
                                console.log(`Testing user ${user.user_id}`);
                                const decryptedData = decrypt(user.encrypted, keyBase64.trim());

                                if (decryptedData) {
                                    // Use split to separate username and password
                                    const [storedUsername, storedPassword] = decryptedData.split('\n');
                                    console.log(`Stored Username: ${storedUsername}, Stored Password: ${storedPassword}`);

                                    if ((user.user_id === idOrUsername || storedUsername === idOrUsername) && storedPassword === password) {
                                        setCookie(storedUsername, user.user_id, 1);
                                        window.location.href = 'index.html';
                                        userFound = true;
                                        break;
                                    }
                                } else {
                                    console.error(`Failed to decrypt data for user ${user.user_id}`);
                                }
                            }

                            if (!userFound) {
                                errorMessage.style.display = 'block';
                            }
                        } catch (error) {
                            console.error('Error processing decrypted data:', error);
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching key:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    });
});
