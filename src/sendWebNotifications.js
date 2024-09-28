const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: "amiplace-3c576",
});

async function fetchUserFcmTokens() {
  const tokensArray = [];
  const usersCollection = collection(db, "users");

  try {
    const querySnapshot = await getDocs(usersCollection);
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.fcmToken) {
        tokensArray.push({
          fcmToken: userData.fcmToken,
        });
      }
    });
    return tokensArray;
  } catch (error) {
    console.error("Error fetching FCM tokens:", error);
    throw error;
  }
}
let registrationTokens = [
  "eGFuMP8Cb65YITgQ-pQbOX:APA91bFOtHyp_EpLHcJBjQtRgV6QIhbHZ9B5MVvh3HZJPgmjx4BpsqAcp_uOljh5TEuf6npuXMrdm-dnmN0IZ9JEyXOe_zf_mOc9G1g_VywH1jlCdqC75f7Wkz0rMb0Kfd2WDl60T4Oe",
];

fetchUserFcmTokens()
  .then((tokens) => (registrationTokens = tokens))
  .catch((error) => {
    console.error("Failed to fetch FCM tokens:", error);
  });

const message = {
  notification: {
    title: "New Message",
    body: "You have a new message!",
  },
  tokens: registrationTokens,
};

admin
  .messaging()
  .sendMulticast(message)
  .then((response) => {
    console.log(response.successCount + " messages were sent successfully");
  });
