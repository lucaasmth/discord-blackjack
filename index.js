const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

client.on("ready", () => {
	console.log("Ready!");
});

client.on("message", message => {
	if (!message.content.startsWith(config.prefix) || message.author.bot) return;

	const args = message.content.slice(config.prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();
	if (command === "play"){
		console.log("Starting game...");
		const players = [message.author];
		const embed = new Discord.MessageEmbed()
			.setColor('#fc0303')
			.setTitle('BlackJack !!!!')
			.setAuthor(message.author.username, message.author.avatarURL())
			.setThumbnail(client.user.avatarURL())
			.addFields(
				{ name: 'Dealer\'s hand', value: '♦ J\n Total : 10' },
				//{ name: '\u200B', value: '\u200B' },
			)
			.setTimestamp()
			.setFooter('@lucaasmth');
		players.forEach((player) => {
			embed.addField(`${player.username}\'s hand`, '♥ 9\n Total : 9', true)
		})
		message.channel.send(embed).then(async sentMessage => {
			try {
				await sentMessage.react("▶");
				await sentMessage.react("⏹");
			} catch (error) {
				console.error('One of the emojis failed to react.');
			}

			const filter = (reaction, user) => {
				return players.includes(user);
			};
			let playing = true;
			while(playing){
				console.log("Waiting for reactions...");
				await sentMessage.awaitReactions(filter, {time: 10000})
				.then(collected => {
					nbH = 0;
					nbS = 0;
					collected.forEach((reaction) => {
						if(reaction.emoji.name === "▶") nbH++;
						else if(reaction.emoji.name === "⏹") nbS++;
					})
					if(nbH > nbS){
						console.log("H");
					} else {
						console.log("S");
						playing = false;
					}
				})
			}
			console.log("Game ended...");
		});
	}
});

client.login(config.token);