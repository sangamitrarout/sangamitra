require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 9900;

app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://sangamitrarout789_db_user:b4gDmtCZzwussMDh@cluster0.b8mjabg.mongodb.net/?appName=Cluster0";

mongoose.connect(uri)
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch(err => console.error("❌ Connection error:", err));

const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now }
});

const Message = mongoose.model("Message", messageSchema);


app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    res.status(201).json({ message: "Message saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save message" });
  }
});

app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


