const Discord = require("discord.js");
var fs = require('fs');

module.exports.run = async (bot, message, args) => {

  var tradeurl = "";
  var steamid = "";
    try{
      tradeurl = fs.readFileSync('./steam/' + message.author.id + 'url.txt', 'utf8');
    }catch(error){
      tradeurl = 'None';
    }
    try{
      steamid = fs.readFileSync('./steam/' + message.author.id + 'id.txt', 'utf8');
    }catch(error){
      steamid = 'None';
    }

    let embed = new Discord.RichEmbed()
      .setAuthor(message.author.username)
      .setDescription("User Info")
      .setColor("#9B59B6")
      .addField("Full Username", `${message.author.username}#${message.author.discriminator}`)
      .addField("ID", message.author.id)
      .addField("Created At", message.author.createdAt)
      .addField("Steam Trade URL", tradeurl)
      .addField("SteamID", steamid);


      return message.channel.send(embed);

}

module.exports.help = {
  name: "userinfo"
}
