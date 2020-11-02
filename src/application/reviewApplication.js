const sendAuthorDM = require('./sendAuthorDM');

async function reviewapply(message, args, Discord){
    if(args[0] === "application"){
        if(!args[1]){
            message.delete();
            const reply = await message.reply("The format for accepting an application is: `elixir.application [application id] [accept/reject]`")
                .then(setTimeout(() => {reply.delete();}, 10000));
        } else if(!isNaN(args[1])){
            const application = await message.channel.messages.fetch(args[1]);
            if(application){
                let accrejt = args[2];
                if((accrejt !== "accept") && (accrejt !== "reject")){
                    message.delete();
                    const reply = await message.reply("The format for accepting an application is: `elixir.application [applicatoin id] [accept/reject]`")
                        .then(setTimeout(() => {reply.delete();}, 10000));
                } else {
                    if(application.embeds[0].author !== null){
                        let authorID = application.embeds[0].footer.text.slice(11);
                        const applicationEmbed = new Discord.MessageEmbed()
                            .setColor("GREEN")
                            .setTitle(`Application Sent By: ${application.embeds[0].author.name}\nApplication ID: ${args[1]}`)
                            .setDescription(`**Application ${accrejt}ed by <@!${message.author.id}>**`)
                            .setFooter(application.embeds[0].description)
                            .setTimestamp(application.embeds[0].timestamp);

                        application.edit(applicationEmbed);
                        message.delete();
                        sendAuthorDM.senddm(authorID, accrejt, message.author.tag, message);
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
        const reply = await message.reply("The format for accepting an application is: `elixir.application [applicatoin id] [accept/reject]`")
            .then(setTimeout(() => {reply.delete();}, 10000));
    }
}

module.exports = {reviewapply};