require('dotenv').config();
const fs = require('fs');

let limitArray = {};

async function limitcommandusage(message, Discord){
    let date = new Date();
    if(!limitArray[message.author.id]){
        limitArray[message.author.id] = {"commands": 0, "brokenAmount": 0, "time": 30, "start": 'N/A'};
    }
    limitArray[message.author.id].commands++;
    if(limitArray[message.author.id].commands >= 5){
        limitArray[message.author.id].brokenAmount++;
        let role = message.guild.roles.cache.find(r => r.name.toLowerCase() === process.env.JUST_JOINED);
        let role2 = message.guild.roles.cache.find(r => r.name.toLowerCase() === process.env.TIMEOUT_ROLE);
        let consoles = message.guild.channels.cache.get(process.env.LOG_CHANNEL);
        if(role && role2 && message.member){
            limitArray[message.author.id].start = date.getTime();
            message.member.roles.add(role2);
            message.member.roles.remove(role)
            .then(setTimeout(() => {
                if(limitArray[message.author.id]){
                    if(consoles){
                        const timeoutDone = new Discord.MessageEmbed()
                            .setAuthor(message.member.user.tag, message.author.avatarURL())
                            .setTitle(`Timeout Warning #${limitArray[message.author.id].brokenAmount} Time Served.`)
                            .setColor("GREEN")
                            .setFooter(`Author ID: ${message.author.id}`)
                            .setTimestamp(message.createdAt);

                        consoles.send(timeoutDone);
                    }
                    message.member.roles.add(role);
                    message.member.roles.remove(role2);
                    limitArray[message.author.id].start = "N/A";
                    limitArray[message.author.id].time*=2;
                }
            }, limitArray[message.author.id].time*1000));
        }
        if(consoles){
            const timeoutEmbed = new Discord.MessageEmbed()
                .setAuthor(message.member.user.tag, message.author.avatarURL())
                .setTitle(`Timeout: Command Usage Failure. Time: ${limitArray[message.author.id].time} Seconds. Warning #${limitArray[message.author.id].brokenAmount}`)
                .setColor("RED")
                .setFooter(`Author ID: ${message.author.id}`)
                .setTimestamp(message.createdAt);
                
            consoles.send(timeoutEmbed);
        }
        const reply = await message.reply(`The failure of sending an application to ELIXIR ${limitArray[message.author.id].commands} times has resulted in you being temp muted. This is you ${limitArray[message.author.id].brokenAmount} warning. Try again in ${limitArray[message.author.id].time} seconds.`)
            .then(setTimeout(() => reply.delete(), 20000));
        limitArray[message.author.id].commands = 0;
    }
}

module.exports = {limitcommandusage, limitArray};