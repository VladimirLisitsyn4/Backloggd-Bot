require('dotenv').config();
const {Client, IntentsBitField} = require('discord.js');

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

    if (interaction.commandName == 'add') {
        const num1 = interaction.options.get('num-1').value;
        const num2 = interaction.options.get('num-2').value;

        interaction.reply(`Those numbers add to: ${num1 + num2}`);
    }
})

client.login(process.env.TOKEN);