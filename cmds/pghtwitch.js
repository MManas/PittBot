var fs = require("fs");
var pghcheck = require('twitch-api-v5');
var config = require('../botSettings.json');
pghcheck.clientID = config.pghcheck;


module.exports.run = async (bot, message, args) => {
    const filter = m => m.author.id == message.author.id;
    var id = null;
    if(!message.member.roles.has(message.guild.roles.find("name", "TwitchPGH Mod").id)){
        message.reply("You Are Not A TwitchPGH Mod!");
        return;
    }
    if(args[0] != 'add' && args[0] != 'remove' && args[0] != 'enable' && args[0] != 'disable'){
        return message.reply("You did not specify add or remove.\nCommand Syntax: !pghtwitch add/remove twitchusername");
    }
    if(args[0] == 'enable' || args[0] == 'disable'){
        
    }
    if(!args[1]){
        return message.reply("You did not specify a username.\nCommand Syntax: !pghtwitch add/remove twitchusername");
    }
    if(args[0] == 'remove'){
        try{
            fs.unlinkSync('./pgh/' + args[1] + '.txt');
            fs.unlinkSync('./pghlive/waslive' + args[1] + '.txt');
            return message.reply("The user " + args[1] + " was removed!");
        }catch(error){
            return message.reply("Could not remove! The user " + args[1] + " is not in the system!");
        }
    }else{
    pghcheck.users.usersByName({users: args[1]}, (err, res) => {
        if(res._total == 0){
            message.reply("The user specified is not valid.");
        }else{
            message.reply("" + res.users[0].logo);
            message.channel.send(res.users[0].name);
            message.reply("Is this the user you would like to add? Respond 1 for YES and 2 for NO.")
            message.channel.awaitMessages(filter, {max: 1, time: 60000, errors : ['time']})
            .then(collected =>  {
                if(collected.array()[0].content != 1 && collected.array()[0].content != 2){
                    return message.reply("Please retry the command, and enter 1 for YES and 2 for NO when prompted.");
                }else{
                    id = res.users[0]._id;
                    if(collected.array()[0].content == 1){
                        fs.writeFileSync('./pgh/' + res.users[0].name + '.txt', res.users[0]._id);
                        fs.writeFileSync('./pghlive/waslive' + res.users[0].name + '.txt', 'no');
                        return message.reply("The twitch user " + args[1] + " has been added!");
                    }
                    if(collected.array()[0].content == 2){
                        return message.reply("Adding user "  + args[1] + " has been canceled.");
                    }
                }
            })
            .catch(collected => {

            });
        }
    })
}
}

module.exports.help = {
  name: "pghtwitch"
}
