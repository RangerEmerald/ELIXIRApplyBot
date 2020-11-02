const sendAuthorDM = require('./sendAuthorDM');

async function reviewapply(message, args, Discord, prefix){
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
                        if(application.embeds[0].author !== null){
                            let authorID = application.embeds[0].footer.text.slice(11);
                            const applicationEmbed = new Discord.MessageEmbed()
                                .setTitle(`Application Sent By: ${application.embeds[0].author.name}\nApplication ID: ${args[1]}`)
                                .setFooter(application.embeds[0].description)
                                .setTimestamp(application.embeds[0].timestamp);

                            const reason = message.content.slice(prefix.length).split(" ").splice(3).join(" ");

                            if(reason){
                                applicationEmbed.setDescription(`**Application ${accrejt}ed by <@!${message.author.id}>**\n**Reason:** ${reason}`);
                            } else {
                                applicationEmbed.setDescription(`**Application ${accrejt}ed by <@!${message.author.id}>**`);
                            }
                            let role = message.guild.roles.cache.find(r => r.name.toLowerCase() === process.env.APPLICATION_ROLE);
                            let author = message.guild.members.cache.get(authorID);
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
                            message.delete();
                            sendAuthorDM.senddm(authorID, accrejt, message.author.tag, message, args, Discord, reason);
                            const reply = await message.reply(`You have ${accrejt}ed Application #${args[1]}`)
                                .then(setTimeout(() => {reply.delete();}, 10000));
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