import { set, get, update } from "idb-keyval";

const latlng = [];

set("latlng", latlng)
  .then(() => {
    console.log("Wiped array");
    setInterval(findPosition, 3000);
  })
  .catch((err) => console.error(err));

function findPosition() {
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
