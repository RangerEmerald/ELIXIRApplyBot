function msToHMS (ms) {
    // 1- Convert to seconds:
    var seconds = ms / 1000;
    // 2- Extract hours:
    var hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
    seconds = seconds % 3600; // seconds remaining after extracting hours
    // 3- Extract minutes:
    var minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute
    // 4- Keep only seconds not extracted to minutes:
    seconds = seconds % 60;
    return hours+":"+minutes+":"+seconds;
}

async function runprocess (message, processID, args, startingTime, client) {
    if (message.author.id == "422463107739287565") {
        switch (args[1]) {
            case "id":
                message.channel.send(`ProcessID: ${processID} | Process Name: ${process.env.PROCESS_NAME} | Time: ${msToHMS(new Date().getTime() - startingTime)}`);
                break;
            case "kill":
                if (args[2] == processID) {
                    await message.channel.send(`Killed: ProcessID: ${processID} | Process Name: ${process.env.PROCESS_NAME} | Time: ${msToHMS(new Date().getTime() - startingTime)}`);
                    await client.destroy();
                }
                break;
        }
    }
}

module.exports = {runprocess};