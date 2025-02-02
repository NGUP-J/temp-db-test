const express = require("express");
const { CosmosClient, PartitionKeyKind } = require("@azure/cosmos");
const Family = require("./models/Familys");
const User = require('./models/User');
const db = require('./models/index');
const app = express();
const port = 5001;

// Cosmos DB connection details
const config = require("./config");
const url = require("url");

const endpoint = config.endpoint;
const key = config.key;

const databaseId = config.database.id;
const containerId = config.container.id;

// Create CosmosClient instance
const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);
const container = database.container(containerId);

// Middleware
app.use(express.json());


// Sync database
db.sequelize.sync().then(() => {
    console.log('Database synced');
  }).catch(err => {
    console.error('Error syncing database:', err);
  });

// Test API Route
app.get("/", (req, res) => {
  res.send("Hello from Express & Cosmos DB!");
});

// API Route to get all items from Cosmos DB
app.get("/items", async (req, res) => {
  try {
    const { resources: items } = await container.items.readAll().fetchAll();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data from Cosmos DB");
  }
});

// API Route to insert a new item
app.post("/items", async (req, res) => {
  try {
    const newItem = req.body;
    const { resource: createdItem } = await container.items.create(newItem);
    res.status(201).json(createdItem);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error inserting data into Cosmos DB");
  }
});

// API Route to get all families from Cosmos DB
app.get("/family", async (req, res) => {
  try {
    const items = await Family.getAll();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data from Cosmos DB");
  }
});

// API Route to insert a new family
app.post("/family", async (req, res) => {
  try {
    const newItem = req.body;
    const createdItem = await Family.create(newItem);
    res.status(201).json(createdItem);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error inserting data into Cosmos DB");
  }
});

// API Route to get all users from SQL Server
app.get('/users', async (req, res) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching data from SQL Server');
    }
  });
  
// API Route to insert a new user
app.post('/users', async (req, res) => {
try {
    const newUser = req.body;
    const createdUser = await User.create(newUser);
    res.status(201).json(createdUser);
} catch (err) {
    console.error(err);
    res.status(500).send('Error inserting data into SQL Server');
}
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
