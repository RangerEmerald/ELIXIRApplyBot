require('dotenv').config()

const {limitArray} = require('./timeout_limitcommand.js');

async function addNumberTimeout(args, user, message){
    if(!limitArray[user.user.id]){
        limitArray[user.user.id] = {"commands": 0, "brokenamount": 0, "time": 30, "start": 'N/A'};
    }
    limitArray[user.user.id][args[3]] += Number(args[4]);
    while(args[3] === "commands" && limitArray[user.user.id][args[3]] >= 5){
        limitArray[user.user.id].commands -= 5;
        limitArray[user.user.id].brokenamount++;
        limitArray[user.user.id].time*=2;
    }
    if(args[3] === "brokenamount"){
        limitArray[user.user.id].time*=2**Number(args[4]);
    }
    if(limitArray[user.user.id].time > (2**31-1)/1000){
        limitArray[user.user.id].time = (2**31-1)/1000;
        message.channel.send("The timeout timer has been set to (2**31-1)/1000");
    }
    message.channel.send(`You have added ${args[4]} to ${args[3]} of user ${user.user.tag}`);
}

async function embedSend(user, message, Discord, role, role2, doneTime, consoles, args, date, doneTime){
    if(args[1] === "add"){
        if(!isNaN(args[4])){
            if(args[3] === "commands" || args[3] === "brokenamount"){
                addNumberTimeout(args, user, message);
            } else {
                message.channel.send(`${args[3]} is not either\`commands\` or \`brokenamount\`!`);
            }
        } else {
            message.channel.send(`${args[4]} is not a number!`);
        }
    } else if(limitArray[user.user.id]){
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
        } else if(args[1] === "check"){
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
                                .setTitle(`Timeout Warning #${limitArray[user.user.id].brokenamount} Time Served.`)
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
                .setDescription(`**Current Command Errors:** ${limitArray[user.user.id].commands}\n **Warning Amounts:** ${limitArray[user.user.id].brokenamount}\n **Time until out-of timeout:** ${doneTime}`)
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
            const reply = await message.reply('The format for timeout is: `elixir.timeout [clear/check] [user] [commands/brokenamount(only for clear and option)] [number(only for clear and optional)]` or `elixir.timeout add [user] [commands/brokenamount] [number]`')
                .then(setTimeout(() => reply.delete(), 20000));
        } else if(args[1] === "clear" || args[1] === "check" || args[1] === "add"){
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
                message.reply(`${args[2]} is not a user in this guild! I cannot find that user!`);
            }
        } else {
            message.delete();
            message.reply('The format for timeout is: `elixir.timeout [clear/check] [user] [commands/brokenamount(only for clear and option)] [number(only for clear and optional)]` or `elixir.timeout add [user] [commands/brokenamount] [number]`');
        }
    }
}

module.exports = {checkTimeout};