const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const { FieldValue } = admin.firestore;

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

const serviceAccount = require("./privatekey.json");

// Initialize Firebase Admin with service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Root route
app.get("/", (req, res) => {
  res.status(200).json({ message: "HELLO WORLD" });
});

// Route to get user data or create new user if not exists
app.get("/:userEmail", async (req, res) => {
  try {
    let userEmail = req.params.userEmail;
    const docRef = db.collection("todos").doc(userEmail);
    const doc = await docRef.get();

    if (!doc.exists) {
      const newUser = {
        todos: [],
      };
      await docRef.set(newUser);
      res.status(200).json({ message: "New user created!", data: [] });
    } else {
      res.status(200).json({ message: "User exists!", data: doc.data() });
    }
  } catch (err) {
    console.error("Error interacting with database: ", err);
    res.status(500).send("Error interacting with database: " + err);
  }
});

// Route to add a new todo
app.post("/addTodo", async (req, res) => {
  const { todo, email } = req.body;
  try {
    const docRef = db.collection("todos").doc(email);
    const dataToPush = { id: Math.random(), text: todo, done: false };
    await docRef.update({
      todos: FieldValue.arrayUnion(dataToPush),
    });
    const updatedDoc = await docRef.get();
    const updatedData = updatedDoc.data();
    res.status(200).json({ message: "User exists!", data: updatedData });
  } catch (err) {
    console.error("Error interacting with database: ", err);
    res.status(500).send("Error interacting with database: " + err);
  }
});

// Route to delete a todo
app.delete("/deleteTodo", async (req, res) => {
  const { id, email } = req.body;
  try {
    const docRef = db.collection("todos").doc(email);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const todos = doc.data().todos;
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    await docRef.update({ todos: updatedTodos });
    return res.status(200).json({ message: "Todo removed successfully!" });
  } catch (err) {
    console.error("Error interacting with database: ", err);
    res.status(500).send("Error interacting with database" + err);
  }
});

// Route to edit a todo
app.post("/editTodo", async (req, res) => {
  const { id, text, email } = req.body;
  try {
    const docRef = db.collection("todos").doc(email);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(400).json({ message: "User does not exist" });
    }

    let todos = doc.data().todos;
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, text: text };
      }
      return todo;
    });

    await docRef.update({ todos: updatedTodos });
    return res.status(200).json({ message: "Todo updated successfully!" });
  } catch (err) {
    console.error("Error interacting with database: ", err);
    res.status(500).send("Error interacting with database" + err);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
