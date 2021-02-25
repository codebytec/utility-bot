const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
const request = require("request");
const fs = require("fs");

module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run () {
    this.client.appInfo = await this.client.fetchApplication();
    setInterval( async () => {
      this.client.appInfo = await this.client.fetchApplication();
    }, 60000);

    try {
      fs.readFileSync("botbans.json");
    } catch (e) {
      console.log("Creating bot bans file...");
      fs.appendFileSync("botbans.json", JSON.stringify([], null, 4));
    }

    try {
      fs.readFileSync("command_logs.txt");
    } catch (e) {
      console.log("Creating command logs file...");
      fs.appendFileSync("command_logs.txt", "<-- Beggining of Command File -->");
    }

    await this.client.user.setStatus("online");

    const statusArray = [
      (client) => client.user.setActivity(`${this.client.guilds.size} servers | uhelp`, { type: "WATCHING" }),
      (client) => client.user.setActivity(`${this.client.channels.size} channels | uhelp`, { type: "WATCHING" }),
      (client) => client.user.setActivity(`${this.client.users.size} users | uhelp`, { type: "WATCHING" })
    ];

    var pick = 0;
    setInterval(() => {
      statusArray[pick](this.client);
      pick += 1;
      if (pick === 3) pick = 0;
    }, 20000);

    let users = 0;
    this.client.guilds.cache.map(g => users += g.memberCount);

    this.client.dashboard = require("../modules/dashboard.js")(this.client);
    this.client.logger.log(`Logged in as ${this.client.user.tag}! Serving ${this.client.guilds.cache.size} Servers and ${users} Users.`, "ready");
    this.client.readyState = true;
  }
};
