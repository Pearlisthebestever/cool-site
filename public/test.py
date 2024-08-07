from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import base64

# Function to decrypt data using PyCryptodome
def decrypt_data(encrypted_base64, key_base64):
    try:
        # Decode Base64-encoded key and encrypted data
        key = base64.b64decode(key_base64)
        combined = base64.b64decode(encrypted_base64)

        # Extract IV (first 16 bytes) and encrypted data
        iv = combined[:16]
        encrypted_data = combined[16:]

        # Decrypt the data
        cipher = AES.new(key, AES.MODE_CBC, iv)
        decrypted_data = unpad(cipher.decrypt(encrypted_data), AES.block_size)

        return decrypted_data.decode('utf-8')
    except Exception as e:
        print('Decryption error:', e)
        return None

# Example usage
encrypted_base64 = '2BIXVDi1s9Nr0wnLCwdEezK1DIWtodK4WLofq0NVxNZihogE4SkqiMFP20jhOBDjIiTuOtgHHdKL91pVC1a9wg=='  # Your Base64 encoded encrypted data
key_base64 = 'ZdsmDXhfOYN57EeGYjnNwA=='  # Replace with your actual Base64 encoded key
decrypted_text = decrypt_data(encrypted_base64, key_base64)

print('Decrypted Text:', decrypted_text)
