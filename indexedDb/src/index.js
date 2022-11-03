import { set, get, update } from "idb-keyval";

const latlng = [];
let count = 0;
let id;

const registerServiceWorker = async () => {
  if ("serviceWorker" in window.navigator) {
    try {
      const registration = await window.navigator.serviceWorker.register("sw.js");
      if (registration.installing) {
        console.log("Service worker installing!");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

registerServiceWorker();

set("latlng", latlng)
  .then(() => {
    console.log("Wiped array");
    id = setInterval(findPosition, 3000);
  })
  .catch((err) => console.error(err));

function findPosition() {
  count++;
  if (count === 15) {
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
      console.log(newArr);
      return newArr;
    });
  });
}

window.addEventListener("offline", (event) => {
  console.log("Just went offline");
});

console.log("Online?", window.navigator.onLine);
