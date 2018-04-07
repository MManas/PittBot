const fs = module.require("fs");

module.exports.run = async (bot, message, args) => {
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You Do Not Have Permission!");
    let toMute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!toMute) return message.reply("You Did Not Specify A User or ID!");

    if(toMute.id === message.author.id) return message.reply("You Can Not Mute Yourself!");
    if(toMute.highestRole.position > message.member.highestRole.position) return message.reply("You Can Not Mute Someone With A Higher Role Than You!");
    if(toMute.highestRole.position == message.member.highestRole.position) return message.reply("You Can Not Mute Someone With The Same Highest Role As You!");

    let role = message.guild.roles.find(r => r.name === "Muted");
    if(!role){
      try{
        role = await message.guild.createRole({
          name: "Muted",
          color:"#000000",
          hoist: true,
          permissions:[],
          mentionable: false
        });

        message.guild.channels.forEach(async (channel, id) => {
          await channel.overwritePermissions(role, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false,
            CREATE_INSTANT_INVITE: false,
            EMBED_LINKS: false,
            ATTACH_FILES: false,
            MENTION_EVERYONE: false,
            USE_EXTERNAL_EMOJIS: false,
            SPEAK: false,
            USE_VAD: false
          });
        });

      } catch(e){
        console.log(e.stack);
      }
    }
    if(toMute.roles.has(role.id)) return message.reply("This User Is Already Muted!");

    bot.mutes[toMute.id] = {
      guild: message.guild.id,
      time: Date.now() + parseInt(args[1]) * 1000
    }



    await toMute.addRole(role);

    fs.writeFile("./mutes.json", JSON.stringify(bot.mutes, null, 4), err =>{
      if(err) throw err;
      message.channel.send(`I Have Muted This User For ${args[1]} Seconds!`);
    });

    return;

}

module.exports.help = {
  name: "mute"
}
