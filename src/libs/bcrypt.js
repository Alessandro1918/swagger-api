const bcrypt = require("bcrypt")

//Compare the value of a plaintext string (ex: password) with an already hashed text (ex: hashed password stored in a db)
async function isHashEquivalent(plainText, hashedText) {
  const isMatching = await bcrypt.compare(plainText, hashedText)
  return isMatching
}

module.exports = { isHashEquivalent }