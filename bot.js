const botSettings = require("./botSettings.json");
const Discord = require("discord.js");
const bot = new Discord.Client();
const prefix = botSettings.prefix;
const fs = require("fs");
var twitch = require('twitch-api-v5');
twitch.clientID = botSettings.twitch1;
var twitch2 = require('twitch-api-v5');
twitch2.clientID = botSettings.twitch2;
bot.commands = new Discord.Collection();
bot.mutes = require("./mutes.json");
const SteamUser = require('steam-user');
const config = require('./config.json');
const client = new SteamUser();
const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');
var isconnected = false;
var stmid = SteamCommunity.SteamID;
var twitchpoll = null;
var MatchHandlerBronze = require('./MatchHandlerBronze.js');
var mhandlerbronze;
var botchannelid = botSettings.bot_logs;





const community = new SteamCommunity();
const manager = new TradeOfferManager({
    steam: client,
    community: community,
    language : 'en',
    cancelTime: 86400000
});


const logOnOptions = {
    accountName : config.accountName,
    password: config.password,
    twoFactorCode: SteamTotp.generateAuthCode(config.sharedSecret)
}

client.logOn(logOnOptions);
bot.login(botSettings.token);

client.on('loggedOn', () => {
    console.log("Steam Service Connected");
    client.setPersona(SteamUser.Steam.EPersonaState.Online);
    client.gamesPlayed(["https://www.discord.gg/knights"])
});

client.on('webSession', (sessionid, cookies) => {
    manager.setCookies(cookies);
    community.setCookies(cookies);
    community.startConfirmationChecker(10000, config.identitySecret);
    isconnected = true;
    
    
});





function acceptOffer(offer){
    offer.accept((err) => {
        if(err){
            console.log("There was an error accepting the offer.")
        }
    })
}

function declineOffer(offer){
    offer.decline((err) => {
        if(err){
            console.log("There was an error declining the offer.")
        }
    })
}

manager.on('newOffer', (offer) => {

    
    if(offer.partner.getSteamID64() == config.ownerID){
        acceptOffer(offer);
        console.log("An Offer Was Accepted");
    }
})









function pghtwitch(){
    var filenames = fs.readdirSync('./pgh');
    filenames.forEach(item => {
      if(item == '.gitkeep'){
        return;
      }
      fs.readFile('./pgh/' + item, 'utf8', (err, data) => {
        twitch2.streams.channel({channelID: data, stream_type: "live"}, (err, res) => {
          if(typeof res == 'undefined'){
            return;
          }
          if(res.stream == null){
            fs.writeFile('./pghlive/waslive' + item, 'no', (err) => {

            })
          }else{
            if(res.stream != null){
              var isStreaming = 'yes';
              fs.readFile('./pghlive/waslive' + item, 'utf8', (err, data) => {
                if(data == 'no' && isStreaming == 'yes'){
                  bot.channels.find("name", "pgh-tv").send(item.substring(0,item.indexOf('.txt')) + " is now live on Twitch! https://twitch.tv/" + item.substring(0,item.indexOf('.txt')));
                  fs.writeFile('./pghlive/waslive' + item, 'yes', (err) => {

                  }) 
                }else{
                  fs.writeFile('./pghlive/waslive' + item, 'yes', (err) => {

                  }) 
                }
              })
            }
          }
        })
      })
    })
    
    

}   
function knightstwitch(){
  var filenames = fs.readdirSync('./knights');
  filenames.forEach(item => {
    if(item == '.gitkeep'){
      return;
    }
    fs.readFile('./knights/' + item, 'utf8', (err, data) => {
      twitch.streams.channel({channelID: data, stream_type: "live"}, (err, res) => {
        if(typeof res == 'undefined'){
          return;
        }
        if(res.stream == null){
          fs.writeFile('./knightslive/waslive' + item, 'no', (err) => {

          })
        }else{
          if(res.stream != null){
            var isStreaming = 'yes';
            fs.readFile('./knightslive/waslive' + item, 'utf8', (err, data) => {
              if(data == 'no' && isStreaming == 'yes'){
                bot.channels.find("name", "knights-tv").send(item.substring(0,item.indexOf('.txt')) + " is now live on Twitch! https://twitch.tv/" + item.substring(0,item.indexOf('.txt')));
                fs.writeFile('./knightslive/waslive' + item, 'yes', (err) => {

                }) 
              }else{
                fs.writeFile('./knightslive/waslive' + item, 'yes', (err) => {

                }) 
              }
            })
          }
        }
      })
    })
  })
  
  

}   











fs.readdir("./cmds", (err, files) => {
  if(err) console.error(err);

  let jsfiles = files.filter(f => f.split(".").pop() === "js");
  if(jsfiles.length <= 0){
    console.log("No Commands To Load!");
    return;
  }

  console.log(`Loading ${jsfiles.length} Commands!`);

  jsfiles.forEach((f, i) => {
      let props = require(`./cmds/${f}`);
      console.log(`${i + 1}: ${f} Loaded!`);
      bot.commands.set(props.help.name, props);
  });
 
});






bot.on("ready", async () => {
  console.log('Bot is ready! ' + bot.user.username);
  

  bot.setInterval(() => {
    for(let i in bot.mutes){
      let time = bot.mutes[i].time;
      let guildId = bot.mutes[i].guild;
      let guild = bot.guilds.get(guildId);
      let member = guild.members.get(i);
      let mutedRole = guild.roles.find(r => r.name === "Muted");
      if(!mutedRole) continue;
      if(member.roles.has(guild.roles.find(r => r.name === "Muted"))){
        message.reply("This User Is Already Muted!");
      }

      if(Date.now() > time){


        member.removeRole(mutedRole);
        delete bot.mutes[i];

        fs.writeFile("./mutes.json", JSON.stringify(bot.mutes), err => {
          if(err) throw err;
          console.log(`I Have Unmuted ${member.user.tag}.`)
        });
      }
    }
  }, 5000);

  try{
    let link = await bot.generateInvite(["ADMINISTRATOR"]);
    console.log(link);
  } catch(e){
    console.log(e.stack);
  }



  twitchpoll = setInterval(function(){
      pghtwitch();
      knightstwitch();
  }, 60000);


//mhandlerbronze = new MatchHandlerBronze(bot);
var previouscommand = fs.readFileSync('./lastcommand.txt', 'utf8');
if(previouscommand == 'restart'){
  bot.channels.find("id", botchannelid).send("Bot Has Restarted!");
}


  
});












bot.on("message", async message => {

  if(message.author.bot) return;
  if(message.channel.type == "dm") return;
  

  
  


  



  let messageArray = message.content.split(" ");
  let command = messageArray[0];
  args = messageArray.slice(1);
  



  if(!command.startsWith(prefix)) return;

  let cmd = bot.commands.get(command.slice(prefix.length));
  if(cmd){
  var cmdname = command.slice(prefix.length);
  fs.writeFileSync('./lastcommand.txt', cmdname);
  if(cmdname == 'giveaway' || cmdname == 'linksteam'){
    cmd.run(bot,message,args,manager);
  }else{
   cmd.run(bot, message, args);
  }
  }
  
  
  


});

