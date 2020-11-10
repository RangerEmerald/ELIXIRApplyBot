require('dotenv').config();

async function askQuestion(message, args, Discord, client){
    try{
        if(args[0] === "question"){
            const questionChannel = client.channels.cache.get(process.env.QUESTION_CHANNEL);
            if(questionChannel){
                const question = message.content.slice(process.env.BOT_PREFIX.length + args[0].length);
                if(question){
                    const qId = await questionChannel.send(`_ _`);

                    const embedQuestion = new Discord.MessageEmbed()
                        .setColor("PURPLE")
                        .setAuthor(message.author.tag)
                        .setTitle(`New Question Sent by ${message.author.tag}\nQuestion ID: ${qId.id}`)
                        .setDescription(`**Question:** ${question}`)
                        .addField(`Question Answered:`, `Question Pending Answering`, true)
                        .setFooter(`Author ID: ${message.author.id}`)
                        .setTimestamp(message.createdAt);

                    qId.edit(embedQuestion);
                    const reply = await message.channel.send("Your question has been recorded. Please wait for the officers or captain to answer your question")
                        .then(setTimeout(()=>reply.delete(), 20000));
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