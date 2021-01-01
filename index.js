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
function isLowerCase(str) {
    return str === str.toLowerCase();
}
function isNumber(n){
    return Number(n)=== n;
}
//Assumes nothing and can handle numbers and symbols
// function isCapitalized(str) {
//     var rex = /^[A-Z]/
//     return rex.test(str);
// }
// //Assumes that a string is made up of only letters
function isCapitalized(str) {
    var char = str[0]; 
    if(!isNumber(char)){
        return char.toUpperCase() === char;
    }
    return false;
}

const YoutubeSearcher = new QuickYtSearch({
    YtApiKey: config.YOUTUBE_KEY, // Place your YouTube API key here
});
var yt = null;


const fs = require('fs');




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
// async function buscarCanal(youtubeChannel) {
//     if (!youtubeChannel) {
//         throw new Error('You must enter a search term to find channel.');
//     };
//     try {
//         var urlsearch = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${youtubeChannel}&type=channel&key=${config.YOUTUBE_KEY}`;
//         console.log(urlsearch);
//         const response = await axios.get(urlsearch);
//         //console.log(response);
//         return new ChannelElement(response);
//     } catch (error) {
//         throw new Error('An error occurred while retrieving the channel.');
//     };
// }
async function buscarCanal(youtubeChannel) {
    if (!youtubeChannel) {
        throw new Error('You must enter a search term to find channel.');
    };
    try {
        var urlsearch = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${youtubeChannel}&key=${config.YOUTUBE_KEY}`;
        console.log('buscarCanal');
        console.log(urlsearch);
        const response = await axios.get(urlsearch);
        //console.log(response.data);
        return new ChannelElement(response);
    } catch (error) {
        //throw new Error('An error occurred while retrieving the channel.');
        console.log('error', error);
        return {};
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
        console.log('ye command');
        var querystringparam = args[0];
        console.log('querystringparam', querystringparam);
        var ytkeyparam = args[1];
        console.log('ytkeyparam', ytkeyparam);
        var youtubekey = "";
        if(parseInt(ytkeyparam) === 1){
            youtubekey = config.YOUTUBE_KEY;
        }
        if(parseInt(ytkeyparam)  === 2){
            youtubekey = config.YOUTUBE_KEY2;
        }

        buscarCanal(querystringparam).then(channel => {
            console.log(channel);
            console.log(channel.id);
            console.log(channel.title);
            console.log(channel.description);
            message.reply(`canal encontrado ${channel.title}`);
            message.reply(`${channel.description}`);

            console.log('youtubekey', youtubekey);
            yt = new YouTube(querystringparam, youtubekey);
    
            yt.on('ready', () => {
                console.log('ready! iniciando busqueda');
                message.reply(`ready! iniciando busqueda`);
                yt.listen(1000);
            });
            yt.on('message', data => {
                //let re = new RegExp('^.{6,7}$');
                //console.log(data);
                var author = data.authorDetails.displayName;
                var esmoderador = data.authorDetails.isChatModerator;
                var esowner = data.authorDetails.isChatOwner;
                var essponsor = data.authorDetails.isChatSponsor;
                var esverificado = data.authorDetails.isVerified;
                author = `${(esverificado?'verficado':'')}${(esowner?'dueño':'')}${(essponsor?'sponsor':'')}${(esmoderador?'moderador':'')}` + author;
                var mensaje = `${data.snippet.displayMessage}`;
                //console.log(`Test ${data.snippet.displayMessage}:` + re.test(mensaje));
                console.log(mensaje);
                if(mensaje.length > 5){
                    var seiscaracteres = mensaje.substring(0,6);

                    let regextest = new RegExp('[a-zA-Z0-9\-_]{6}$');
                    var esregex = regextest.test(mensaje);
                    if(esregex){
                        var match = regextest.exec(mensaje);
                        console.log(match[0]); // abc
                        seiscaracteres = match[0];
                    }
                    console.log('seiscaracteres', seiscaracteres);
                    var esmayuscula = isUpperCase(seiscaracteres);
                    var esminuscula = isLowerCase(seiscaracteres);
                    var tieneespacios = /\s/.test(seiscaracteres);
                    var esmencion = (seiscaracteres.substring(0,1) === '@');
                    var iscapitalized = isCapitalized(seiscaracteres);
                    console.log(`${seiscaracteres}: ${esmayuscula} ${esminuscula} ${tieneespacios} ${esmencion} ${iscapitalized}`);
                    
                    if((!esmayuscula && !esminuscula && !tieneespacios && !esmencion)){
                        var existecodigo = false;
                        const filecontent = fs.readFileSync('./spins/01012021.txt', 'utf8');
                        console.log(`buscar si existe el codigo: ${seiscaracteres} ${filecontent}`);
                        if(filecontent.indexOf(seiscaracteres) >= 0){
                            console.log('ya existe el codigo');
                            existecodigo = true;
                        }
                        if(!existecodigo){
                            var formatedmessage = `**${author}** | ${data.snippet.displayMessage}`;
                            var codigo = `\`\`\`CSS
                            ${seiscaracteres}
                            \`\`\``
                            //message.channel.send(`**${author}** | ${data.snippet.displayMessage}`);
                            message.channel.send(`${formatedmessage}`);
                            message.channel.send(`${codigo}`);
                            fs.appendFile('./spins/01012021.txt', seiscaracteres + '\n', function (err) {
                                if (err) throw err;
                                console.log('Saved!');
                            });
                        }
                        // fs.readFileSync('./spins/01012021.txt', function (err, data) {
                        //     var existecodigo = false;
                        //     if (err) throw err;
                        //     console.log(`buscar si existe el codigo ${seiscaracteres}`);
                        //     if(data.indexOf(seiscaracteres) >= 0){
                        //         console.log('ya existe el codigo');
                        //         existecodigo = true;
                        //     }
                        //     return existecodigo;
                        // }).then(result => {
                        //     console.log('fin leer archivo'. result);
                        //     if(!existecodigo){
                        //         var formatedmessage = `**${author}** | ${data.snippet.displayMessage}`;
                        //         var codigo = `\`\`\`CSS
                        //         ${seiscaracteres}
                        //         \`\`\``
                        //         //message.channel.send(`**${author}** | ${data.snippet.displayMessage}`);
                        //         message.channel.send(`${formatedmessage}`);
                        //         message.channel.send(`${codigo}`);
                        //         fs.appendFile('./spins/01012021.txt', seiscaracteres + '\n', function (err) {
                        //             if (err) throw err;
                        //             console.log('Saved!');
                        //         });
                        //     }
                        // });
                    }
                }
            })
    
            yt.on('error', error => {
                console.error(error);
                message.reply(`Error ${error}`);
                yt.stop();
                console.log('la busqueda se detuvo');
                message.reply(`la busqueda se detuvo`);
            });
        }).catch(err => {
            console.log('error', err);
        });
    }
    else if (command === "ytstop") {
        yt.stop();
        console.log('la busqueda se detuvo');
        message.reply(`la busqueda se detuvo`);
    }
});

client.login(config.BOT_TOKEN);
