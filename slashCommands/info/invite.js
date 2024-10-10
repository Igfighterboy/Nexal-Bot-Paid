const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ButtonStyle } = require('discord.js');
const { GameDig } = require("gamedig");
module.exports = {
	name: 'samp-status',
	description: "To Get The SA-MP Status",
	cooldown: 3000,
	type: ApplicationCommandType.ChatInput,
	userPerms: [],
	botPerms: [],
	run: async (client, interaction) => {
		await interaction.deferReply({ ephmeral: false })
		GameDig.query({
            type:'gtasam',
            host: 'ngrp-samp.online',
            port: 7792
        }).then((state) => {
            const playerList = state.players.length > 0
                ? state.players.slice(0, 40).map(player => `- ${player.raw.id} - ${player.name || 'Unknown'}`).join('\n')
                : 'No players online.';

            const remainingCount = state.players.length - 40;
            const remainingText = remainingCount > 0 ? `\n\n...and ${remainingCount} more player(s)` : '';

            const now = new Date();
            const optionsDate = { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
            const formattedDate = now.toLocaleString('en-US', optionsDate).replace(' at ', ', ');

            const embed = new EmbedBuilder()
                .setColor('#0099ff') 
                .setFooter({ text: `Last Update: ${formattedDate}` })
                .setTitle('Server Status')
                .addFields([
                    {
                        name: 'Server Name',
                        value: state.name || 'Unknown',
                        inline: false,
                    },
                    {
                        name: 'Address',
                        value: `${state.connect || 'Unknown'}`,
                        inline: false,
                    },
                    {
                        name: 'Game Mode',
                        value: state.raw.gamemode || 'Unknown',
                        inline: false,
                    },
                    {
                        name: 'Map',
                        value: state.raw.map || 'Unknown',
                        inline: false,
                    },
                    {
                        name: 'Online Players',
                        value: `${state.numplayers}/${state.maxplayers || 'Unknown'}`,
                        inline: false,
                    },
                    {
                        name: 'Players',
                        value: `${playerList}${remainingText}`,
                        inline: false,
                    }
                ]);

            interaction.editReply({ embeds: [embed], ephmeral: true });
        }).catch((error) => {
            console.error('Error fetching server state:', error);
            interaction.editReply('An error occurred while querying the server.');
        });
    }
};
