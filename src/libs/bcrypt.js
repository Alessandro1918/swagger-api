const bcrypt = require("bcrypt")

//Compare the value of a plaintext string (ex: password) with an already hashed text (ex: hashed password stored in a db)
async function isHashEquivalent(plainText, hashedText) {
  const isMatching = await bcrypt.compare(plainText, hashedText)
  return isMatching
}

//Hash a plaintext string (ex: a password), return a hashed string value
async function hashText(plainText) {
  const BCRYPT_SALT_ROUNDS = 10
  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS)
  const hash = await bcrypt.hash(plainText, salt)
  return hash
}

module.exports = { isHashEquivalent, hashText }