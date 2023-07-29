const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
app.use(cors());

const port = 3000;

const serviceAccount = require("./privatekey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
app.get("/", async (req, res) => {
  try {
    // Do db CRUD operations...
    // Example: Create a new document
    const todosRef = db.collection("todos").doc("qoeMYF44A7uSE5umndhn");
    const doc = await todosRef.get();
    if (!doc.exists) {
      console.log("No such document!");
      res.status(404).send("No such document!");
    } else {
      console.log("Document data:", doc.data());
      res.status(200).json({ message: "Hello World!", data: doc.data() });
    }
  } catch (err) {
    console.error("Error interacting with database: ", err);
    res.status(500).send("Error interacting with database: " + err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
