importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyBS5syiZXCHaSlqA8goDDozgh-upgFGdis",
  authDomain: "amiplace-3c576.firebaseapp.com",
  projectId: "amiplace-3c576",
  storageBucket: "amiplace-3c576.appspot.com",
  messagingSenderId: "835524893178",
  appId: "1:835524893178:web:96d2de7b8c7c3bbcde2c43",
  measurementId: "G-MEVFD068W3",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
