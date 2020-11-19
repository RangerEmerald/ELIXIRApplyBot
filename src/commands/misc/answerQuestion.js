require('dotenv').config();
const authorDm = require('./sendAuthorDM.js');

async function aswQuestion(args, message, Discord, answerQuestionList){
    try{
        if(args[0] === "answerquestion"){
            if(!args[1]){
                message.delete();
                const reply = await message.reply(`That is not the format for answering a question! The command for answering a question is: \`elixir.answerquestion [questionID] [answer]\``)
                    .then(setTimeout(()=>reply.delete(), 20000));
            } else if(!isNaN(args[1])){
                const question = await message.channel.messages.fetch(args[1]);
                if(question){
                    const answer = message.content.slice(process.env.BOT_PREFIX.length).split(" ").splice(2).join(" ")
                    if(answer){
                        if(question.embeds[0].author !== null){
                            if(message.content.toLowerCase().startsWith(process.env.BOT_PREFIX) && answerQuestionList[message.author.id]) return;
                            answerQuestionList[message.author.id] = true;
                            let authorID = question.embeds[0].footer.text.slice(11);
                            const answerEmbed = new Discord.MessageEmbed()
                                .setTitle(`Question Sent by: ${question.embeds[0].author.name}\nQuestion ID: ${args[1]}`)
                                .setColor("BLUE")
                                .setDescription(`${question.embeds[0].description}\n**Answer:** ${answer} - Answered by ${message.author.tag}`)
                                .setTimestamp(message.createdAt);

                            message.delete();
                            const ask = await message.channel.send(`Are you sure you want to reply with: \`${answer}\`. Type \`yes\` to continue. Type \`no\` to stop.`);
                            const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 30000 });
                            collector.on('collect', async message => {
                                if(message.content.toLowerCase() === "yes"){
                                    collector.stop("yes");
                                    message.delete();
                                } else if(message.content.toLowerCase() === "no"){
                                    collector.stop("no");
                                    message.delete();
                                } else {
                                    message.delete();
                                    const reply = await message.reply("Please answer with only `yes` or `no`!")
                                        .then(setTimeout(() => reply.delete(), 20000));
                                }
                            });
                            collector.on('end', async (collected, reason) => {
                                if(reason === "yes"){
                                    question.edit(answerEmbed);
                                    authorDm.authorDM(authorID, message, Discord, answer, message.author.tag, question.embeds[0].description, args);
                                    const reply = await message.reply(`You have answered Question #${args[1]}`)
                                        .then(setTimeout(() => reply.delete(),20000));
                                } else {
                                    const stopMessage = await message.channel.send("Question answering stopped.")
                                        .then(setTimeout(() => stopMessage.delete(), 30000));
                                }
                                ask.delete();
                                delete answerQuestionList[message.author.id];
                            });
                        } else {
                            message.delete();
                            const reply = await message.reply(`The Question #${args[1]} was already reviewed`)
                                .then(setTimeout(() => reply.delete(), 10000));
                        }
                    } else {
                        message.delete();
                        const reply = await message.reply(`You did not have an answer to the question! The formot for answering a question is: \`elixir.answerquestion [questionID] [answer]\``)
                            .then(setTimeout(() => reply.delete(), 10000));
                    }             
                } else {
                    message.delete();
                    const reply = await message.reply(`I could not fetch Question #${args[1]}!`)
                        .then(setTimeout(() => reply.delete(), 10000));
                }
            } else {
                message.delete();
                const reply = await message.reply('The Queston ID should be a series of numbers!')
                    .then(setTimeout(() => reply.delete(), 10000));
            }
        } else {
            message.delete();
            const reply = await message.reply(`That is not a command! The command for answering a question is: \`elixir.answerquestion [questionID] [answer]\``)
                .then(setTimeout(() => reply.delete(), 20000));
        }
    } catch(err){
        console.log(err);
    }
}

module.exports = {aswQuestion};