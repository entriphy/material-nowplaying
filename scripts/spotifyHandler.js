const SpotifyWebHelper = require("spotify-web-helper");
const helper = SpotifyWebHelper();
const events = require("events");
const eventEmitter = new events.EventEmitter();
const request = require("request");
let status;

helper.player.on("error", err => {
    console.log(err);
})

function getAlbumCover(id, cb) {
    let host = 'https://open.spotify.com';
    let path = "/oembed?url=" + id;
    request(host + path, function(err, response, body) {
        if (err) return console.log(err);
        cb(JSON.parse(body).thumbnail_url);
    });
};

function _emitStatus() {
    status.playing ? eventEmitter.emit("play") : eventEmitter.emit("pause");
    getAlbumCover(status.track.album_resource.uri, (albumArt) => {
        status.track.albumArt = albumArt;
        eventEmitter.emit("track", status.track);
    })
}

helper.player.on("ready", () => {
    console.log("Connected to Spotify client!");
    
    helper.player.on("play", () => {
        eventEmitter.emit("play");
    });
    helper.player.on("pause", () => {
        eventEmitter.emit("pause");
    });
    helper.player.on("track-will-change", (track) => {
        getAlbumCover(track.album_resource.uri, (albumArt) => {
            track.albumArt = albumArt;
            status = helper.status;
            eventEmitter.emit("track", track);
        })
    })

    setInterval(() => {
        let time = {
            currentTime: helper.status.playing_position * 1000,
            totalTime: helper.status.track.length * 1000
        }
        eventEmitter.emit("time", time);
    }, 100)
})

module.exports.handler = eventEmitter;
module.exports.emitStatus = _emitStatus;
