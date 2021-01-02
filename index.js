var moment = require('moment'); // require
const axios = require('axios');
const ChannelElement = require('./utils/ChannelElement');
const YouTube = require('youtube-live-chat');
const QuickYtSearch = require('quick-yt-search');
const Discord = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client();
const prefix = "!";
var fetchVideoInfo = require('youtube-info');

const codigosexistentes = new Set();
//var codigosexistentes = [];
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
    var palabra = str.substring(1,6);
    if(!isNumber(char)){
        return char.toUpperCase() === char && isLowerCase(palabra);
    }
    return false;
}

const YoutubeSearcher = new QuickYtSearch({
    YtApiKey: config.YOUTUBE_KEY, // Place your YouTube API key here
});
var yt = null;

function crawlFiles(path) {
    var files = filelist(path);
    var filepaths = [];

    var cache = new Set();

    files.forEach((file) => {
        var fullname = '' + path + '/' + file + '';
        filepaths.push(fullname);
    });
    filepaths.forEach(fp => {
        console.log('fp', fp);
        const filecontent = fs.readFileSync(fp, 'utf8');
        filecontent.toString().split(/\n/).forEach(item => { 
            console.log('item', item); 
            codigosexistentes.add(item);
        });
        //var obj = readID3(fp);
        //obj.filepath = fp;

        // var data = JSON.stringify(obj);
        // if (!cache.has(data)) {
        //     cache.add(data);
        //     toTXT('./db2.js', obj);
        // }

    });
}

const fs = require('fs-extra');

const { r, g, b, w, c, m, y, k } = [
    ['r', 1], ['g', 2], ['b', 4], ['w', 7],
    ['c', 6], ['m', 5], ['y', 3], ['k', 0],
].reduce((cols, col) => ({
    ...cols,  [col[0]]: f => `\x1b[3${col[1]}m${f}\x1b[0m`
}), {})


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
        if(parseInt(ytkeyparam)  === 3){
            youtubekey = config.YOUTUBE_KEY3;
        }
        if(parseInt(ytkeyparam)  === 4){
            youtubekey = config.YOUTUBE_KEY4;
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
                yt.listen(10000);
            });
            yt.on('message', data => {
                //let re = new RegExp('^.{6,7}$');
                //console.log(data);
                var author = data.authorDetails.displayName;
                var esmoderador = data.authorDetails.isChatModerator;
                var esowner = data.authorDetails.isChatOwner;
                var essponsor = data.authorDetails.isChatSponsor;
                var esverificado = data.authorDetails.isVerified;
                author = `${(esverificado?'verficado ':'')}${(esowner?'dueño ':'')}${(essponsor?'sponsor ':'')}${(esmoderador?'moderador ':'')}` + author;
                var mensaje = `${data.snippet.displayMessage}`;
                //console.log(`Test ${data.snippet.displayMessage}:` + re.test(mensaje));
                console.log(mensaje);
                if(mensaje.length > 5){
                    var seiscaracteres = mensaje.substring(0,6);
                    var expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

                    var regexurl = new RegExp(expression);
                    var tieneurl = regexurl.test(mensaje)
                    //var t = 'www.google.com';
                    let regexcode = new RegExp('[a-zA-Z0-9\-_]{6}$');
                    var matchregex = regexcode.test(mensaje);
                    if(matchregex){
                        var matchtexts = regexcode.exec(mensaje);
                        console.log(matchtexts[0]); 
                        seiscaracteres = matchtexts[0];
                    }
                    console.log('seiscaracteres', seiscaracteres);
                    var esmayuscula = isUpperCase(seiscaracteres);
                    var esminuscula = isLowerCase(seiscaracteres);
                    var tieneespacios = /\s/.test(seiscaracteres);
                    var esmencion = (seiscaracteres.substring(0,1) === '@');
                    var iscapitalized = isCapitalized(seiscaracteres);
                    console.log(`${seiscaracteres}: ${tieneurl?r('url'):g('url')} ${esmayuscula?r('may'):g('may')} ${esminuscula?r('min'):g('min')} ${tieneespacios?r('esp'):g('esp')} ${esmencion?r('men'):g('men')} ${iscapitalized?r('cap'):g('cap')}`);
                    
                    if((!tieneurl && !esmayuscula && !esminuscula && !tieneespacios && !esmencion && !iscapitalized)){
                        //var existecodigo = false;
                        //var now = new Date();
                        var file_name = './spins/' + moment().format('YYYYDDMM') + ".txt";
                        fs.ensureFileSync(file_name);
                        //const filecontent = fs.readFileSync(file_name, 'utf8');
                        //console.log(`buscar si existe el codigo: ${seiscaracteres} \n ${filecontent}`);
                        console.log(`buscar si existe el codigo: ${seiscaracteres}`);
                        //message.reply(`buscar si existe el codigo: ${seiscaracteres}`);
                        if(codigosexistentes.has(seiscaracteres)){
                            console.log(`ya existe el codigo ${seiscaracteres}`);
                            //message.reply(`ya existe el codigo ${seiscaracteres}`);
                            //existecodigo = true;
                        }else{
                            codigosexistentes.add(seiscaracteres);
                            var formatedmessage = `**${author}** | ${data.snippet.displayMessage}`;
                            var codigo = `\`\`\`fix
                            ${seiscaracteres}
                            \`\`\``
                            //message.channel.send(`**${author}** | ${data.snippet.displayMessage}`);
                            message.channel.send(`${formatedmessage}`);
                            message.channel.send(`${codigo}`);
                            fs.appendFile(file_name, seiscaracteres + '\n', function (err) {
                                if (err) throw err;
                                console.log(`${file_name} ${seiscaracteres} Saved!`);
                                //message.reply(`${seiscaracteres} Saved`);
                            });
                        }
                        // if(!existecodigo){
                        //     var formatedmessage = `**${author}** | ${data.snippet.displayMessage}`;
                        //     var codigo = `\`\`\`fix
                        //     ${seiscaracteres}
                        //     \`\`\``
                        //     //message.channel.send(`**${author}** | ${data.snippet.displayMessage}`);
                        //     message.channel.send(`${formatedmessage}`);
                        //     message.channel.send(`${codigo}`);
                        //     fs.appendFile(file_name, seiscaracteres + '\n', function (err) {
                        //         if (err) throw err;
                        //         console.log(`${file_name} ${seiscaracteres} Saved!`);
                        //         message.reply(`${seiscaracteres} Saved`);
                        //     });
                        // }
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
