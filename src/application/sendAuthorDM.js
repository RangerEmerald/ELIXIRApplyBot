require('dotenv').config();

async function senddm(authorID, accrejt, sender, message){
    let consoles = message.guild.channels.cache.get(process.env.OFFICER_CHANNEL_ID);
    message.guild.members.cache.get(`${authorID}`).send(`Your application to join the ELIXIR Nitro Type team was ${accrejt}ed by ${sender}.`)
        .catch((err) => {
            consoles.send(`I could not DM <@!${authorID}> to inform them that their application to join the ELIXIR Nitro Type team was ${accrejt}ed by ${sender}. Please inform <@!${authorID}> that their application was ${accrejt}ed.`);
            console.log(err);
        });
}

module.exports = {senddm};