from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64
import os

# Function to generate a new AES key
def generate_new_key():
    # Generate a new AES key (256 bits / 32 bytes)
    key = os.urandom(32)
    
    # Encode the key to Base64 for easier handling
    key_base64 = base64.b64encode(key).decode('utf-8')
    
    return key_base64

# Example usage
new_key_base64 = generate_new_key()
print(f'New AES Key (Base64): {new_key_base64}')
