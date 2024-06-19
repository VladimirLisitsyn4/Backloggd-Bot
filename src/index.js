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

            let recentlyPlayed =[]

            $(`#profile-journal`).find('.game-cover').each((index, element) => {
                recentlyPlayed.push($(element).attr('game_id'));
            });

            const favGameId = $(`.ultimate_fav`).find('.game-cover').attr('game_id')

            const accessToken = await getIGDBToken();

            const favGame = await getGameNameById(favGameId, accessToken);
            
            let recentlyPlayedNames = [];
            for (let gameId of recentlyPlayed) {
                const gameName = await getGameNameById(gameId, accessToken);
                recentlyPlayedNames.push(gameName);
            }

            await interaction.editReply(`Found user: ${usernameText}\nTheir favourite game is: ${favGame}\nTheir most recently played game is: ${recentlyPlayedNames[0]}`);
        } catch (error) {
            console.error(error);
            await interaction.editReply('Error fetching the user info.');
        }
    }
})

async function getIGDBToken() {
    const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
        params: {
            client_id: process.env.IGDB_ID,
            client_secret: process.env.IGDB_SECRET,
            grant_type: 'client_credentials'
        }
    });
    return response.data.access_token;
}

async function getGameNameById(gameId, accessToken) {
    const response = await axios.post('https://api.igdb.com/v4/games', `fields name; where id = ${gameId};`, {
        headers: {
            'Client-ID': process.env.IGDB_ID,
            'Authorization': `Bearer ${accessToken}`
        }
    });
    return response.data[0].name;
}

client.login(process.env.TOKEN);