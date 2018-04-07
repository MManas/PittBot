const Discord = require("discord.js");
var fs = require('fs');

module.exports.run = async (bot, message, args) => {

  var tradeurl = "";
    try{
      tradeurl = fs.readFileSync('./steam/' + message.author.id + '.txt', 'utf8');
    }catch(error){
      tradeurl = 'None';
    }

    let embed = new Discord.RichEmbed()
      .setAuthor(message.author.username)
      .setDescription("User Info")
      .setColor("#9B59B6")
      .addField("Full Username", `${message.author.username}#${message.author.discriminator}`)
      .addField("ID", message.author.id)
      .addField("Created At", message.author.createdAt)
      .addField("Steam Trade URL", tradeurl);

     
      return message.channel.send(embed);

}

module.exports.help = {
  name: "userinfo"
}
