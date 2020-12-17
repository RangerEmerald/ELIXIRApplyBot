require('dotenv').config();
const sendAuthorDM = require('./sendAuthorDM');

const timeout = require('../moderation/timeout_limitcommand.js');

function validURL(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;  
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

async function sendDelete(messages, message, Discord){
    await message.delete();
    const reply = await message.reply(messages)
        .then(setTimeout(()=>{reply.delete();}, 10000));
    timeout.limitcommandusage(message, Discord);
}

async function sendapply(message, args, Discord, userApplyList, client){
    try{
        if(args[0] === "apply"){
            if(args[1]){
                if(validURL(args[1])){
                    let domainName = args[1].slice(12, 21);
                    if(domainName === "nitrotype"){
                        let end = args[1].slice(21, 25);
                        if(end === ".com"){
                            let seeRacer = args[1].slice(26, 32);
                            if(seeRacer === "racer/"){
                                if(args[2]){
                                    if(!isNaN(args[2])){
                                        if(args[3]){
                                            if(!isNaN(args[3])){
                                                if(userApplyList[message.author.id] && message.content.toLowerCase().startsWith(process.env.BOT_PREFIX)) return;
                                                userApplyList[message.author.id] = true;
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
                                                        let dmOpen = true;
                                                        let applicationSend = message.guild.channels.cache.get(process.env.APPLYSEND_CHANNEL_ID);

                                                        const whatYouSaid = new Discord.MessageEmbed()
                                                            .setColor("ORANGE")
                                                            .setTitle("What Your Application to Join ELIXIR Said")
                                                            .setDescription(`**Applicant Nitrotype Profile Link:** ${args[1]}\n**Applicant Accuracy:** ${args[2]}\n**Applicant WPM:** ${args[3]}`)
                                                            .setFooter(`Your application is waiting for one of the officers or captain to approve/reject. If there was an error in your application or have a question, please contact one of the online officers or captain via \`elixir.question [question]\` or directly dming them.`)
                                                            .setTimestamp(message.createdAt);

                                                        const dmSend = await message.guild.members.cache.get(author.id).send(whatYouSaid)
                                                            .catch(async() => {
                                                                const reply = await message.reply("Your application was not recorded since your dms are not open. Please open your dms and try again.").then(setTimeout(() => reply.delete(), 20000));
                                                            });
                                                        if(dmSend === undefined){
                                                            dmOpen = false;
                                                        }
                                                        if(dmOpen){
                                                            if(args[2] < 96 || args[3] < 60){
                                                                dmSend.delete();
                                                                const applyEmbed = new Discord.MessageEmbed()
                                                                    .setColor("RED")
                                                                    .setAuthor(author.user.tag, message.author.avatarURL())
                                                                    .setTitle(`Application Sent By: ${author.id}\nApplication ID: N/A Auto Reject`)
                                                                    .setTitle(`New Application Sent By: ${author.user.tag}\nApplication ID: N/A`)
                                                                    .addField(`Applicant Nitrotype Profile Link`, args[1], true)
                                                                    .addField(`Applicant Accuracy`, args[2], true)
                                                                    .addField(`Applicant WPM`, args[3], true)
                                                                    .setTimestamp(message.createdAt);

                                                                if(args[3] < 60 && args[2] < 96){
                                                                    applyEmbed.setDescription(`**Application rejected by the Auto Rejection System**\n**Reason:** Accuracy and WPM are too low. The minimun accuracy and WPM are in <#${process.env.INFORMATION_CHANNEL}> as with other information.`);
                                                                    sendAuthorDM.senddm(author.id, "reject", client.user.tag, message, applyEmbed);
                                                                } else if(args[3] < 60){
                                                                    applyEmbed.setDescription(`**Application rejected by the Auto Rejection System**\n**Reason:** WPM is too low. The minimun WPM is in <#${process.env.INFORMATION_CHANNEL}> as with other information.`);
                                                                    sendAuthorDM.senddm(author.id, "reject", client.user.tag, message, applyEmbed);
                                                                } else {
                                                                    applyEmbed.setDescription(`**Application rejected by the Auto Rejection System**\n**Reason:** Accuracy is too low. The minimun accuracy is in <#${process.env.INFORMATION_CHANNEL}> as with other information.`);
                                                                    sendAuthorDM.senddm(author.id, "reject", client.user.tag, message, applyEmbed);
                                                                } 
                                                                const reply = await message.reply(`Your application has been auto rejected. Please check your dms for more information. If you have any question, DM <@!${client.user.id}>. The format for asking a question is: \`elixir.question [question]\``)
                                                                    .then(setTimeout(() => reply.delete(), 60000));

                                                                let role = message.guild.roles.cache.find(r => r.name.toLowerCase() === process.env.JUST_JOINED);
                                                                let roler = message.guild.roles.cache.find(r => r.name.toLowerCase() === process.env.APPLICATION_REJECTED);
                                                                if(role && roler && author){
                                                                    author.roles.add(roler);
                                                                    author.roles.remove(role);
                                                                }
                                                                applicationSend.send(applyEmbed);
                                                            } else {
                                                                const appid = await applicationSend.send(`_ _`);
        
                                                                const secondEmbed = new Discord.MessageEmbed()
                                                                    .setColor("ORANGE")
                                                                    .setAuthor(author.user.tag, message.author.avatarURL())
                                                                    .setTitle(`New Application Sent By: ${author.user.tag}\nApplication ID: ${appid.id}`)
                                                                    .addField(`Applicant Nitrotype Profile Link`, args[1], true)
                                                                    .addField(`Applicant Accuracy`, args[2], true)
                                                                    .addField(`Applicant WPM`, args[3], true)
                                                                    .setDescription(`Application Pending Review`)
                                                                    .setFooter(`Author ID: ${author.id}`)
                                                                    .setTimestamp(message.createdAt);

                                                                appid.edit(secondEmbed);
                                                                const reply = await message.reply(`Your application has been recorded. Please be patient as the officers review your application. If you have any question, DM <@!${client.user.id}>. The format for asking a question is: \`elixir.question [question]\`. Brackets not required.`)
                                                                    .then(setTimeout(()=>{reply.delete();}, 60000));
                                                                let role2 = message.guild.roles.cache.find(r => r.name.toLowerCase() === process.env.JUST_JOINED);
                                                                let role = message.guild.roles.cache.find(r => r.name.toLowerCase() === process.env.APPLICATION_ROLE);
                                                                if(role) author.roles.add(role);
                                                                if(role2) author.roles.remove(role2);
                                                                else console.log(`Could not find ${process.env.APPLICATION_ROLE}`);
                                                            }
                                                        }
                                                    } else if(reason === "else" || reason === "time"){
                                                        const sendmessage = await message.channel.send("Application Stopped")
                                                            .then(setTimeout(() => {sendmessage.delete();}, 10000));
                                                    }
                                                    sendIsCorrect.delete();
                                                    delete userApplyList[author.id];
                                                });
                                            } else {
                                                sendDelete("Make sure your WPM only consists of numbers! Do not add any extra characters at the end of your WPM!", message, Discord);
                                            }
                                        } else {
                                            sendDelete("Make sure you include your WPM! The format of the application is: `elixir.apply [your nitrotype profile link] [nitrotype accuracy] [nitrotype wpm]`!", message, Discord);
                                        }
                                    } else {
                                        sendDelete("Make sure your accuracy only consists of numbers! Do not add any extra characters at the end of your accuracy!", message, Discord);
                                    }
                                } else {
                                    sendDelete("Make sure you include your accuracy! The format of the application is: `elixir.apply [your nitrotype profile link] [nitrotype accuracy] [nitrotype wpm]`!", message, Discord);
                                }
                            } else {
                                sendDelete(`${args[1]} is not your nitrotype profile link! To get your NT profile, look to the top right and find the dropdown menu. Scroll over it, and tap my public profile. The URL at the top is what you should put in here.`, message, Discord);
                            }
                        } else {
                            sendDelete(`${args[1]} is not nitrotype! To get your NT profile, go to https://www.nitrotype.com. look to the top right and find the dropdown menu. Scroll over it, and tap my public profile. The URL at the top is what you should put in here.`, message, Discord);
                        }
                    } else {
                        sendDelete(`${args[1]} is not nitrotype! To get your NT profile, go to https://www.nitrotype.com. look to the top right and find the dropdown menu. Scroll over it, and tap my public profile. The URL at the top is what you should put in here.`, message, Discord);
                    }
                } else {
                    sendDelete(`${args[1]} is not a valid URL! To get your NT profile, look to the top right and find the dropdown menu. Scroll over it, and tap my public profile. The URL at the top is what you should put in here.`, message, Discord);
                }
            } else {
                sendDelete("Your application is not complete! Did you mean to do: `elixir.apply [your nitrotype profile link] [nitrotype accuracy] [nitrotype wpm]`?", message, Discord);
            }
        } else {
            sendDelete("That is not a command! Did you mean to do: `elixir.apply [your nitrotype profile link] [nitrotype accuracy] [nitrotype wpm]`?", message, Discord);
        }
    } catch(err){
        console.log(err);
    }
}

module.exports = {sendapply};