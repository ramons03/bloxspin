const config = require("./config.json");
const axios = require('axios');
const ChannelElement = require('./utils/ChannelElement');

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
        console.log('items[0]:', response.data.items[0]);
        return new ChannelElement(response);
    } catch (error) {
        //throw new Error('An error occurred while retrieving the channel.');
        console.log('error', error);
        return {};
    };
}
var querystringparam = 'UCxS0-JuB0vPrkV54bUAuoIg';
buscarCanal(querystringparam).then(channel => {
    console.log(channel);
    console.log(channel.id);
    console.log(channel.title);
    console.log(channel.description);
});

