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

async function sendDelete(messages, message){
    message.delete();
    const reply = await message.reply(messages)
        .then(setTimeout(()=>{reply.delete();}, 10000));
}

async function sendapply(message, args, Discord){
    try{
        if(args[0] === "apply"){
            if(args[1]){
                if(validURL(args[1])){
                    let seeRacer = args[1].slice(26, 32);
                    if(seeRacer === "racer/"){
                        if(args[2]){
                            if(!isNaN(args[2])){
                                if(args[3]){
                                    if(!isNaN(args[3])){
                                        message.delete();
                                        const isCorrectEmbed = new Discord.MessageEmbed()
                                            .setColor("ORANGE")
                                            .setTitle("Is this information correct? Type `yes` if it is; If not, type `no`")
                                            .setDescription(`**Applicant Nitrotype Profile Link:** ${args[1]}\n**Applicant Accuracy:** ${args[2]}\n**Applicant WPM:** ${args[3]}`)
                                            .setFooter(`Author ID: ${message.author.id}`)
                                            .setTimestamp(message.createdAt);

                                        const sendIsCorrect = await message.channel.send(isCorrectEmbed);
                                        const author = message.member;
                                        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 30000 });
                                        collector.on('collect', async message => {
                                            if(message.content.toLowerCase() === "yes"){
                                                message.delete();
                                                collector.stop("yes");
                                            } else if(message.content.toLowerCase() === "no"){
                                                message.delete();
                                                collector.stop("else");
                                            } else {
                                                message.delete();
                                                const reply = await message.reply("You most choose either `yes` or `no`!")
                                                    .then(setTimeout(() => {reply.delete();}, 5000));
                                            }
                                        });
                                        collector.on('end', async (collected, reason) => {
                                            if(reason === "yes"){
                                                let applicationSend = message.guild.channels.cache.get(process.env.APPLYSEND_CHANNEL_ID);

                                                const appid = await applicationSend.send(`_ _`);

                                                const secondEmbed = new Discord.MessageEmbed()
                                                    .setColor("ORANGE")
                                                    .setAuthor(message.author.tag)
                                                    .setTitle(`New Application Sent By: ${message.author.tag}\nApplication ID: ${appid.id}`)
                                                    .setDescription(`**Applicant Nitrotype Profile Link:** ${args[1]}\n**Applicant Accuracy:** ${args[2]}\n**Applicant WPM:** ${args[3]}`)
                                                    .addField(`Is Application Accepted:`, `Application Pending Review`, true)
                                                    .setFooter(`Author ID: ${message.author.id}`)
                                                    .setTimestamp(message.createdAt);

                                                const whatYouSaid = new Discord.MessageEmbed()
                                                    .setColor("ORANGE")
                                                    .setTitle("What Your Application to Join ELIXIR Said")
                                                    .setDescription(`**Applicant Nitrotype Profile Link:** ${args[1]}\n**Applicant Accuracy:** ${args[2]}\n**Applicant WPM:** ${args[3]}`)
                                                    .setFooter(`Your application is waiting for one of the officers or captain to approve/reject. If there was an error in your application, please contact one of the online officers or captain`)
                                                    .setTimestamp(message.createdAt);

                                                appid.edit(secondEmbed);
                                                const reply = await message.reply("Your application has been recorded. Please be patient as the officers review your application. Make sure that your DMs are open so that you can be informed when your application has been accpeted or rejected.")
                                                    .then(setTimeout(()=>{reply.delete();}, 60000));
                                                let role2 = message.guild.roles.cache.find(r => r.name.toLowerCase() === process.env.JUST_JOINED);
                                                let role = message.guild.roles.cache.find(r => r.name.toLowerCase() === process.env.APPLICATION_ROLE);
                                                if(role) author.roles.add(role);
                                                if(role2 && author.roles.cache.some(r => r.name.toLowerCase() === process.env.APPLICATION_ROLE)) author.roles.remove(role2);
                                                else console.log(`Could not find ${process.env.APPLICATION_ROLE}`);
                                                message.guild.members.cache.get(author.id).send(whatYouSaid)
                                                    .catch((err) => {applicationSend.send(`<@!${author.id}> does not have their dm's open! Please inform them to open their dms!`);});
                                            } else {
                                                const sendmessage = await message.channel.send("Application Stopped")
                                                    .then(setTimeout(() => {sendmessage.delete();}, 10000));
                                            }
                                            sendIsCorrect.delete();
                                        });
                                    } else {
                                        sendDelete("Make sure your WPM only consists of numbers! Do not add any extra characters at the end of your WPM!", message);
                                    }
                                } else {
                                    sendDelete("Make sure you include your WPM! The format of the application is: `elixir.apply [your nitrotype profile link] [nitrotype accuracy] [nitrotype wpm]`!", message);
                                }
                            } else {
                                sendDelete("Make sure your accuracy only consists of numbers! Do not add any extra characters at the end of your accuracy!", message);
                            }
                        } else {
                            sendDelete("Make sure you include your accuracy! The format of the application is: `elixir.apply [your nitrotype profile link] [nitrotype accuracy] [nitrotype wpm]`!", message);
                        }
                    } else {
                        sendDelete(`${args[1]} is not your nitrotype profile link! To get your NT profile, look to the top right and find the dropdown menu. Scroll over it, and tap my public profile. The URL at the top is what you should put in here.`, message);
                    }
                } else {
                    sendDelete(`${args[1]} is not a valid URL! To get your NT profile, look to the top right and find the dropdown menu. Scroll over it, and tap my public profile. The URL at the top is what you should put in here.`, message);
                }
            } else {
                sendDelete("Your application is not complete! Did you mean to do: `elixir.apply [your nitrotype profile link] [nitrotype accuracy] [nitrotype wpm]`?", message);
            }
        } else {
            sendDelete("That is not a command! Did you mean to do: `elixir.apply [your nitrotype profile link] [nitrotype accuracy] [nitrotype wpm]`?", message);
        }
    } catch(err){
        console.log(err);
    }
}

module.exports = {sendapply};