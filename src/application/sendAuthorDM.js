require('dotenv').config();

async function senddm(authorID, accrejt, sender, message, args, Discord){
    let consoles = message.guild.channels.cache.get(process.env.OFFICER_CHANNEL_ID);

    const dmEmbed = new Discord.MessageEmbed()
        .setTitle(`Your application to join ELIXIR was ${accrejt}ed by ${sender}`)
        .setFooter(`Application ID: ${args[1]}`)
        .setTimestamp(message.createdAt);

    if(accrejt === "accept"){
        dmEmbed.setColor("GREEN");
    } else {
        dmEmbed.setColor("RED");
    }

    if(args[3]){
        dmEmbed.setDescription(`**Reason:** ${args[3]}`);
    } else {
        dmEmbed.setDescription(`**Reason:** None`);
    }

    message.guild.members.cache.get(`${authorID}`).send(dmEmbed)
        .catch((err) => {
            consoles.send(`I could not DM <@!${authorID}> to inform them that their application to join the ELIXIR Nitro Type team was ${accrejt}ed by ${sender}. Please inform <@!${authorID}> that their application was ${accrejt}ed.`);
            console.log(err);
        });
}

module.exports = {senddm};