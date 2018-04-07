var fs = require('fs');
module.exports.run = async (bot, message, args, manager) => {
  function roll(discordusers, steamitem, chan){
    var randnum = Math.floor(Math.random()*discordusers.length);
    var randomuser = discordusers[randnum];
    var newarr = discordusers;
    if(discordusers.length == 0){
      return chan.send("No one is eligible to win this giveaway!");
    }
    try{
      var x = fs.readFileSync('./steam/' + randomuser + "url.txt", 'utf8');
      try{
        var offer = manager.createOffer(x);
        offer.addMyItem(steamitem);
        offer.send((err, status) => {
        });
        return chan.send("<@" + randomuser + "> won the giveaway! You will receive your offer shortly! You have one day to accept this offer.");
      }catch(error){
        chan.send("The winner, <@" + randomuser + "> had an invalid Trade URL!\nRerolling!");
       newarr.splice(randnum, 1);
        return roll(newarr, steamitem, chan);
      }
    }catch(error){
     newarr.splice(randnum, 1);
      chan.send("The winner, <@" + randomuser + "> does not have their Trade URL linked!\nRerolling!");
      return roll(newarr, steamitem, chan);
    }
  }
  function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
  
  if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You Do Not Have Permission!");
  message.reply("Please enter the amount of seconds the giveaway should run.");
  var id = message.author.id;
  var time = 0;
  var game = 0;
  var channel = null;
  var item = null;
  var gameid = null;
  var giveawayid = makeid();
  var stock = [];
  var entered = [];
  const filter = m => m.author.id == id;
  const filter2 = (reaction, user) => reaction != null && user != null;
  message.channel.awaitMessages(filter, {max: 1, time: 60000, errors: ['time']})
    .then(collected => {
      if(Number.isInteger(parseInt(collected.array()[0].content))){
        message.reply("Giveaway time set to " + collected.array()[0].content);
        time = parseInt(collected.array()[0].content) * 1000;
        message.reply("What channel would you like your giveaway in? Please reply with the channel tagged. (e.g. #test123) ");
          message.channel.awaitMessages(filter, {max: 1, time: 60000, errors: ['time']})
          .then(collected => {
            if(!collected.array()[0].mentions.channels.first()){
              return message.reply("Please retry the command with a valid channel!");
            }else{
              channel = collected.array()[0].mentions.channels.first();
              message.reply('The giveaway channel has been set to <#' + channel.id + '>');
              message.reply('Which game is your item from? 1 for CSGO, 2 for PUBG');
                message.channel.awaitMessages(filter, {max: 1, time: 60000, errors: ['time']})
                .then(collected => {
                  if(!collected.array()[0] == 1 || !collected.array()[0] == 2){
                    return message.reply('Please retry the command and specify a valid game!');
                  }else{
                    game = parseInt(collected.array()[0].content);
                    if(game == 1){
                      message.reply("Game set to CSGO");
                      gameid = 730;
                    }
                    if(game == 2){
                      message.reply("Game set to PUBG");
                      gameid = 578080;
                    }
                    manager.getInventoryContents(gameid, 2, true, (err, inventory) => {
                      message.reply("Loading Inventory. Please wait for loading finished confirmation before proceeding.");
                      for(var i = 0; i < inventory.length; i++){
                       stock.push(inventory[i]);
                      }
                      var tosend = "";
                      for(var i = 0; i < stock.length; i++){
                        tosend = tosend + "\n" + i + ". " + stock[i].market_name;
                      }
                      message.channel.send(tosend);
                      message.reply("Inventory Loaded");
                      message.reply("Please enter the number of the item you wish to give away.");
                      message.channel.awaitMessages(filter, {max: 1, time: 60000, errors: ['time']})
                      .then(collected => {
                        if(collected.array()[0].content < 0 || collected.array()[0].content > stock.length - 1){
                          return message.reply("You did not enter a valid item number. Please try the command again.")
                        }else{
                          item = stock[parseInt(collected.array()[0].content)];
                          message.reply("Your selected item is " + item.market_name);
                          message.reply("Would you like to start a giveaway for " + item.market_name + " in <#" + channel.id + "> for " + time/1000 + " seconds?\nPlease type 1 for YES and 2 for NO. This is your only chance to cancel.");
                            message.channel.awaitMessages(filter, {max: 1, time: 60000, errors : ['time']})
                            .then(collected => {
                              if(collected.array()[0].content == 1){
                                  channel.send("Giveaway " + giveawayid + " starting for " + item.market_name + " for " + time/60000 + " minutes.\nYou need to have your steam linked to win! You can link it by typing !linksteam steamtradeurlhere in <#428305244586508308>\nReact to this message to enter!")
                                  .then(message => {
                                    message.awaitReactions(filter2, {time : time})
                                    .then(collected => {
                                    if(collected.array().length == 0){
                                      return channel.send("Nobody was in giveaway " + giveawayid + ", so it has been canceled.");
                                    }
                                     for(var i = 0; i < collected.array().length; i++){
                                      for(var j = 0; j < collected.array()[i].users.array().length; j++){
                                        if(i == 0 && j ==0){
                                          entered.push(collected.array()[i].users.array()[j].id)
                                        }else{
                                          for(var k = 0; k < entered.length; k++){
                                            if(entered[k] == collected.array()[i].users.array()[j].id){

                                            }else{
                                              entered.push(collected.array()[i].users.array()[j].id);
                                            }
                                          }
                                        }
                                      }
                                     }
                                     channel.send("Giveaway " + giveawayid + " has ended.\nRolling now!");
                                     roll(entered, item, channel);
                                      })
                                    .catch(collected =>  {
                                      console.error;
                                    });
                                  })
                                  .catch(message => {
                                    (console.error);
                                  });
                              }
                              if(collected.array()[0].content == 2){
                                return message.reply("Giveaway has been canceled!");
                              }
                            })
                            .catch(collected => {
                              return message.reply("You Ran Out Of Time!")
                            });
                        }
                      })
                      .catch(collected => {
                        return(message.reply("You Ran Out Of Time!"));
                      });

                    })
                  }
                })
                .catch(collected => {
                  return message.reply("You Ran Out Of Time!");
                });
            }
          })
          .catch(collected => {
            return message.reply("You Ran Out Of Time!");
          });
      }else{
        return message.reply("Please retry the command with a valid time!");
      }
    })
    .catch(collected => {
      return message.reply("You Ran Out Of Time!");
    });



    
    
  }
  
  module.exports.help = {
    name: "giveaway"
  }
  