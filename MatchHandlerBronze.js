

var matches = [];
var bot;
var voip;
var token = require('./botSettings.json').faceittoken;
var hid = require('./botSettings.json').hubid;
var request = require('requestretry');
var fs = require('fs');
var faceitcategory = require('./botSettings.json').faceitcategory;
var faceitpoll;
var usercheck;
function sortusers(){
    var users = bot.channels.find("name", "Auto Voice Finder").members.array();
    //console.log(users[0].user.id);
    users.forEach(async user => {
        var usersteam = fs.readFileSync('./steam/' + user.user.id + 'id.txt', 'utf8');
        try{
        matches.forEach(async match => {
            match.t1p.forEach(async team1 => {
               if(team1 == usersteam){
                   user.setVoiceChannel(bot.channels.find("name", match.t1n).id);
               }
            })
            match.t2p.forEach(async team2 => {
                if(team2 == usersteam){
                user.setVoiceChannel(bot.channels.find("name", match.t2n).id);
                }
            })
        })
    }catch(error){
        
    }
    })
}
function checkmatches(){
    var checkedmatches = [];
    var options = { method: 'GET',
  url: 'https://open.faceit.com/data/v4/hubs/'+ hid + '/matches',
  qs: { type: 'ongoing', offset: '0', limit: '100' },
  headers: 
   { Authorization: token } };
    request(options, async function (error, response, body) {
        let x = await JSON.parse(body);
        x.items.forEach( item => {
           var matchid = item.match_id;
           var team1name = item.teams.faction1.name;
           var team2name = item.teams.faction2.name;
           var team1 = [];
           var team2 = [];
           item.teams.faction1.roster.forEach(item => {
               team1.push(item.game_player_id);
           })
           item.teams.faction2.roster.forEach(item => {
               team2.push(item.game_player_id);
           })
           var j = {
               id: matchid,
               t1n: team1name,
               t2n: team2name,
               t1p: team1,
               t2p: team2
           }   
           
            checkedmatches.push(j);

        })
        for(var i = matches.length-1; i > -1; i--){
            var islive = false;
            var checkedindex = null;
            for(var j = checkedmatches.length - 1; j > -1; j--){
                if(matches[i].id == checkedmatches[j].id){
                    islive = true;
                    checkedindex = j;
                }
            }
            if(islive == true){
                checkedmatches.splice(checkedindex,1);
            }else{
                try{
                bot.channels.find("name", matches[i].t1n).delete();
                }catch(error){

                }
                try{
                    bot.channels.find("name", matches[i].t2n).delete();
                }catch(error){
                    
                }
                
                matches.splice(i, 1);
            }
            
        }
          
        for(var i = 0; i < checkedmatches.length; i++){
           
                matches.push(checkedmatches[i]);
            
        }

    
      matches.forEach(async item => {
        if(!bot.channels.find("name", item.t1n) && !bot.channels.find("name", item.t2n)){
            bot.guilds.find("name", "Pittsburgh Knights").createChannel(item.t1n, "voice")
    .then(async channel => {
    await channel.setParent(faceitcategory);
    await channel.overwritePermissions(channel.guild.id, {CONNECT: false});
     })
    .catch(error => {

     });
    bot.guilds.find("name", "Pittsburgh Knights").createChannel(item.t2n, "voice")
    .then(async channel => {
    await channel.setParent(faceitcategory);
    await channel.overwritePermissions(channel.guild.id, {CONNECT: false});
    })
    .catch(error => {

    });
        }
      })
      
      



    
    });
}

module.exports = class MatchHandlerBronze{
    constructor(b){
        bot = b;
        voip = bot.channels.find("name", "Auto Voice Finder");
        var options = { method: 'GET',
  url: 'https://open.faceit.com/data/v4/hubs/'+ hid + '/matches',
  qs: { type: 'ongoing', offset: '0', limit: '100' },
  headers: 
   { Authorization: token } };
    
  var children = bot.channels.find("name", "FaceIt").children.array();
  children.forEach(item => {
      if(item.name == 'Auto Voice Finder'){
          
      }else{
          item.delete();
      }
  })

request(options, async function (error, response, body) {
 let x = await JSON.parse(body);
 x.items.forEach(item => {
    var matchid = item.match_id;
    var team1name = item.teams.faction1.name;
    var team2name = item.teams.faction2.name;
    var team1 = [];
    var team2 = [];
    item.teams.faction1.roster.forEach(item => {
        team1.push(item.game_player_id);
    })
    item.teams.faction2.roster.forEach(item => {
        team2.push(item.game_player_id);
    })
    var j = {
        id: matchid,
        t1n: team1name,
        t2n: team2name,
        t1p: team1,
        t2p: team2
    }

   
    matches.push(j);
    
 })
 matches.forEach(item => {
    bot.guilds.find("name", "Pittsburgh Knights").createChannel(item.t1n, "voice")
    .then(async channel => {
        await channel.setParent(faceitcategory);
        await channel.overwritePermissions(channel.guild.id, {CONNECT: false});
    })
    .catch(error => {

    });
    bot.guilds.find("name", "Pittsburgh Knights").createChannel(item.t2n, "voice")
    .then(async channel => {
        await channel.setParent(faceitcategory);
        await channel.overwritePermissions(channel.guild.id, {CONNECT: false});
    })
    .catch(error => {

    });
})

});

faceitpoll = setInterval(function(){
    checkmatches();
}, 30000);
usercheck = setInterval(function(){
    try{
    sortusers();
    }catch(error){
        
    }
}, 2000);
    }
}