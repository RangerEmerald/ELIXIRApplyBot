require('dotenv').config();

async function authorDM(authorID, message, Discord, answer, answerTag, question, args){
    let consoles = message.guild.channels.cache.get(process.env.OFFICER_CHANNEL_ID);

    const answerEmbed = new Discord.MessageEmbed()
        .setTitle(`Your Question Was Answered by ${answerTag}`)
        .setColor("BLUE")
        .setDescription(`${question}\n**Answer:** ${answer}`)
        .setFooter(`Question ID: ${args[1]}`)
        .setTimestamp(message.createdAt);

    message.guild.members.cache.get(`${authorID}`).send(answerEmbed)
        .catch((err) => {
            consoles.send(`I could not DM <@!${authorID}> to tell them the answer to their question! Please inform them to open their DMs!`);
            console.log(err);
        });
}

module.exports = {authorDM};