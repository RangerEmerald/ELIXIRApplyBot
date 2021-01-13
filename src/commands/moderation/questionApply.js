async function askApply(client){
    const memberIdList = client.guilds.cache.get(process.env.APPLY_GUILD).roles.cache.find(r => r.name.toLowerCase() === process.env.JUST_JOINED).members.map(m=>m.user.id);
}

module.exports = {askApply};