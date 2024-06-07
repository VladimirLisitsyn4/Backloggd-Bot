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

    if (interaction.commandName == 'get-info') {
        axios.get(`https://www.backloggd.com/u/${interaction.options.get('username').value}`).then(response => {
            const html = response.data;
            const $ = cheerio.load(html);

            const username = $('h3.main-header').text().trim();
            var fav_game;

            axios.get(`https://www.backloggd.com${$('#profile-favorites').find($('.ultimate_fav')).find($('a.cover-link')).attr('href')}`).then(response => {
                const html = response.data;
                const $ = cheerio.load(html);

                fav_game = $('#title').find($('h1.mb-0:first')).text().trim();

                interaction.reply(`Found user: ${username} \nTheir favourite game is: ${fav_game}`);
            }).catch(error => { interaction.reply('Error fetching the user\'s favorite game:', error); });
        }).catch(error => { interaction.reply('Error fetching the username:', error); });
    }
})

client.login(process.env.TOKEN);