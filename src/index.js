require('dotenv').config();
const {Client, IntentsBitField} = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
})

client.on('ready', (c) => {
    console.log(`${c.user.username} is online.`);
})

client.on('messageCreate', (msg) => {
    if (msg.author.bot)
        return
    if (msg.content == "pingping")
        msg.reply('ping');
});

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName == 'yep')
        interaction.reply("yupyup");

    if (interaction.commandName == 'get-name') {
        axios.get(`https://www.backloggd.com/u/${interaction.options.get('username').value}`)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);

            // Example: Extracting all links from the webpage
            const username = $('h3.main-header').text().trim();

            interaction.reply(`Found user: ${username}`);
        })
        .catch(error => {
            interaction.reply('Error fetching the username:', error);
        });
    }
})

client.login(process.env.TOKEN);