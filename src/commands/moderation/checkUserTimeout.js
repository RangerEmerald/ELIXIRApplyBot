require('dotenv').config()

const {limitArray} = require('./timeout_limitcommand.js');

async function embedSend(user, message, Discord, role, role2, doneTime, consoles, args, date, doneTime){
    if(limitArray[user.user.id]){
        if(args[1] === "clear"){
            delete limitArray[user.user.id];
            message.reply(`You have remove all warnings from ${user.user.username}`);
            if(user.roles.cache.find(r => r.name === role2.name)){
                user.roles.add(role);
                user.roles.remove(role2);
            }
            const timeServe = new Discord.MessageEmbed()
                .setAuthor(user.user.tag, user.user.avatarURL())
                .setTitle(`Warnings Cleared`)
                .setColor("GREEN")
                .setFooter(`Author ID: ${user.user.id}`)
                .setTimestamp(message.createdAt);

            consoles.send(timeServe);
        } else {
            if(isNaN(limitArray[user.user.id].start)){
                doneTime = "N/A";
            } else {
                doneTime = `${Math.round(limitArray[user.user.id].time - (date.getTime() - limitArray[user.user.id].start)/1000)} seconds`
            }
            if(!isNaN(doneTime)){
                if(doneTime >= limitArray[user.user.id].time){
                    if(role && role2){
                        if(consoles){
                            const timeoutDone = new Discord.MessageEmbed()
                                .setAuthor(user.user.tag, user.user.avatarURL())
                                .setTitle(`Timeout Warning #${limitArray[user.user.id].brokenAmount} Time Served.`)
                                .setColor("GREEN")
                                .setFooter(`Author ID: ${user.user.id}`)
                                .setTimestamp(message.createdAt);
        
                            consoles.send(timeoutDone);
                        }
                        user.roles.add(role);
                        user.roles.remove(role2);
                        limitArray[message.author.id].start = "N/A";
                    }
                }
            }
            const timeoutEmbed = new Discord.MessageEmbed()
                .setAuthor(user.user.tag, user.user.avatarURL())
                .setTitle(`Warnings List`)
                .setColor("YELLOW")
                .setDescription(`**Current Command Errors:** ${limitArray[user.user.id].commands}\n **Warning Amounts:** ${limitArray[user.user.id].brokenAmount}\n **Time until out-of timeout:** ${doneTime}`)
                .setFooter(`Author ID: ${user.user.id}`)
                .setTimestamp(message.createdAt);

            message.channel.send(timeoutEmbed);
        }
    } else {
        message.reply(`${args[2]} does not have any warnings!`);
    }
}

async function checkTimeout(message, args, Discord){
    if(args[0] === "timeout"){
        if(!args[1]){
            message.delete();
            const reply = await message.reply('The format for timeout is: `elixir.timeout [clear/check] [user]`')
                .then(setTimeout(() => reply.delete(), 20000));
        } else if(args[1] === "clear" || args[1] === "check"){
            const date = new Date();
            const mentioned = message.mentions.members.first();
            const userId = message.guild.members.cache.find(user => user.id === args[2]);
            let role = message.guild.roles.cache.find(r => r.name.toLowerCase() === process.env.JUST_JOINED);
            let role2 = message.guild.roles.cache.find(r => r.name.toLowerCase() === process.env.TIMEOUT_ROLE);
            let consoles = message.guild.channels.cache.get(process.env.LOG_CHANNEL);
            let doneTime;
            if(mentioned){
                embedSend(mentioned, message, Discord, role, role2, doneTime, consoles, args, date, doneTime);
            } else if(userId){
                embedSend(userId, message, Discord, role, role2, doneTime, consoles, args, date, doneTime);
            } else {
                message.delete();
                const reply = await message.reply(`${args[2]} is not a user in this guild! I cannot find that user!`)
                   .then(setTimeout(() => reply.delete(), 20000));
            }
        } else {
            message.delete();
            const reply = await message.reply('The format for timeout is: `elixir.timeout [clear/check] [user]`')
                .then(setTimeout(() => reply.delete(), 20000));
        }
    }
}

module.exports = {checkTimeout};