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

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName == 'yep')
        interaction.reply("yupyup");

    if (interaction.commandName == 'get-info') {
        await interaction.deferReply();

        try {
            const username = interaction.options.get('username').value;
            const userUrl = `https://www.backloggd.com/u/${username}`;
            let response;
            try {
                response = await axios.get(userUrl);
            } catch (error) {
                //console.error('Error fetching the username:', error);
                return interaction.editReply('This user does not exist.');
            }
            const html = response.data;
            const $ = cheerio.load(html);

            const usernameText = $('h3.main-header').text().trim();
            const favGameUrl = `https://www.backloggd.com${$('#profile-favorites').find('.ultimate_fav a.cover-link').attr('href')}`;
            
            let favGameResponse;
            try {
                favGameResponse = await axios.get(favGameUrl);
            } catch (error) {
                //console.error('Error fetching the user\'s favorite game:', error);
                return interaction.editReply(`Found user: ${usernameText}`);
            }
            const favGameHtml = favGameResponse.data;
            const $$ = cheerio.load(favGameHtml);

            const favGame = $$('#title h1.mb-0:first').text().trim();

            await interaction.editReply(`Found user: ${usernameText}\nTheir favourite game is: ${favGame}`);
        } catch (error) {
            console.error(error);
            await interaction.editReply('Error fetching the user info.');
        }
    }
})

client.login(process.env.TOKEN);