module.exports.run = async (bot, message, args) => {

    var mem;

    if(!message.member.roles.has(message.guild.roles.find("name", "TwitchPGH Mod").id)){
        message.reply("You Are Not A TwitchPGH Mod!");
        return;
    }

    if(args[0] != 'give' && args[0] != 'remove' && args[0] != 'tag'){
        message.reply("Command Usage - !pghrole give/remove @user affiliate/partner/tag");
        return;
    }

    if(!message.mentions.users.first()){
        message.reply("Command Usage - !pghrole give/remove @user affiliate/partner/tag");
        return;
    }else{
        mem = message.guild.member(message.mentions.users.first());
        if(!mem) return message.reply("Invalid User. This usually means that the user specified was not mentioned properly, is not in the Discord, or used a browser based temporary version of Discord.");
    }

    if(args[2] != 'partner' && args[2] != 'affiliate' && args[2] != 'tag'){
        message.reply("Command Usage - !pghrole give/remove @user affiliate/partner/tag");
        return;
    }

    if(args[0] == 'give' && args[2] == 'partner'){
        mem.addRole(message.guild.roles.find("name", "TwitchPGH Partner"));
        return message.reply(mem + ' Is Now A TwitchPGH Partner!');
    }

    if(args[0] == 'remove' && args[2] == 'partner'){
        
        mem.removeRole(message.guild.roles.find("name", "TwitchPGH Partner"));
        return message.reply(mem + ' Is Not A TwitchPGH Partner Anymore!');
    }

    if(args[0] == 'give' && args[2] == 'affiliate'){
        
        mem.addRole(message.guild.roles.find("name", "TwitchPGH Affiliate"));
        return message.reply(mem + ' Is Now A TwitchPGH Affiliate!');
    }

    if(args[0] == 'remove' && args[2] == 'affiliate'){
        
        mem.removeRole(message.guild.roles.find("name", "TwitchPGH Affiliate"));
        return message.reply(mem + ' Is Not A TwitchPGH Affiliate Anymore!');
    }

    if(args[0] == 'give' && args[2] == 'tag'){
        
        mem.addRole(message.guild.roles.find("name", "TwitchPGH"));
        return message.reply(mem + ' Now Has The TwitchPGH Tag!');
    }

    if(args[0] == 'remove' && args[2] == 'tag'){
        
        mem.removeRole(message.guild.roles.find("name", "TwitchPGH"));
        return message.reply(mem + ' Does Not Have The TwitchPGH Tag Anymore!');
    }

    

    

}

module.exports.help = {
    name: "pghrole"
}