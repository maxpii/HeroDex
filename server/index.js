const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // For making HTTP requests (Node <18)
const crypto = require("crypto");    // For creating MD5 hash required by Marvel API
require("dotenv").config();

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(cors()); // Allow frontend (React) to call this backend
app.use(express.json()); // Enable JSON body parsing

const publicKey = process.env.MARVEL_PUBLIC_KEY;
const privateKey = process.env.MARVEL_PRIVATE_KEY;
const superToken = process.env.SUPER_TOKEN

// ✅ Root test route
app.get("/", (req, res) => {
  res.send("✅ Backend is working!");
});

// ✅ Character route
app.get("/character", async (req, res) => {
  const name = req.query.name;

  if (!name) {
    return res.status(400).json({ error: "Character name is required" });
  }

  const ts = new Date().getTime();
  const hash = crypto
    .createHash("md5")
    .update(ts + privateKey + publicKey)
    .digest("hex");

  const url=`https://www.superheroapi.com/api.php/${superToken}/search/${name}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data); 
    console.log("Superhero API response for search:", data);
  } catch (error) {
    console.error("Error fetching character:", error);
    res.status(500).json({ error: "Failed to fetch character." });
  }
});

// ✅ Get a list of characters by ID range
app.get("/heroes", async (req, res) => {
  const heroes = [];
  // You can adjust this range as needed, or make it dynamic with query parameters
  for (let i = 1; i <= 20; i++) { // Fetching first 20 characters as an example
    const url = `https://www.superheroapi.com/api.php/${superToken}/${i}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.response !== "error") { // Check if data is valid and not an error
        heroes.push(data);
      }
    } catch (error) {
      console.error(`Error fetching character ID ${i}:`, error);
      // Continue to next character even if one fails
    }
  }
  res.json(heroes);
});

// ✅ Save a hero for a logged-in user
app.post("/api/saveHero", async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  const { hero } = req.body;

  if (!idToken || !hero) {
    return res.status(400).json({ error: "Missing ID token or hero data" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Use the hero's ID as the document ID to prevent duplicates
    const db = admin.firestore();
    const heroRef = db.collection("users").doc(uid).collection("savedHeroes").doc(String(hero.id));

    const doc = await heroRef.get();
    if (doc.exists) {
      return res.status(409).json({ message: "Hero already saved." }); // 409 Conflict
    }

    await heroRef.set(hero);

    res.status(200).json({ message: "Hero saved successfully!" });
  } catch (error) {
    console.error("Error saving hero:", error);
    res.status(500).json({ error: "Failed to save hero." });
  }
});

// Get all saved heroes for a user
app.get("/api/savedHeroes", async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const db = admin.firestore();
    const snapshot = await db.collection("users").doc(uid).collection("savedHeroes").get();
    const heroes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(heroes);
  } catch (error) {
    console.error("Error fetching saved heroes:", error);
    res.status(500).json({ error: "Failed to fetch saved heroes." });
  }
});

// Remove a saved hero
app.delete("/api/savedHeroes/:heroId", async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  const { heroId } = req.params;
  if (!idToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const db = admin.firestore();
    await db.collection("users").doc(uid).collection("savedHeroes").doc(heroId).delete();
    res.status(200).json({ message: "Hero removed successfully!" });
  } catch (error) {
    console.error("Error removing hero:", error);
    res.status(500).json({ error: "Failed to remove hero." });
  }
});

// Add a hero to the deck
app.post("/api/addToDeck", async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  const { hero } = req.body;
  if (!idToken || !hero) {
    return res.status(400).json({ error: "Missing ID token or hero data" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Use the hero's ID as the document ID to prevent duplicates
    const db = admin.firestore();
    const heroRef = db.collection("users").doc(uid).collection("deck").doc(String(hero.id));

    const doc = await heroRef.get();
    if (doc.exists) {
      return res.status(409).json({ message: "Hero already in deck." }); // 409 Conflict
    }

    await heroRef.set(hero);

    res.status(200).json({ message: "Hero added to deck successfully!" });
  } catch (error) {
    console.error("Error adding hero to deck:", error);
    res.status(500).json({ error: "Failed to add hero to deck." });
  }
});

// Get all heroes in the deck
app.get("/api/deck", async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const db = admin.firestore();
    const snapshot = await db.collection("users").doc(uid).collection("deck").get();
    const heroes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(heroes);
  } catch (error) {
    console.error("Error fetching deck:", error);
    res.status(500).json({ error: "Failed to fetch deck." });
  }
});

// Remove a hero from the deck
app.delete("/api/deck/:heroId", async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  const { heroId } = req.params;
  if (!idToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const db = admin.firestore();
    await db.collection("users").doc(uid).collection("deck").doc(heroId).delete();
    res.status(200).json({ message: "Hero removed from deck successfully!" });
  } catch (error) {
    console.error("Error removing hero from deck:", error);
    res.status(500).json({ error: "Failed to remove hero from deck." });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
