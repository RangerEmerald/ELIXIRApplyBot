const sendAuthorDM = require('./sendAuthorDM');

async function reviewapply(message, args, Discord, prefix, revApplicationList){
    try{
        if(args[0] === "application"){
            if(!args[1]){
                message.delete();
                const reply = await message.reply("The format for accepting an application is: `elixir.application [application id] [accept/reject] [reason(optional)]`")
                    .then(setTimeout(() => {reply.delete();}, 10000));
            } else if(!isNaN(args[1])){     
                const application = await message.channel.messages.fetch(args[1]);
                if(application){
                    let accrejt = args[2];
                    if((accrejt !== "accept") && (accrejt !== "reject")){
                        message.delete();
                        const reply = await message.reply("The format for accepting an application is: `elixir.application [applicatoin id] [accept/reject] [reason(optional)]`")
                            .then(setTimeout(() => {reply.delete();}, 10000));
                    } else {
                        if(application.embeds[0].color === 15105570){
                            if(message.content.toLowerCase().startsWith(prefix) && revApplicationList[message.author.id]) return;
                            revApplicationList[message.author.id] = true;
                            let authorID = application.embeds[0].footer.text.slice(11);
                            let author = message.guild.members.cache.get(authorID);
                            const applicationEmbed = new Discord.MessageEmbed()
                                .setAuthor(author.user.tag, author.user.avatarURL())
                                .setTitle(`Application Sent By: ${application.embeds[0].author.name}\nApplication ID: ${args[1]}`)
                                .addField(application.embeds[0].fields[0].name, application.embeds[0].fields[0].value, true)
                                .addField(application.embeds[0].fields[1].name, application.embeds[0].fields[1].value, true)
                                .addField(application.embeds[0].fields[2].name, application.embeds[0].fields[2].value, true)
                                .setFooter(application.embeds[0].footer.text)
                                .setTimestamp(application.embeds[0].timestamp);

                            const reason = message.content.slice(prefix.length).split(" ").splice(3).join(" ");

                            if(reason){
                                applicationEmbed.setDescription(`**Application ${accrejt}ed by <@!${message.author.id}>**\n**Reason:** ${reason}`);
                            } else {
                                applicationEmbed.setDescription(`**Application ${accrejt}ed by <@!${message.author.id}>**`);
                            }
                            message.delete();
                            const askQuestion = await message.reply(`Are you sue you want to ${accrejt} the application sent by ${author.user.tag} at application ${args[1]} because \`${reason}\`? Type \`yes\` to continue. Type \`no\` to stop.`);
                            const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 30000 });
                            collector.on('collect', async message => {
                                if(message.content.toLowerCase() === "yes"){
                                    message.delete();
                                    collector.stop("yes");
                                } else if(message.content.toLowerCase() === "no"){
                                    message.delete();
                                    collector.stop("no");
                                } else {
                                    message.delete();
                                    const reply = await message.reply("Please choose either `yes` or `no`!")
                                        .then(setTimeout(() => reply.delete(), 20000));
                                }
                            });
                            collector.on('end', async (collected, reason) => {
                                if(reason === "yes"){
                                    let role = message.guild.roles.cache.find(r => r.name.toLowerCase() === process.env.APPLICATION_ROLE);
                                    if(accrejt === "accept"){
                                        let rolea = message.guild.roles.cache.find(r => r.name.toLowerCase() === process.env.APPLICATION_APPROVED);
                                        if(role && rolea && author){
                                            author.roles.remove(role);
                                            author.roles.add(rolea);
                                        }
                                        applicationEmbed.setColor("GREEN");
                                    } else {
                                        let roler = message.guild.roles.cache.find(r => r.name.toLowerCase() === process.env.APPLICATION_REJECTED);
                                        if(role && roler && author){
                                            author.roles.remove(role);
                                            author.roles.add(roler);
                                        }
                                        applicationEmbed.setColor("RED");
                                    }

                                    application.edit(applicationEmbed);
                                    sendAuthorDM.senddm(authorID, accrejt, message.author.tag, message, applicationEmbed);
                                    const reply = await message.reply(`You have ${accrejt}ed Application #${args[1]}`)
                                        .then(setTimeout(() => {reply.delete();}, 10000));
                                } else {
                                    const ended = await message.channel.send(`Application ${accrejt}ion stopped`)
                                        .then(setTimeout(() => ended.delete(), 20000));
                                }
                                askQuestion.delete();
                                delete revApplicationList[message.author.id];
                            });
                        } else {
                            message.delete();
                            const reply = await message.reply(`The application #${args[1]} was already reviewed`)
                                .then(setTimeout(() => {reply.delete();}, 10000));
                        }
                    }
                } else {
                    message.delete();
                    const reply = await message.reply("I could not fetch that application!")
                        .then(setTimeout(() => {reply.delete();}, 10000));
                }
            } else {
                message.delete();
                const reply = await message.reply('The Applicatoin ID should be a series of numbers!')
                    .then(setTimeout(() => {reply.delete();}, 10000));
            }
        } else {
            message.delete();
            const reply = await message.reply("The format for accepting an application is: `elixir.application [applicatoin id] [accept/reject] [reason(optional)]`")
                .then(setTimeout(() => {reply.delete();}, 10000));
        }
    } catch(err){
        console.log(err);
    }
}

module.exports = {reviewapply};