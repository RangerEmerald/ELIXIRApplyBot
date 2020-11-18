require('dotenv').config();

async function senddm(authorID, accrejt, sender, message, embed){
    let consoles = message.guild.channels.cache.get(process.env.OFFICER_CHANNEL_ID);
    embed.setFooter(`If there is an error, please contact the officers or captain via elixir.question [question]`)

    message.guild.members.cache.get(`${authorID}`).send(embed)
        .catch((err) => {
            consoles.send(`I could not DM <@!${authorID}> to inform them that their application to join the ELIXIR Nitro Type team was ${accrejt}ed by ${sender}. Please inform <@!${authorID}> that their application was ${accrejt}ed.`);
            console.log(err);
        });
}

module.exports = {senddm};