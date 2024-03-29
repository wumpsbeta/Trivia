const Discord = require("discord.js");
const triviaSchema = require("../../schemas/trivia");

function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }

    return array;
}

const checkAnswers = (answers, questions) => {
    const questionAns = questions.map((question) => question.key);

    const correctAns = [];

    if (questionAns[0] == answers[0]) correctAns.push(true);
    if (questionAns[1] == answers[1]) correctAns.push(true);
    if (questionAns[2] == answers[2]) correctAns.push(true);
    if (questionAns[3] == answers[3]) correctAns.push(true);
    if (questionAns[4] == answers[4]) correctAns.push(true);
    if (questionAns[5] == answers[5]) correctAns.push(true);
    if (questionAns[6] == answers[6]) correctAns.push(true);
    if (questionAns[7] == answers[7]) correctAns.push(true);
    else correctAns.push(false);

    const correct = correctAns.length;

    return correct;
};

const questionEmbedRow = async (questionNumber, questions, author) => {
    const embedOptionsValues = [
        questions[questionNumber].options[0],
        questions[questionNumber].options[1],
        questions[questionNumber].options[2],
        questions[questionNumber].options[3],
    ];
    shuffle(embedOptionsValues);

    embedOptionsValues.splice(2, 0, "\u200b");

    const embedOptions = embedOptionsValues.map((value, i) => {
        const inline = true;
        if (i === 0 || i === 1) {
            return {
                name: `${i === 0 ? "A" : "B"}`,
                value,
                inline,
            };
        } else if (i === 3 || i === 4) {
            return {
                name: `${i === 3 ? "C" : "D"}`,
                value,
                inline,
            };
        } else {
            return {
                name: value,
                value,
            };
        }
    });

    const embed = new Discord.MessageEmbed({
        title: `Question ${questionNumber + 1}: ${
            questions[questionNumber].question
        }`,
        description: "Your options are:",
        fields: [embedOptions],
        footer: {
            text: `${questionNumber * -1 + 8} question(s) remaining • ${
                (questionNumber / 8) * 100
            }% completed`,
        },
        color: "#6e8bd3",
    });

    const options = [
        new Discord.MessageButton({
            label: "A",
            style: "PRIMARY",
            customId: `Question${questionNumber + 1}OptionA`,
        }),
        new Discord.MessageButton({
            label: "B",
            style: "PRIMARY",
            customId: `Question${questionNumber + 1}OptionB`,
        }),
        new Discord.MessageButton({
            label: "C",
            style: "PRIMARY",
            customId: `Question${questionNumber + 1}OptionC`,
        }),
        new Discord.MessageButton({
            label: "D",
            style: "PRIMARY",
            customId: `Question${questionNumber + 1}OptionD`,
        }),
    ];

    const row = new Discord.MessageActionRow().addComponents(options);

    return { embeds: [embed], components: [row] };
};

module.exports = {
    name: "trivia",
    description: "Starts a trivia game",
    type: "CHAT_INPUT",
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction) => {
      const { user } = interaction;
      
        const filter = {
            _id: `${interaction.guild.id}_${interaction.user.id}`,
            userId: interaction.user.id,
        };
        const update = { $inc: { userAttempts: parseInt(1) } };
        let data = await triviaSchema.findOneAndUpdate(filter, update);

        if (!data) {
            data = await triviaSchema.create({
                _id: `${interaction.guild.id}_${interaction.user.id}`,
                userId: interaction.user.id,
                userAttempts: parseInt(1),
            });
        }
        await interaction.deferReply({ ephemeral: true });

        if (data.userAttempts >= 2)
            return interaction.editReply(
                "You cannot play the trivia more than twice! 🙁"
            );

        const questions = require("../../questions.json");

        await interaction.editReply({
            embeds: [
                new Discord.MessageEmbed({
                    title: "Generating trivia..",
                    description: "Please wait while the trivia generates!",
                    color: "#6e8bd3",
                }),
            ],
        });
  
try {
  const msg = await user.send(await questionEmbedRow(0, questions, user));

        await interaction.editReply({
            embeds: [
                new Discord.MessageEmbed({
                    title: "Trivia generated!",
                    description: `You can access the trivia by going to your DMs.\n[Take me there](${msg.url}).`,
                    color: "#6e8bd3",
                }),
            ],
        });

      const collector = await msg.channel.createMessageComponentCollector({});

        let answers = [];
        let answers_n = [];

      collector.on("collect", async (customInteraction) => {
            const { customId } = customInteraction;
            answers.push(customId);

            const fCustomID = customId.slice(0, -7);

            const findOptionByOption = (customId) => {
                const button =
                    customInteraction.message.components[0].components.find(
                        (button) => button.customId == customId
                    );
                const optionValSelected = button.label;

                const field = customInteraction.message.embeds[0].fields.find(
                    (field) => field.name == optionValSelected
                );

                const optionSelected = field.value;

                return optionSelected;
            };

            if (fCustomID === "Question1") {
                const optionSelected = findOptionByOption(customId);

                answers_n.push(optionSelected);

                await customInteraction.update(
                    await questionEmbedRow(1, questions, user)
                );
            }

            if (fCustomID === "Question2") {
                const optionSelected = findOptionByOption(customId);

                answers_n.push(optionSelected);

                await customInteraction.update(
                    await questionEmbedRow(2, questions, user)
                );
            }

            if (fCustomID === "Question3") {
                const optionSelected = findOptionByOption(customId);

                answers_n.push(optionSelected);

                await customInteraction.update(
                    await questionEmbedRow(3, questions, user)
                );
            }

            if (fCustomID === "Question4") {
                const optionSelected = findOptionByOption(customId);

                answers_n.push(optionSelected);

                await customInteraction.update(
                    await questionEmbedRow(4, questions, user)
                );
            }

            if (fCustomID === "Question5") {
                const optionSelected = findOptionByOption(customId);

                answers_n.push(optionSelected);

                await customInteraction.update(
                    await questionEmbedRow(5, questions, user)
                );
            }

            if (fCustomID === "Question6") {
                const optionSelected = findOptionByOption(customId);

                answers_n.push(optionSelected);

                await customInteraction.update(
                    await questionEmbedRow(6, questions, user)
                );
            }

            if (fCustomID === "Question7") {
                const optionSelected = findOptionByOption(customId);

                answers_n.push(optionSelected);

                await customInteraction.update(
                    await questionEmbedRow(7, questions, user)
                );
            }

            if (fCustomID === "Question8") {
                const optionSelected = findOptionByOption(customId);

                answers_n.push(optionSelected);

                await customInteraction.message.delete();
                collector.stop("quiz ended");
            }
        });

        let ended = { didItEnd: false };

        var targetProxy = new Proxy(ended, {
            set: async function (target, key, value) {
                const competitor = client.guilds.cache
                    .get("801470504803893278")
                    .roles.cache.find((r) => r.id === "1015269694065885395");

                const winner = client.guilds.cache
                    .get("801470504803893278")
                    .roles.cache.find((r) => r.id === "1015269957652725852");

                const score = checkAnswers(answers_n, questions);
                if (score < 2) {
                    await interaction.member.send(
                        `You completed Wumps Trivia with a score of ${score}/8 (${
                            (score / 8) * 100
                        }%). 😡\nDue to this, you have not received any roles in Wumpus Paradise, including Wumps Trivia Contestant. 😤`
                    );
                } else if (score < 4) {
                    await interaction.member.send(
                        `You completed Wumps Trivia with a score of ${score}/8 (${
                            (score / 8) * 100
                        }%). 😟\nHowever, you have still received Wumps Trivia Competitor in Wumpus Paradise!`
                    );
                    await client.guilds.cache
                        .get("801470504803893278")
                        .members.cache.get(interaction.member.id)
                        .roles.add(competitor);
                } else if (score === 4 || score === 5) {
                    await interaction.member.send(
                        `You completed Wumps Trivia with a score of ${score}/8 (${
                            (score / 8) * 100
                        }%). 😬\nHowever, you have still received Wumps Trivia Competitor in Wumpus Paradise!`
                    );
                    await client.guilds.cache
                        .get("801470504803893278")
                        .members.cache.get(interaction.member.id)
                        .roles.add(competitor);
                } else if (score > 5) {
                    await interaction.member.send(
                        `Congratulations, you completed Wumps Trivia with a score of ${score}/8 (${
                            (score / 8) * 100
                        }%)! 😮\nYou have received both Wumps Trivia Competitor and Wumps Trivia Winner in Wumpus Paradise! 🥳`
                    );
                    await client.guilds.cache
                        .get("801470504803893278")
                        .members.cache.get(interaction.member.id)
                        .roles.add(competitor);

                    await client.guilds.cache
                        .get("801470504803893278")
                        .members.cache.get(interaction.member.id)
                        .roles.add(winner); 
                }
              console.log(`${interaction.user.tag} scored ${score}/8 in Wumps Trivia!`) 
                target[key] = value;
                return true;
            },
        });

        collector.on("end", async () => {
            targetProxy.didItEnd = true;
        });
  } catch {
  return await interaction.editReply({
    embeds: [
      new Discord.MessageEmbed({
        title: "Error",
        description: "The bot cannot generate a trivia game for you as your DMs are off. Please enable them and try again. 😥",
        color: "#6e8bd3",
      }),
    ],
  })
};
    },
};
