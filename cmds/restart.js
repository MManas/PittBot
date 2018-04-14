var exec = require('child_process').exec;
const channelid = require('../botSettings.json').bot_logs;


module.exports.run =  (bot, message, args) => {

    if(!message.member.hasPermission('ADMINISTRATOR')){
        message.reply("You Do Not Have Permission To Restart The Bot!");
        return;
    }else{
        message.reply("Requesting Bot Restart...\nPlease Check <#" + channelid + "> For Confirmation.");
        exec('pm2 restart bot', function(error, stdout, stderr) {
           
        });
    }
   
  }
  
  module.exports.help = {
    name: "restart"
  }
  