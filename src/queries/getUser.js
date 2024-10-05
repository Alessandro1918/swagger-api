async function getUser(username) {
  const DATABASE_URL = process.env.DATABASE_URL
  const tableName = "users"
  const fieldName = "username"
  const response = await fetch(`${DATABASE_URL}?sheet=${tableName}&field_name=${fieldName}&field_value=${username}`)
  const data = await response.json()
  return data
}

module.exports = { getUser }