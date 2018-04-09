var matches = [];
var bot;
var voip;
var token = require('./botSettings.json').faceittoken;
var hid = require('./botSettings.json').hubid;
var request = require('requestretry');
var faceitcategory = require('./botSettings.json').faceitcategory;
var faceitpoll;


module.exports = class MatchHandler{
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
    .then(channel => {
        channel.setParent(faceitcategory);
        channel.overwritePermissions(channel.guild.id, {CONNECT: false});
    })
    .catch(error => {

    });
    bot.guilds.find("name", "Pittsburgh Knights").createChannel(item.t2n, "voice")
    .then(channel => {
        channel.setParent(faceitcategory);
        channel.overwritePermissions(channel.guild.id, {CONNECT: false});
    })
    .catch(error => {

    });
})
faceitpoll = setInterval(function(){
    
}, 30000);
});
    }
}