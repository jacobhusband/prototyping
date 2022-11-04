import { set, get, update } from "idb-keyval";
import convertVapidKey from "convert-vapid-public-key";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBisC7-06Sen8svxcWhpjQAtrfv2bhKr-A",
  authDomain: "runnerfuze.firebaseapp.com",
  projectId: "runnerfuze",
  storageBucket: "runnerfuze.appspot.com",
  messagingSenderId: "841749191888",
  appId: "1:841749191888:web:968199523a442dec4bd2d5",
  measurementId: "G-4W57ECK44Z",
};

const button = document.querySelector("#notifications");
const app = initializeApp(firebaseConfig);

const latlng = [];
let count = 0;
let id;

const registerServiceWorker = async () => {
  if ("serviceWorker" in window.navigator) {
    try {
      window.navigator.serviceWorker
        .register("sw.js")
        .then((registration) => {
          return registration.pushManager.getSubscription().then(async (subscription) => {
            if (subscription) {
              return subscription;
            } else {
              const response = await fetch("/vapidPublicKey");
              const vapidPublicKey = await response.text();
              const convertedVapidKey = convertVapidKey(vapidPublicKey);
              return registration.pushManager
                .subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: convertedVapidKey,
                })
                .then((subscription) => subscription)
                .catch((err) => {
                  console.log(`An error has occurred: ${err}`);
                });
            }
          });
        })
        .then((subscription) => {
          fetch("/register", {
            method: "post",
            headers: {
              "Content-type": "application/json()",
            },
            body: JSON.stringify({ subscription }),
          });
          button.addEventListener("click", () => {
            Notification.requestPermission().then((result) => {
              result === "granted" && trackingNotification(subscription);
            });
          });
        });
    } catch (err) {
      console.log(`Registration failed with ${err}`);
    }
  }
};

registerServiceWorker();

set("latlng", latlng)
  .then(() => {
    id = setInterval(findPosition, 3000);
  })
  .catch((err) => {
    console.log(`Registration failed with ${err}`);
  });

function findPosition() {
  count++;
  if (count === 5) {
    clearInterval(id);
  }
  window.navigator.geolocation.getCurrentPosition((position) => {
    const time = new Date().getTime() / 1000;
    const newPos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      time,
    };
    update("latlng", (arr) => {
      const newArr = [...arr];
      newArr.push(newPos);
      return newArr;
    });
  });
}

window.addEventListener("offline", (event) => {
  console.log("Just went offline");
});

function trackingNotification(subscription) {
  fetch("/sendNotification", {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      subscription,
      api: firebaseConfig.apiKey,
      payload: "Hey, what's goodie",
      ttl: 10,
      delay: 1,
    }),
  });
}
