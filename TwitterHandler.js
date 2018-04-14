var Twitter = require('twitter');
var discordbot;
var config = require('./botSettings.json');
 
var client = new Twitter({
  consumer_key: config.twitterkey1,
  consumer_secret: config.twitterkey2,
  access_token_key: config.twitterkey3,
  access_token_secret: config.twitterkey4
});
var stream;

module.exports = class TwitterHandler{
  constructor(bot){
    discordbot = bot;
    stream = client.stream('statuses/filter', {follow: '3140083173'});
  stream.on('data', function(event) {
  discordbot.channels.find("name", "knights-announcements").send("https://www.twitter.com/knightsgg/status/" + event.id_str);
});
  }
}