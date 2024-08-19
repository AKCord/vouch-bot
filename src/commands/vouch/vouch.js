const {
	SlashCommandBuilder,
	EmbedBuilder,
	time,
	TimestampStyles,
} = require("discord.js");
const Vouch = require("../../schemas/vouch");
function generateId(length) {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let id = "";

	for (let i = 0; i < length; i++) {
		id += characters.charAt(Math.floor(Math.random() * characters.length));
	}

	return id;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName("vouch")
		.setDescription("Configure vouch settings.")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("submit")
				.setDescription("Vouch the server!")
				.addStringOption((option) =>
					option
						.setName("product")
						.setDescription("The product you bought")
						.setRequired(true),
				)
				.addIntegerOption((option) =>
					option
						.setMaxValue(5)
						.setMinValue(1)
						.setName("rating")
						.setDescription(
							"The amount of stars you want to give for the service (1-5)",
						)
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName("message")
						.setDescription("The optional message you'd like to give")
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("lookup")
				.setDescription("Lookup a vouch by its ID.")
				.addStringOption((option) =>
					option
						.setName("id")
						.setDescription("The ID of the vouch to look up.")
						.setRequired(true),
				),
		)

		.toJSON(),
	run: async (client, interaction) => {
		switch (interaction.options.getSubcommand()) {
			case "submit": {
				const date = new Date();
				const relativetimestamp = time(date, TimestampStyles.LongTime);
				const product = interaction.options.getString("product");
				const rating = interaction.options.getInteger("rating");
				const optmessage = interaction.options.getString("message");

				const newVouch = new Vouch({
					userId: interaction.user.id,
					date: date,
					optMessage: optmessage,
					product: product,
					review: rating,
					id: generateId(7),
				});

				try {
					await newVouch.save();

					const vouchEmbed = new EmbedBuilder()
						.setThumbnail(
							interaction.user.displayAvatarURL({
								dynamic: true,
								size: 256,
							}),
						)
						.setColor("White")
						.setTitle("Thanks for vouching!")
						.setDescription(
							`${"⭐".repeat(rating)} **(${rating}/5)**\n\n**Vouch**:\n > ${optmessage}`,
						)
						.addFields(
							{
								name: "**__Vouched by:__**",
								value: `*<@${interaction.user.id}>*`,
								inline: true,
							},
							{
								name: "**__Product__**",
								value: `*${product}*`,
								inline: true,
							},
							{
								name: "**__Vouched at:__**",
								value: `*${relativetimestamp}*`,
								inline: true,
							},
							{
								name: "**__Vouch ID__**",
								value: `**${newVouch.id}**`,
								inline: true,
							},
						)
						.setTimestamp()
						.setFooter({
							text: interaction.user.tag,
							iconURL: interaction.guild.iconURL(),
						});

					await interaction.reply({
						embeds: [vouchEmbed],
					});
				} catch (error) {
					console.error("Error saving vouch:", error);
					await interaction.reply({
						content: "An error occurred while saving your vouch.",
						ephemeral: true,
					});
				}
				break;
			}

			case "lookup": {
				const vouchId = interaction.options.getString("id");

				try {
					const vouch = await Vouch.findOne({
						id: vouchId,
					});

					if (!vouch) {
						return await interaction.reply({
							content: "No vouch found with the provided ID.",
							ephemeral: true,
						});
					}

					const vouchEmbed = new EmbedBuilder()
						.setTitle("Vouch Details")
						.setColor("White")
						.setThumbnail(
							client.users.cache.get(vouch.userId)?.displayAvatarURL({
								dynamic: true,
								size: 256,
							}) || "",
						)
						.setDescription(
							`${"⭐".repeat(vouch.review)} **(${vouch.review}/5)**\n\n**Vouch**:\n > ${vouch.optMessage}`,
						)
						.addFields(
							{
								name: "**__Vouched by:__**",
								value: `<@${vouch.userId}>`,
								inline: true,
							},
							{
								name: "**__Product__**",
								value: `${vouch.product}`,
								inline: true,
							},
							{
								name: "**__Vouched at:__**",
								value: `<t:${Math.floor(vouch.date.getTime() / 1000)}:F>`,
								inline: true,
							},
						)
						.setTimestamp()
						.setFooter({
							text: `${vouchId}`,
						});

					await interaction.reply({
						embeds: [vouchEmbed],
						ephemeral: true,
					});
				} catch (error) {
					console.error("Error looking up vouch:", error);
					await interaction.reply({
						content: "An error occurred while looking up the vouch.",
						ephemeral: true,
					});
				}
				break;
			}
		}
	},
};
