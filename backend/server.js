const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const { FieldValue } = admin.firestore;

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

const serviceAccount = require("./privatekey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.get("/", (req, res) => {
  res.status(200).json({ message: "HELLOf WORLD" });
});

app.get("/:userEmail", async (req, res) => {
  try {
    // Get user email from the route parameters
    let userEmail = req.params.userEmail;

    // Define the users collection and the document reference
    const docRef = db.collection("todos").doc(userEmail);

    // Try to retrieve the document
    const doc = await docRef.get();

    // Check if the document exists
    if (!doc.exists) {
      console.log(userEmail);
      console.log("No such document! Creating one now.");
      const newUser = {
        todos: [],
        // You can add more fields here
      };
      // Document doesn't exist, create it
      await docRef.set(newUser);
      res.status(200).json({ message: "New user created!", data: [] });
    } else {
      // Document exists, use the data
      console.log(userEmail);
      console.log("Document data:", doc.data());
      res.status(200).json({ message: "User exists!", data: doc.data() });
    }
  } catch (err) {
    console.error("Error interacting with database: ", err);
    res.status(500).send("Error interacting with database: " + err);
  }
});
app.post("/addTodo", async (req, res) => {
  const { todo, email } = req.body;
  try {
    const docRef = db.collection("todos").doc(email);

    const doc = await docRef.get();

    // Check if the document exists
    // Document exists, use the data
    const dataToPush = { id: Math.random(), text: todo, done: false };

    await docRef.update({
      todos: FieldValue.arrayUnion(dataToPush),
    });

    const docRef2 = db.collection("todos").doc(email);

    const updatedDoc = await docRef2.get();
    const updatedData = updatedDoc.data();
    console.log(updatedData);
    res.status(200).json({ message: "User exists!", data: updatedData });
  } catch (err) {
    console.error("Error interacting with database: ", err);
    res.status(500).send("Error interacting with database: " + err);
  }
});

app.delete("/deleteTodo", async (req, res) => {
  const { id, email } = req.body;
  try {
    const docRef = db.collection("todos").doc(email);

    // Get the document
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Get the todos array from the document
    const todos = doc.data().todos;

    // Remove the task from the todos array
    const updatedTodos = todos.filter((todo) => todo.id !== id);

    // Update the todos array in the document
    await docRef.update({ todos: updatedTodos });

    // Send response
    return res.status(200).json({ message: "Todo removed successfully!" });
  } catch (err) {
    console.error("Error interacting with database: ", err);
    res.status(500).send("Error interacting with database" + err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
