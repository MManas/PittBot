

module.exports.run = async (bot, message, args) => {

  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You Do Not Have Permission!");
    let toMute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!toMute) return message.reply("You Did Not Specify A User or ID!");

    let role = message.guild.roles.find(r => r.name === "Muted");

    if(!role || !toMute.roles.has(role.id)) return message.reply("This User Is Not Muted!");

    await toMute.removeRole(role);
    message.reply("The User Has Been Unmuted!");
    return;
}

module.exports.help = {
  name: "unmute"
}
