const { onRequest } = require('firebase-functions/v2/https')
const admin = require('firebase-admin')
const { getAuth } = require('firebase-admin/auth')

admin.initializeApp()

exports.validateUser = onRequest(
  {
    cors: [/appkokoro\.com/],
  },
  async (req, resp) => {
    const { google_uid } = req.body

    try {
      const userExists = await getUser(google_uid)
      resp.status(200).send({
        userExists,
      })
    } catch (error) {
      resp.status(500).send({ error })
    }
  }
)

async function getUser(google_uid) {
  try {
    const user = await getAuth().getUserByProviderUid('google.com', google_uid)

    return user !== null
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      return false
    } else {
      throw error
    }
  }
}
