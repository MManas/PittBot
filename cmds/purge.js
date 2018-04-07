

module.exports.run = async (bot, message, args) => {

  async function purge(){
    message.delete();

    if(isNaN(args[0])){
      message.reply("Please Provide A Number of Messages To Delete!");
      return;
    }
    if(args[0] > 100 || args[0] < 0){
      message.reply("Please Enter A Number Between 0 And 100!");
    }

    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You Do Not Have Permission!");

    const fetched = await message.channel.fetchMessages({limit: args[0]});
    message.channel.bulkDelete(fetched)
    .catch(error => message.channel.send(`Error: ${error}`));

  }

  purge();

}

module.exports.help = {
  name: "purge"
}
