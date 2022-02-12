var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var fs = require('fs');

let wordList = fs.readFileSync('wordsList.txt', 'utf8').split('\n');
let mechWords = fs.readFileSync('mechWords.txt', 'utf8').split(' ');

// Configure logger settings

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
  colorize: true
});

logger.level = 'debug';

// Initialize Discord Bot

var bot = new Discord.Client({
  token: auth.token,
  autorun: true
});

bot.on('ready', function (evt) {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.username + ' - (' + bot.id + ')');
  // var now = new Date();
  // var millisTill12 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 52, 0, 0) - now;
  // if (millisTill12 < 0) {
  //   millisTill12 += 86400000;
  // }
  // var timeout = setTimeout(function (){
  //   // disgustang js for finding random word
  //   var newWord = dailyWords[Math.floor(Math.random() * dailyWords.length)];
  //   sendMessage(newWord);
  // }, millisTill12)
});

// function sendMessage(message){
//   var guild = bot.guilds.get('guildid');
//   if(guild && guild.channels.get('channelid')){
//       guild.channels.get('channelid').send(message);
//   }

// }

var dailyWords = mechWords ? mechWords : [];


bot.on('message', function (user, userID, channelID, message, evt) {

// It will listen for messages that will start with `!`

  if (message.substring(0, 1) == '!') {
    var args = message.substring(1).split(' ');
    var cmd = args[0];
    var word = args[1];

    args = args.splice(1);
    switch(cmd) {
        // !ping
        case 'ping':
            sendMessage(channelID, "Pong!");
        break;
        case 'add':
          if (word.length === 5) {
            dailyWords.push(word);
            sendMessage(channelID, `${word} entered successfully :D`);
          } else {
            sendMessage(channelID, "that word is not 5 letters long :(");
          }
            
        break;
        case 'show':
          sendMessage(channelID, dailyWords.join(" "));
        break;
        case 'pick':
          var newWord = dailyWords[Math.floor(Math.random() * dailyWords.length)];
          sendMessage(channelID, newWord);
        break;
        case 'getgood':
          var goodWord = wordList[Math.floor(Math.random() * wordList.length)];
          sendMessage(channelID, goodWord);
        break;
        case 'help':
          sendMessage(channelID, helpCommands);
        break;
    }
  }
});

function sendMessage(channelID, message) {
  bot.sendMessage({
    to:channelID,
    message: message
  })
}

const helpCommands = "commands: \n"
  + "!add - adds a word to the list\n"
  + "!show - shows all added words\n"
  + "!pick - picks a word from the list at random\n"
  + "!getgood - picks a random word from the official list of possible answers\n"
  + "!help - shows this menu obviously"