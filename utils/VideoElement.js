class VideoElement {
    constructor(response) {
		this.title = response.data.items[0].snippet.title;
        this.id = response.data.items[0].id.videoId;
        this.channelTitle = response.data.items[0].snippet.channelTitle;
        this.description = response.data.items[0].snippet.description;
        this.publishedAt = response.data.items[0].snippet.publishedAt;
        this.publishedTime = response.data.items[0].snippet.publishedTime;
        this.channelId = response.data.items[0].snippet.channelId;
        this.liveBroadcastContent = response.data.items[0].snippet.liveBroadcastContent;
        this.defaultThumbnail = response.data.items[0].snippet.thumbnails.default.url;
        this.mediumThumbnail = response.data.items[0].snippet.thumbnails.medium.url;
        this.highThumbnail = response.data.items[0].snippet.thumbnails.high.url;
        this.url = `https://www.youtube.com/watch?v=${this.id}`;
    };
};

module.exports = VideoElement;
