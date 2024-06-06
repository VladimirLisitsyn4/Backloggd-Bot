require('dotenv').config();
const {REST, Routes, ApplicationCommandOptionType} = require('discord.js');

const commands = [
    {
        name: 'yep',
        description: 'replies with yupyup'
    },
    {
        name: 'add',
        description: 'adds 2 numbers',
        options: [
            {
                name: "num-1",
                description: "first number",
                type: ApplicationCommandOptionType.Number,
                choices: [
                    {
                        name: 'one',
                        value: 1,
                    },
                    {
                        name: 'two',
                        value: 2,
                    }
                ],
                required: true
            },
            {
                name: "num-2",
                description: "second number",
                type: ApplicationCommandOptionType.Number,
                required: true
            }
        ]
    }
];

const rest = new REST({ version: '10'}).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registering Commands...')

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            {body: commands}
        )

        console.log('Commands Registered Successfully')
    } catch (error) {
        console.log(error);
    }
})();