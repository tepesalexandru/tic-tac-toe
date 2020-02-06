/// Core file for the Server

// Server setup
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const server = app.listen(port, () => console.log(`Listening on port ${port}`));

// Static files
app.use(express.static("public"));

// This array contains every active user
let allClients = [];

// Export things that need to be used by other scripts

module.exports = { server, allClients };

// Run the following scripts
require("./server");
