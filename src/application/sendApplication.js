require('dotenv').config();

function validURL(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;  
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

async function sendapply(message, args, Discord){
    if(args[0] === "apply"){
        if(validURL(args[1])){
            let seeRacer = args[1].slice(26, 32);
            if(seeRacer === "racer/"){
                if(args[2]){
                    if(!isNaN(args[2])){
                        if(args[2] <= 99){
                            if(args[2] >= 96){
                                if(args[3]){
                                    if(!isNaN(args[3])){
                                        if(args[3] <= 180){
                                            if(args[3] >= 60){
                                                message.delete();
                                                let applicationSend = message.guild.channels.cache.get(process.env.APPLYSEND_CHANNEL_ID);

                                                const appid = await applicationSend.send(`_ _`);

                                                const secondEmbed = new Discord.MessageEmbed()
                                                    .setColor("RED")
                                                    .setAuthor(message.author.tag)
                                                    .setTitle(`New Application Sent By: ${message.author.tag}\nApplication ID: ${appid.id}`)
                                                    .setDescription(`**Applicant Nitrotype Profile Link:** ${args[1]}\n**Applicant Accuracy:** ${args[2]}\n**Applicant WPM:** ${args[3]}`)
                                                    .addField(`Is Application Accepted:`, `Application Pending Review`, true)
                                                    .setFooter(`Author ID: ${message.author.id}`)
                                                    .setTimestamp(message.createdAt);

                                                appid.edit(secondEmbed);
                                                const reply = await message.reply("Your application has been recorded. Please be patiant as the officers review your application. Make sure that the format of your application was: `[your nitrotype profile link] [accuracy] [wpm]`. If you made an error in your application, dm one of the online officers. Also, make sure that your DMs are open so that you can be informed when your application has been accpeted or rejected.")
                                                    .then(setTimeout(()=>{reply.delete();}, 60000));
                                            } else {
                                                message.delete();
                                                const reply = await message.reply("Your WPM is too low! Make sure that the number after you accuracy is your WPM!")
                                                    .then(setTimeout(()=>{reply.delete();}, 5000));
                                            }
                                        } else {
                                            message.delete();
                                            const reply = await message.reply("Your WPM is too high! Make sure that the number after your accuracy is your WPM!")
                                                .then(setTimeout(()=>{reply.delete();}, 5000));
                                        }
                                    } else {
                                        message.delete();
                                        const reply = await message.reply("Make sure your WPM only consists of numbers!")
                                            .then(setTimeout(()=>{reply.delete();}, 5000));
                                    }
                                } else {
                                    const reply = await message.reply("Make sure you include your WPM!")
                                        .then(setTimeout(()=>{reply.delete();}, 5000));
                                }
                            } else {
                                message.delete();
                                const reply = await message.reply("Your accuracy is too low! Make sure that the number next to your profile link is your accuracy!")
                                .then(setTimeout(()=>{reply.delete();}, 5000));
                            }
                        } else {
                            message.delete();
                            const reply = await message.reply("That accuracy is not possible! Make sure that the number next to your profile link is your accuracy!")
                                .then(setTimeout(()=>{reply.delete();}, 5000));
                        }
                    } else {
                        message.delete();
                        const reply = await message.reply("Make sure your accuracy only consists of numbers!")
                            .then(setTimeout(()=>{reply.delete();}, 5000));
                    }
                } else {
                    message.delete();
                    const reply = await message.reply("Make sure you include your accuracy!")
                        .then(setTimeout(()=>{reply.delete();}, 5000));
                }
            } else {
                message.delete();
                const reply = await message.reply(`${args[1]} is not your nitrotype profile link! To get your NT profile, look to the top right and find the dropdown menu. Scroll over it, and tap my public profile. The URL at the top is what you should put in here.`)
                    .then(setTimeout(()=>{reply.delete();}, 10000));
            }
        } else {
            message.delete();
            const reply = await message.reply(`${args[1]} is not a valid URL! To get your NT profile, look to the top right and find the dropdown menu. Scroll over it, and tap my public profile. The URL at the top is what you should put in here.`)
                .then(setTimeout(()=>{reply.delete();}, 10000));
        }
    } else {
        message.delete();
        const reply = await message.reply("That is not a command! Did you ment to do: `elixir.apply [your nitrotype profile link] [nitrotype accuracy] [nitrotype wpm]`!")
            .then(setTimeout(()=>{reply.delete();}, 5000));
    }
}

module.exports = {sendapply};