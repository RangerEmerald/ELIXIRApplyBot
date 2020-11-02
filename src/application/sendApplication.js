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

async function reject(message, consoles){
    const warning = await consoles.send(`<@!${message.author.id}> tried to send: ${message.content}`)
        .then(setTimeout(() => {warning.delete();}, 60000));
    message.delete();
    const reply = await message.reply("elixir.apply [your nitrotype profile link] [nitrotype accuracy] [nitrotype wpm]` is the format! Make sure you follow it!")
        .then(setTimeout(()=>{reply.delete();}, 5000));
}

async function sendDelete(messages, message, time){
    message.delete();
    const reply = await message.reply(messages)
        .then(setTimeout(()=>{reply.delete();}, time));
}

async function sendapply(message, args, Discord){
    let consoles = message.guild.channels.cache.get(process.env.OFFICER_CHANNEL_ID);
    if(args[0] === "apply"){
        if(args[1]){
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
                                                    reject(message, consoles);
                                                }
                                            } else {
                                                reject(message, consoles);
                                            }
                                        } else {
                                            sendDelete("Make sure your WPM only consists of numbers! Do not add any extra characters at the end of your WPM!", message, 5000);
                                        }
                                    } else {
                                        sendDelete("Make sure you include your WPM! The format of the application is: `elixir.apply [your nitrotype profile link] [nitrotype accuracy] [nitrotype wpm]`!", message, 10000);
                                    }
                                } else {
                                    reject(message, consoles);
                                }
                            } else {
                                reject(message, consoles);
                            }
                        } else {
                            sendDelete("Make sure your accuracy only consists of numbers! Do not add any extra characters at the end of your accuracy!", message, 10000);
                        }
                    } else {
                        sendDelete("Make sure you include your accuracy! The format of the application is: `elixir.apply [your nitrotype profile link] [nitrotype accuracy] [nitrotype wpm]`!", message, 10000);
                    }
                } else {
                    sendDelete(`${args[1]} is not your nitrotype profile link! To get your NT profile, look to the top right and find the dropdown menu. Scroll over it, and tap my public profile. The URL at the top is what you should put in here.`, message, 10000);
                }
            } else {
                sendDelete(`${args[1]} is not a valid URL! To get your NT profile, look to the top right and find the dropdown menu. Scroll over it, and tap my public profile. The URL at the top is what you should put in here.`, message, 10000);
            }
        } else {
            sendDelete("Your application is not complete! Did you mean to do: `elixir.apply [your nitrotype profile link] [nitrotype accuracy] [nitrotype wpm]`?", message, 5000)
        }
    } else {
        sendDelete("That is not a command! Did you mean to do: `elixir.apply [your nitrotype profile link] [nitrotype accuracy] [nitrotype wpm]`?", message, 5000);
    }
}

module.exports = {sendapply};