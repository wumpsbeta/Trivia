const { Client, CommandInteraction } = require("discord.js");

module.exports = {
    name: "invite",
    description: "Gets the invite for Wumps",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
       try {
         interaction.deferReply("You cannot invite Wumps anymore as the bot has shutdown. 😥\nYou may be able to invite it again in the future if it becomes available. 🙃");
      } catch { interaction.deferReply("You cannot invite Wumps anymore as the bot has shutdown. 😥\nYou may be able to invite it again in the future if it becomes available. 🙃") 
              };
      console.log(`${interaction.user.tag} used invite.`)
      },
};