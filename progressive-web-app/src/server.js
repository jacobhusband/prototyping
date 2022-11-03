const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const app = express();
const webPush = require("web-push");

app.use(express.static("dist"));
app.use(express.json());

webPush.setGCMAPIKey("AIzaSyBisC7-06Sen8svxcWhpjQAtrfv2bhKr-A");
webPush.setVapidDetails("mailto:jakehusband2@gmail.com", process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);

app.get("/vapidPublicKey", (req, res) => {
  res.send(process.env.VAPID_PUBLIC_KEY);
});

app.post("/register", (req, res) => {
  res.sendStatus(201);
});

app.post("/sendNotification", (req, res) => {
  const subscription = req.body.subscription;
  const payload = req.body.payload;
  const options = {
    gcmAPIKey: req.body.api,
    TTL: req.body.ttl,
  };
  setTimeout(() => {
    webPush
      .sendNotification(subscription, payload, options)
      .then(() => {
        res.sendStatus(201);
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  }, req.body.delay * 1000);
});

app.listen(3000, () => {
  console.log("Server is live on PORT 3000.");
});
