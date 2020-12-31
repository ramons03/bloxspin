class ChannelElement {
    constructor(response) {
            this.id = response.data.items[0].id.channelId;
            this.description = response.data.items[0].snippet.description;
            this.createdAt = response.data.items[0].snippet.publishedAt;
            this.liveBroadcastContent = response.data.items[0].snippet.liveBroadcastContent;
            this.createdTime = response.data.items[0].snippet.publishedTime;
            this.defaultThumbnail = response.data.items[0].snippet.thumbnails.default.url;
            this.mediumThumbnail = response.data.items[0].snippet.thumbnails.medium.url;
            this.highThumbnail = response.data.items[0].snippet.thumbnails.high.url;
            this.title = response.data.items[0].snippet.channelTitle;
            this.url = `https://www.youtube.com/playlist?list=${this.id}`;
    };
};

module.exports = ChannelElement;
