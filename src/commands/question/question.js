require('dotenv').config();

let isQuestion = {};

async function askQuestion(message, args, Discord, client){
    try{
        if(args[0] === "question"){
            const questionChannel = client.channels.cache.get(process.env.QUESTION_CHANNEL);
            if(questionChannel){
                const question = message.content.slice(process.env.BOT_PREFIX.length + args[0].length);
                if(question){
                    if(message.content.toLowerCase().startsWith(process.env.BOT_PREFIX) && isQuestion[message.author.id]) return;
                    isQuestion[message.author.id] = true;
                    const qId = await questionChannel.send(`_ _`);

                    const embedQuestion = new Discord.MessageEmbed()
                        .setColor("PURPLE")
                        .setAuthor(message.author.tag)
                        .setTitle(`New Question Sent by ${message.author.tag}\nQuestion ID: ${qId.id}`)
                        .setDescription(`**Question:** ${question}`)
                        .addField(`Question Answered:`, `Question Pending Answering`, true)
                        .setFooter(`Author ID: ${message.author.id}`)
                        .setTimestamp(message.createdAt);

                    const ask = await message.channel.send(`Are you sure you want to ask: \`${question}\`. Type \`yes\` to continue. Type \`no\` to stop.`);
                    const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 30000 });
                    collector.on('collect', async message => {
                        if(message.content.toLowerCase() === "yes"){
                            collector.stop("yes");
                        } else if(message.content.toLowerCase() === "no"){
                            collector.stop("no");
                        } else {
                            const reply = await message.reply("Please reply with only `yes` or `no`!")
                                .then(setTimeout(() => reply.delete(), 20000));
                        }
                    });
                    collector.on('end', async (collected, reason) => {
                        if(reason === "yes"){
                            qId.edit(embedQuestion);
                            const reply = await message.channel.send("Your question has been recorded. Please wait for the officers or captain to answer your question")
                                .then(setTimeout(()=>reply.delete(), 20000));
                        } else {
                            const stopMessage = await message.channel.send("Question asking stopped.")
                                .then(setTimeout(() => stopMessage.delete(), 30000));
                            qId.delete();
                        }
                        ask.delete();
                        delete isQuestion[message.author.id];
                    });
                } else {
                    const reply = await message.channel.send("You need to provide a question to ask! The format for asking a question is: `elixir.question [question]`")
                        .then(setTimeout(()=>reply.delete(), 15000));
                }
            }
        } else {
            const reply = await message.channel.send("That is not a command! The only command you can do in dm's is `elixir.question`. The format for asking a question is: `elixir.question [question]`")
                .then(setTimeout(()=>reply.delete, 20000));
        }
    } catch(err){
        console.log(err);
    }
}

module.exports = {askQuestion};