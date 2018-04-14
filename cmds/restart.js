var exec = require('child_process').exec;
const channelid = require('../botSettings.json').bot_logs;
var fs = require('fs');



module.exports.run =  (bot, message, args) => {
    var restarttime = fs.readFileSync('./restarttime.txt', 'utf8');
    var time = (Date.now() - parseInt(restarttime))/1000;       

    if(!message.member.hasPermission('ADMINISTRATOR')){
        message.reply("You Do Not Have Permission To Restart The Bot!");
        return;
    }else if(time < 30){
        var until = 30-time;
        return message.reply("Please wait " + until + " seconds before restarting!");
    } else{
        try{
            fs.writeFileSync('./restarttime.txt', Date.now());
            }catch(error){
            }
        message.reply("Requesting Bot Restart...\nPlease Check <#" + channelid + "> For Confirmation.");
        exec('pm2 restart bot', function(error, stdout, stderr) {
           
        });
    }
   console.log(restarttime);
  }
  
  module.exports.help = {
    name: "restart"
  }
  