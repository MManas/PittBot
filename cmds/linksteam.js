var fs = require('fs');
var SteamID = require('steamid');
module.exports.run = async (bot, message, args, manager) => {
  var steamid = null;
  var token = args[0].indexOf('&token=');
    if(message.channel.id != 428305244586508308){
      return message.reply("Please use the channel <#428305244586508308> to link your Steam Trade URL!");
    }

    if(!args[0]){
      return message.reply("Please provide your trade url. You can find it here https://steamcommunity.com/id/me/tradeoffers/privacy , and link it using the command !linksteam tradeurlhere");
    }
    
     if(args[0].indexOf("https://steamcommunity.com/tradeoffer/new/?partner=") != 0){
      return message.reply("⚠️ ⚠️ ⚠️ Please Provide a Valid Trade URL! You Can Find It Here ⚠️ ⚠️ ⚠️  -> https://steamcommunity.com/id/me/tradeoffers/privacy");
     }
     try{
      var offer = manager.createOffer(args[0]);
      steamid = offer.partner.getSteamID64();
      message.reply("Your trade link has been saved! Feel free to update it anytime!");
     }catch(error){
      return message.reply("⚠️ ⚠️ ⚠️ Please Provide a Valid Trade URL! You Can Find It Here ⚠️ ⚠️ ⚠️  -> https://steamcommunity.com/id/me/tradeoffers/privacy");
     }
     fs.writeFileSync('./steam/' + message.author.id + 'url.txt', args[0]);
     fs.writeFileSync('./steam/' + message.author.id + 'id.txt', steamid);
     message.member.addRole(message.guild.roles.find("name", "Steam").id);
     return;
    
  }
  
  module.exports.help = {
    name: "linksteam"
  }
  