const axios = require('axios');
const ChannelElement = require('./utils/ChannelElement');
const YouTube = require('youtube-live-chat');
const QuickYtSearch = require('quick-yt-search');
const Discord = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client();
const prefix = "!";
var fetchVideoInfo = require('youtube-info');

function isUpperCase(str) {
    return str === str.toUpperCase();
}

const YoutubeSearcher = new QuickYtSearch({
    YtApiKey: config.YOUTUBE_KEY, // Place your YouTube API key here
});
var yt = null;
// if(YoutubeSearcher.isVideoUrl('https://www.youtube.com/watch?v=nA6LhIQFPKY') === true) {
//     console.log('OMG, it\'s a video');
// } else {
//     console.log('NOPE');
// };


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
async function buscarCanal(youtubeChannel) {
    if (!youtubeChannel) {
        throw new Error('You must enter a search term to find channel.');
    };
    try {
        var urlsearch = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${youtubeChannel}&type=channel&key=${config.YOUTUBE_KEY}`;
        console.log(urlsearch);
        const response = await axios.get(urlsearch);
        //console.log(response);
        return new ChannelElement(response);
    } catch (error) {
        throw new Error('An error occurred while retrieving the channel.');
    };
}


client.on("message", function (message) {
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
        console.log(args);
        var querystring = args.join(' ');
        console.log(querystring);
        try {
            buscarCanal(args.join(' ')).then(channel => {
                console.log(channel);
                console.log(channel.id);
                console.log(channel.title);
                console.log(channel.description);
                message.reply(`canal encontrado ${channel.title}`);
            });
        } catch (error) {
            message.reply(`Error ${error}`);
        };
    }
    else if (command === "yt") {
        var querystring = args.join(' ');
        yt = new YouTube(querystring, config.YOUTUBE_KEY);

        yt.on('ready', () => {
            console.log('ready! iniciando busqueda');
            message.reply(`ready! iniciando busqueda`);
            yt.listen(1000);
        })

        yt.on('message', data => {
            let re = new RegExp('^.{6,7}$');
            var mensaje = data.snippet.displayMessage;
            //console.log(`Test ${data.snippet.displayMessage}:` + re.test(mensaje));
            console.log(mensaje);
            console.log(re.test(mensaje));
            //message.reply(`${data.snippet.displayMessage}`);
            var escodigo = re.test(mensaje);
            if(escodigo){
                message.channel.send(`${data.snippet.displayMessage}`);
            }
            //message.channel.send(`${re.test(mensaje)}`);
        })

        yt.on('error', error => {
            console.error(error);
            message.reply(`Error ${error}`);
	    yt.stop();
            console.log('la busqueda se detuvo');
            message.reply(`la busqueda se detuvo`);

        })
    }
    else if (command === "ytstop") {
        yt.stop();
        console.log('la busqueda se detuvo');
        message.reply(`la busqueda se detuvo`);
    }
});

client.login(config.BOT_TOKEN);
