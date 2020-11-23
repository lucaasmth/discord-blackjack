const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const Cards = require("./cards");


client.on("ready", () => {
	console.log("Ready!");
});

client.on("message", message => {
	if (!message.content.startsWith(config.prefix) || message.author.bot) return;

	const args = message.content.slice(config.prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

	if (command === "play"){
		console.log("Starting game...");
		let players = [];

		const playerEntry = new Discord.MessageEmbed()
			.setColor('#fc0303')
			.setTitle('Qui pour une partie ?')
			.setAuthor(client.user.username, client.user.avatarURL())
			.setThumbnail(client.user.avatarURL())
			.addFields(
				{ name: 'Click ▶ to join within 10s', value: 'ça vaut le coup' },
			)
			.setTimestamp()
			.setFooter('@lucaasmth & FloW');
		
		message.channel.send(playerEntry).then(async sentMessage => {
			try {
				await sentMessage.react("▶");
			} catch (error) {
				console.error('One of the emojis failed to react.');
			}
			const filter = (reaction, user) => {
				return reaction.emoji.name === "▶" && !players.includes(user);
			};
			let collected = await sentMessage.awaitReactions(filter, {time: 10000});
			players = getPlayersWhoWantToPlay(collected, message.author);
			//players.push(message.author);
			if (players.length == 0) {
				const noPlayerEmbed = new Discord.MessageEmbed()
					.setColor('#fc0303')
					.setTitle('Personne ne veut jouer')
					.setDescription('C\'est bien triste :cry:')
					.setAuthor(client.user.username, client.user.avatarURL())
					.setThumbnail(client.user.avatarURL())
					.setTimestamp()
					.setFooter('@lucaasmth & FloW');
				message.channel.send(noPlayerEmbed).then(() => console.log("Stopped game, no player..."));
			} else {
				game(players, message);
			}
		})
	}
});

async function game(players, message){
	let cards = new Cards();
	let playing = true;
	let nbRound = 1;
	let mainJoueur = [];
	let mainDealer = [];
	mainDealer.push(cards.drawCard())
	round(cards, mainJoueur, mainDealer, message, nbRound, players)
}

async function round(cards, mainJoueur, mainDealer, message, nbRound, players){
	mainJoueur.push(cards.drawCard())
	let mainJoueurDisplay = "`"
	let mainDealerDisplay = "`"
	let totalJoueur;
	let totalDealer;
	for(let i = 0; i < mainJoueur.length; i++){
		mainJoueurDisplay += mainJoueur[i]
		if(i != mainJoueur.length-1){
			mainJoueurDisplay += "` - `"
		}
	}
	mainJoueurDisplay+="`\n"
	totalJoueur = Cards.sumCards(mainJoueur)
	mainJoueurDisplay += "Total : "+totalJoueur
	if(nbRound == 5){
		gagne(mainJoueur, mainDealer, message, nbRound, players)
	}
	if(totalJoueur == 21){
		gagne(mainJoueur, mainDealer, message, nbRound, players)
		return 0;
	}
	if(totalJoueur > 21){
		perdu(mainJoueur, mainDealer, message, nbRound, players)
		return 0;
	}

	for(let i = 0; i < mainDealer.length; i++){
		mainDealerDisplay += mainDealer[i]
		if(i != mainDealer.length-1){
			mainDealerDisplay += "` - `"
		}
	}
	mainDealerDisplay+="`\n"
	totalDealer = Cards.sumCards(mainDealer)
	mainDealerDisplay += "Total : "+totalDealer

	const embed = new Discord.MessageEmbed()
		.setColor('#fc0303')
		.setTitle('Round '+nbRound+"/5")
		.setAuthor(client.user.username, client.user.avatarURL())
		.setThumbnail(client.user.avatarURL())
		.addField("Votre main", mainJoueurDisplay)
		.addField("Main dealer", mainDealerDisplay)
		.setTimestamp()
		.setFooter('@lucaasmth & FloW');
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
				round(cards, mainJoueur, mainDealer, message, ++nbRound, players)
			} else {
				while(totalDealer < totalJoueur && totalDealer <= 21){
					mainDealer.push(cards.drawCard())
					totalDealer = Cards.sumCards(mainDealer)
					//console.log(totalDealer)
					if(totalDealer == 21){
						perdu(mainJoueur, mainDealer, message, nbRound, players)
						return 0;
					}
				}
				if(totalDealer > 21){
					gagne(mainJoueur, mainDealer, message, nbRound, players);
					return 0;
				}
				if(totalDealer > totalJoueur){
					perdu(mainJoueur, mainDealer, message, nbRound, players)
					return 0;
				}
			}
		})
	});
}

function perdu(mainJoueur, mainDealer, message, nbRound, players){
	let mainJoueurDisplay = "`";
	let mainDealerDisplay = "`";
	for(let i = 0; i < mainJoueur.length; i++){
		mainJoueurDisplay += mainJoueur[i]
		if(i != mainJoueur.length-1){
			mainJoueurDisplay += "` - `"
		}
	}
	mainJoueurDisplay+="`\n"
	mainJoueurDisplay += "Total : "+Cards.sumCards(mainJoueur)
	for(let i = 0; i < mainDealer.length; i++){
		mainDealerDisplay += mainDealer[i]
		if(i != mainDealer.length-1){
			mainDealerDisplay += "` - `"
		}
	}
	mainDealerDisplay+="`\n"
	mainDealerDisplay += "Total : "+Cards.sumCards(mainDealer)
	const embed = new Discord.MessageEmbed()
		.setColor('#fc0303')
		.setTitle("C'est perdu !!")
		.setAuthor(client.user.username, client.user.avatarURL())
		.setThumbnail(client.user.avatarURL())
		.addField("Votre main",
		mainJoueurDisplay)
		.addField("Main dealer",
		mainDealerDisplay)
		.setTimestamp()
		.setFooter('@lucaasmth & FloW');
	message.channel.send(embed).then(() => console.log("Stopped game, dealer won..."));
}

function gagne(mainJoueur, mainDealer, message, nbRound, players){
	let mainJoueurDisplay = "`";
	let mainDealerDisplay = "`";
	for(let i = 0; i < mainJoueur.length; i++){
		mainJoueurDisplay += mainJoueur[i]
		if(i != mainJoueur.length-1){
			mainJoueurDisplay += "` - `"
		}
	}
	mainJoueurDisplay+="`\n"
	mainJoueurDisplay += "Total : "+Cards.sumCards(mainJoueur)
	for(let i = 0; i < mainDealer.length; i++){
		mainDealerDisplay += mainDealer[i]
		if(i != mainDealer.length-1){
			mainDealerDisplay += "` - `"
		}
	}
	mainDealerDisplay+="`\n"
	mainDealerDisplay += "Total : "+Cards.sumCards(mainDealer)
	const embed = new Discord.MessageEmbed()
		.setColor('#fc0303')
		.setTitle("C'est gagné !!")
		.setAuthor(client.user.username, client.user.avatarURL())
		.setThumbnail(client.user.avatarURL())
		.addField("Votre main",
		mainJoueurDisplay)
		.addField("Main dealer",
		mainDealerDisplay)
		.setTimestamp()
		.setFooter('@lucaasmth & FloW');
	message.channel.send(embed).then(() => console.log("Stopped game, players won..."));
}



function getPlayersWhoWantToPlay(collected, messageAuthor){
	let players = [];
	if(collected.get("▶") != undefined){
		for(let user of collected.get("▶").users.cache){
			user = user[1];
			if(!user.bot){
				players.push(user);
			}
		}
	}
	return players;
}

client.login(config.token);