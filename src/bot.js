require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client({partials:["MESSAGE"]});

const sendApplication = require('./application/sendApplication.js');
const reviewApplication = require('./application/reviewApplication.js');

const prefix = process.env.BOT_PREFIX;


client.on('ready', () => {
    console.log(`${client.user.tag} has logged in`);
    client.user.setActivity(`For someone to apply`, { type: "WATCHING"});
});

client.on('message', async message => {
    try{
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;
        let args = message.content.toLowerCase().slice(prefix.length).split(" ");
        if(message.channel.id === process.env.APPLY_CHANNEL_ID){
            if(message.content.toLowerCase().startsWith(prefix)){
                sendApplication.sendapply(message, args, Discord);
                return;
            } else {
                message.delete();
                const reply = await message.reply("Please do not talk here! To apply, do `elixir.apply [your nitrotype profile link] [nitrotype accuracy] [nitrotype wpm]`!")
                    .then(setTimeout(()=>{reply.delete();}, 5000))
            }
        } else if(message.channel.id === process.env.APPLYSEND_CHANNEL_ID){
            if(message.content.toLowerCase().startsWith(prefix)){
                reviewApplication.reviewapply(message, args, Discord);
            }
        }
    } catch(err) {
        console.log(err);
    }
});

client.on('messageDelete', async message => {
    try{
        if(message.channel.id === process.env.APPLY_CHANNEL_ID){
            if(!message.partial){
                let consoles = message.guild.channels.cache.get(process.env.LOG_CHANNEL);
                if(!consoles) return;
                if(message.author.bot) return;
                let consoleEmbed = new Discord.MessageEmbed()
                    .setColor("#ffa500")
                    .setAuthor(message.member.user.tag)
                    .setDescription(`**Message sent by <@!${message.author.id}> was deleted in <#${message.channel.id}>**\n${message.content}`)
                    .setFooter(`Author ID: ${message.author.id} | Message ID: ${message.author.id}`)
                    .setTimestamp(message.createdAt);

                consoles.send(consoleEmbed);
            }
        }
    } catch(err){
        console.log(err)    
    }
});

client.login(process.env.BOT_TOKEN);