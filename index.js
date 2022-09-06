const { Client, Intents, Collection } = require("discord.js");

const client = new Client({
    intents: [ Intents.FLAGS.GUILDS ],
});
module.exports = client;

// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();
client.config = require("./config.js");

// Initializing the project
require("./handler")(client);

client.login(client.config.token);

// Keeping the code alive
const express = require('express')
const app = express();
const port = 3000;
app.get('/', (req, res) => {
  res.redirect('https://discord.gg/4Dz2CHpmaT')
})
app.listen(port, () => {
  console.log(`Connected to express - http://localhost:${port}`)
})