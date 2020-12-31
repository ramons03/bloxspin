const YouTube = require('youtube-live-chat');
const QuickYtSearch = require('quick-yt-search');
const Discord = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client();
const prefix = "!";

const YoutubeSearcher = new QuickYtSearch({
    YtApiKey: config.YOUTUBE_KEY, // Place your YouTube API key here
});

if(YoutubeSearcher.isVideoUrl('https://www.youtube.com/watch?v=nA6LhIQFPKY') === true) {
    console.log('OMG, it\'s a video');
} else {
    console.log('NOPE');
};
YoutubeSearcher.getChannel('spins roblox ').then(channel => {
    console.log(channel.id);
    console.log(channel.title);
    console.log(channel.description);
});

// const yt = new YouTube('UCYXIviXPAaaaU_AOotpXTAw', config.YOUTUBE_KEY);

// yt.on('ready', () => {
//   console.log('ready!')
//   yt.listen(1000)
// })

// yt.on('message', data => {
//   console.log(data.snippet.displayMessage)
// })

// yt.on('error', error => {
//   console.error(error)
// })



client.on("message", function(message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();
    if (command === "ping") {
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
    }
    else if (command === "sum") {
        const numArgs = args.map(x => parseFloat(x));
        const sum = numArgs.reduce((counter, x) => counter += x);
        message.reply(`The sum of all the arguments you provided is ${sum}!`);
    }
    else if (command === "buscar") {
        const numArgs = args.map(x => parseFloat(x));
        const sum = numArgs.reduce((counter, x) => counter += x);
        message.reply(`The sum of all the arguments you provided is ${sum}!`);
    }
});

client.login(config.BOT_TOKEN);
