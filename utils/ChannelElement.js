class ChannelElement {
    constructor(response) {
            this.id = response.data.items[0].id;
            this.description = response.data.items[0].snippet.description;
            this.createdAt = response.data.items[0].snippet.publishedAt;
            this.liveBroadcastContent = response.data.items[0].snippet.liveBroadcastContent;
            this.createdTime = response.data.items[0].snippet.publishedTime;
            this.defaultThumbnail = response.data.items[0].snippet.thumbnails.default.url;
            this.mediumThumbnail = response.data.items[0].snippet.thumbnails.medium.url;
            this.highThumbnail = response.data.items[0].snippet.thumbnails.high.url;
            this.title = response.data.items[0].snippet.title;
            this.url = `https://www.youtube.com/playlist?list=${this.id}`;
            this.country = response.data.items[0].snippet.country;
            this.viewCount = response.data.items[0].statistics.viewCount;
            this.subscriberCount = response.data.items[0].statistics.subscriberCount;
    };
};

module.exports = ChannelElement;
