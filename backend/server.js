const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require("bcrypt");


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:3000", 
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(session({
  secret: "09f586ebf30eef9d05703a6b173d44bc80d0e20f392877a5b1e091366cdc9c5d", // Change this to a secure random string
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure to true if using HTTPS
}));


// MongoDB URI
const uri = "mongodb+srv://vignesh:bintu1625@cluster0.h5ozcad.mongodb.net/UsersDetails?retryWrites=true&w=majority&appName=Cluster0";

// MongoDB Client
const client = new MongoClient(uri);

// Connect to MongoDB and start server
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

connectToMongoDB();

process.on('SIGINT', async () => {
  try {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});


// Routes
app.post("/api/signup", async (req, res) => {
  const { user_name, user_email, password } = req.body;
  const db = client.db("UsersDetails");
  const collection = db.collection("Details");
  const taskCollection = db.collection("userTasks");
  // Hash the password before storing it in the database
  const hashedPassword = await bcrypt.hash(password, 10);

  const document = { user_name, user_email, password: hashedPassword };
  try {
    await collection.insertOne(document);
    console.log("Document inserted successfully");
    user_id = document._id;
    await taskCollection.insertOne({_id: user_id, pendingTasks:[],completedTasks:[]})
    console.log("Task Collection created successfully")
    return res.status(201).json({ message: "Signup data received" });
  } catch (error) {
    console.error("Error inserting document:", error);
    return res.status(500).json({ message: "Failed to process signup request" });
  }
});

app.post("/api/login", async (req, res) => {
  const { user_email, password } = req.body;
  console.log("Received login data:", user_email, password);

  const db = client.db("UsersDetails");
  const collection = db.collection("Details");

  try {
    // Find the user by user_email
    const user = await collection.findOne({ user_email:user_email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    req.session.user_id = user._id
    if (passwordMatch) {
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Invalid password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Failed to process login request" });
  }
});

app.get('/api/tasks', async (req, res) => {
  const user_id = req.session.user_id;

  try {
    if (!user_id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const db = client.db('UsersDetails');
    const userTasksCollection = db.collection('userTasks');

    const userTasks = await userTasksCollection.findOne({ _id: new ObjectId(user_id) });
    if (!userTasks) {
      return res.status(404).json({ message: "User not found in User tasks" });
    } else if (userTasks.pendingTasks.length === 0 && userTasks.completedTasks.length === 0) {
      return res.status(200).json({ pendingTasks: [], completedTasks: [] });
    }

    const pendingtaskIds = userTasks.pendingTasks.map(taskId => new ObjectId(taskId));
    const completedtaskIds = userTasks.completedTasks.map(taskId => new ObjectId(taskId));

    const taskCollection = db.collection('Tasks');

    const pendingTasks = await taskCollection.find({ _id: { $in: pendingtaskIds } }).toArray();
    const completedTasks = await taskCollection.find({ _id: { $in: completedtaskIds } }).toArray();
    return res.status(200).json({ pendingTasks, completedTasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// POST /api/addTask - Add a new task
app.post('/api/addTask', async (req, res) => {
  const user_id = req.session.user_id;
  const { task_name, task_description, task_duedate,task_priority } = req.body;
  console.log("Received task data:", task_name, task_description, task_duedate,task_priority);
  try {
    if (!user_id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const db = client.db('UsersDetails');
    const taskCollection = db.collection('Tasks');
    const userTasksCollection = db.collection('userTasks');

    const document = {
      task_name,
      task_description,
      task_duedate,
      task_priority,
    };

    const taskResult = await taskCollection.insertOne(document);
    const taskId = taskResult.insertedId;
    try{
    await userTasksCollection.updateOne(
      { _id: new ObjectId(user_id) },
      { $push: { pendingTasks: new ObjectId(taskId) } }
    );
    }catch(error){
      console.error("Error adding task to user's task list:", error);
      await taskCollection.deleteOne({ _id: new ObjectId(taskId) });
    }

    return res.status(200).json({ message: "Task added successfully" });
  } catch (error) {
    console.error("Error adding task:", error);
    return res.status(500).json({ message: "Failed to add task" });
  }
});

app.post('/api/markTaskCompleted', async (req, res) => {
  const user_id = req.session.user_id;
  const { task_id } = req.body;

  try {
    if (!user_id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!task_id) {
      return res.status(400).json({ message: "Task ID not provided" });
    }

    const db = client.db('UsersDetails');
    const userTasksCollection = db.collection('userTasks');

    try{
    await userTasksCollection.updateOne(
      { _id: new ObjectId(user_id) },
      { $pull: { pendingTasks: new ObjectId(task_id) } }
    );
    }catch(error){
      console.error("Error removing task from user's task list:", error);
    }

    try{
    await userTasksCollection.updateOne(
      { _id: new ObjectId(user_id) },
      { $push: { completedTasks: new ObjectId(task_id) } }
    );
    }
    catch(error){
      console.error("Error adding task to user's task list:", error);
    }
    return res.status(200).json({ message: "Task marked as completed successfully" });
  } catch (error) {
    console.error("Error marking task as completed:", error);
    return res.status(500).json({ message: "Failed to mark task as completed" });
  }
});

app.post('/api/markTaskPending', async (req, res) => {
  const user_id = req.session.user_id;
  const { task_id } = req.body;

  try {
    if (!user_id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!task_id) {
      return res.status(400).json({ message: "Task ID not provided" });
    }

    const db = client.db('UsersDetails');
    const userTasksCollection = db.collection('userTasks');

    try{
    await userTasksCollection.updateOne(
      { _id: new ObjectId(user_id) },
      { $pull: { completedTasks: new ObjectId(task_id) } }
    );
    }catch(error){
      console.error("Error removing task from user's task list:", error);
    }

    try{
    await userTasksCollection.updateOne(
      { _id: new ObjectId(user_id) },
      { $push: { pendingTasks: new ObjectId(task_id) } }
    );
    }
    catch(error){
      console.error("Error adding task to user's task list:", error);
    }
    return res.status(200).json({ message: "Task marked as pending successfully" });
  } catch (error) {
    console.error("Error marking task as pending:", error);
    return res.status(500).json({ message: "Failed to mark task as pending" });
  }
});


app.post('/api/deleteTask', async (req, res) => {
  const user_id = req.session.user_id;
  const { task_id } = req.body;

  try {
    if (!user_id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!task_id) {
      return res.status(400).json({ message: "Task ID not provided" });
    }

    const db = client.db('UsersDetails');
    const userTasksCollection = db.collection('userTasks');

    try{
    await userTasksCollection.updateOne(
      { _id: new ObjectId(user_id) },
      { $pull: { pendingTasks: new ObjectId(task_id) } }
    );
    }catch(error){
      console.error("Error removing task from user's task list:", error);
    }

    try{
    await userTasksCollection.updateOne(
      { _id: new ObjectId(user_id) },
      { $pull: { completedTasks: new ObjectId(task_id) } }
    );
    }
    catch(error){
      console.error("Error removing task from user's task list:", error);
    }

    const taskCollection = db.collection('Tasks');
    try{
    await taskCollection.deleteOne({ _id: new ObjectId(task_id) });
    }
    catch(error){
      console.error("Error deleting task:", error);
    }
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({ message: "Failed to delete task" });
  }
});

app.post('/api/toUnImportant', async (req, res) => {
  const user_id = req.session.user_id;
  const { task_id } = req.body;

  try {
    if (!user_id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!task_id) {
      return res.status(400).json({ message: "Task ID not provided" });
    }

    const db = client.db('UsersDetails');
    const taskCollection = db.collection('Tasks');

    //update the task
    const response = await taskCollection.updateOne({ _id : new ObjectId(task_id)},{ $set: { task_priority: false } });

    if(response.modifiedCount === 0){
      console.log("Task not found")
      return res.status(404).json({ message: "Task not found" });
    }

    
    return res.status(200).json({ message: "Task marked as unimportant" });
  } catch (error) {
    console.error("Error marking task as unimportant:", error);
    return res.status(500).json({ message: "Failed to mark task as unimportant" });
  }
});

app.post('/api/toImportant', async (req, res) => {
  const user_id = req.session.user_id;
  const { task_id } = req.body;

  try {
    if (!user_id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!task_id) {
      return res.status(400).json({ message: "Task ID not provided" });
    }

    const db = client.db('UsersDetails');
    const taskCollection = db.collection('Tasks');

    //update the task
    const response = await taskCollection.updateOne({ _id : new ObjectId(task_id)},{ $set: { task_priority: true } });

    if(response.modifiedCount === 0){
      console.log("Task not found")
      return res.status(404).json({ message: "Task not found" });
    }

    
    return res.status(200).json({ message: "Task marked as important" });
  } catch (error) {
    console.error("Error marking task as important:", error);
    return res.status(500).json({ message: "Failed to mark task as important" });
  } 
});

app.post('/api/updateTask', async (req, res) => {
  const user_id = req.session.user_id;
  const { task_id, task_name, task_description, task_duedate, task_priority } = req.body;

  try {
    if (!user_id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!task_id) {
      return res.status(400).json({ message: "Task ID not provided" });
    }

    const db = client.db('UsersDetails');
    const taskCollection = db.collection('Tasks');

    //update the task
    const response = await taskCollection.updateOne({ _id : new ObjectId(task_id)},{ $set: { task_name, task_description, task_duedate, task_priority } });

    if(response.modifiedCount === 0){
      console.log("Task not found")
      return res.status(404).json({ message: "Task not found" });
    }

    
    return res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({ message: "Failed to update task" });
  }
});	


app.get('/api/importanttasks', async (req, res) => {
  const user_id = req.session.user_id;

  try {
    if (!user_id) {
      console.log("User not authenticated")
      return res.status(401).json({ message: "User not authenticated" });
    }

    const db = client.db('UsersDetails');
    const userTasksCollection = db.collection('userTasks');

    const userTasks = await userTasksCollection.findOne({ _id: new ObjectId(user_id) });
    if (!userTasks) {
      console.error("User not found in User tasks");
      return res.status(404).json({ message: "User not found in User tasks" });
    } else if (userTasks.pendingTasks.length === 0 ) {
      console.log("No important tasks found")
      return res.status(200).json({ pendingTasks: [] });
    }

    const pendingtaskIds = userTasks.pendingTasks.map(taskId => new ObjectId(taskId));

    const taskCollection = db.collection('Tasks');

    const pendingTasks = await taskCollection.find({
      $and: [
        { _id: { $in: pendingtaskIds } },
        { task_priority: true }
      ]
    }).toArray();
    console.log("Important tasks fetched successfully")
    return res.status(200).json({ pendingTasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

app.post('/api/logout', async (req, res) => {
  req.session.destroy();
  return res.status(200).json({ message: "Logout successful" });
});