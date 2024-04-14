const crypto = require('crypto');

// Function to generate a secure random string
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex') // Convert to hexadecimal format
    .slice(0, length); // Trim to desired length
};

// Usage example: Generate a 64-character random string
const sessionSecretKey = generateRandomString(64);
console.log("Session Secret Key:", sessionSecretKey);
