require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client({partials:["MESSAGE"]});

const sendApplication = require('./commands/application/sendApplication.js');
const reviewApplication = require('./commands/application/reviewApplication.js');

const question = require('./commands/question/question.js');
const answerQuestion = require('./commands/question/answerQuestion.js');

const timeout = require('./commands/moderation/timeout_limitcommand.js');
const checkUser = require('./commands/moderation/checkUserTimeout.js');

const prefix = process.env.BOT_PREFIX;

let userApplyList = {};
let answerQuestionList = {};
let revApplicationList = {};

const clientActivity = ['For someone to apply', 'For the prefix: elixir.'];
let clientActivityNumber = 0;

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in`);
    client.user.setActivity(`For someone to apply`, { type: "WATCHING"})
        .then(setInterval(() => {
            if(clientActivityNumber === 0){
                clientActivityNumber = 1;
                client.user.setActivity(clientActivity[clientActivityNumber], { type: "WATCHING" });
            } else if(clientActivityNumber === 1){
                clientActivityNumber = 0;
                client.user.setActivity(clientActivity[clientActivityNumber], { type: "WATCHING" });
            }
        }, 5000));
});

client.on('message', async message => {
    try{
        if(message.author.bot) return;
        let args = message.content.toLowerCase().slice(prefix.length).split(" ");
        if(message.channel.id === process.env.APPLY_CHANNEL_ID){
            if(message.content.toLowerCase().startsWith(prefix)){
                sendApplication.sendapply(message, args, Discord, userApplyList, client);
            } else if(message.member.roles.cache.find(r => r.name.toLowerCase() === "officer") || message.member.roles.cache.find(r => r.name.toLowerCase() === "captain")) return;
            else if(!userApplyList[message.author.id]){
                await message.delete();
                const reply = await message.reply("Please do not talk here! To apply, do `elixir.apply [your nitrotype profile link] [nitrotype accuracy] [nitrotype wpm]`!")
                    .then(setTimeout(()=>{reply.delete();}, 5000))
                timeout.limitcommandusage(message, Discord);
            }
        } else if(message.content.toLowerCase().startsWith(prefix)){ 
            if(message.channel.id === process.env.APPLYSEND_CHANNEL_ID){
                reviewApplication.reviewapply(message, args, Discord, prefix, revApplicationList);
            } else if(message.channel.id === process.env.BOT_CHANNEL){
                checkUser.checkTimeout(message, args, Discord);
            } else if(message.channel.id === process.env.QUESTION_CHANNEL){
                answerQuestion.aswQuestion(args, message, Discord, answerQuestionList);
            } else if(message.channel.type === "dm"){
                question.askQuestion(message, args, Discord, client);
            }
        } else if((message.channel.id === process.env.APPLYSEND_CHANNEL_ID || message.channel.id === process.env.QUESTION_CHANNEL) && !answerQuestionList[message.author.id] && !revApplicationList[message.author.id]){
            message.delete();
            const reply = await message.reply(`Please do not talk here! This is only for accepting or rejecting applications or answering question! Go to <#${process.env.OFFICER_CHANNEL_ID}> for discussions!`)
                .then(setTimeout(() => reply.delete(), 20000))
                .catch(console.log("Unknon message"));
        }
    } catch(err) {
        console.log(err);
    }
});

// client.on('messageDelete', async message => {
//     try{
//         if(message.channel.id === process.env.APPLY_CHANNEL_ID){
//             if(!message.partial){
//                 let consoles = message.guild.channels.cache.get(process.env.LOG_CHANNEL);
//                 if(!consoles) return;
//                 if(message.author.bot) return;
//                 let consoleEmbed = new Discord.MessageEmbed()
//                     .setColor("#ffa500")
//                     .setAuthor(message.member.user.tag)
//                     .setDescription(`**Message sent by <@!${message.author.id}> was deleted in <#${message.channel.id}>**\n${message.content}`)
//                     .setFooter(`Author ID: ${message.author.id} | Message ID: ${message.author.id}`)
//                     .setTimestamp(message.createdAt);

//                 consoles.send(consoleEmbed);
//             }
//         }
//     } catch(err){
//         console.log(err)    
//     }
// });

client.on('guildMemberAdd', async member => {
    try{
        let role = member.guild.roles.cache.find(r => r.name.toLowerCase() === process.env.JUST_JOINED);
        if(role){
            member.roles.add(role);
        }
    } catch(err) {
        console.log(err);
    }
});

client.login(process.env.BOT_TOKEN);