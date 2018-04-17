const BrowserWebSocket = require("browser-websocket");
let ws = new BrowserWebSocket("ws://localhost:5673");
let data, channel, payload;

ws.on("open", () => {console.log("[Spotify] WebSocket connected successfully!"); ws.emit("status")  })
ws.on("error", (err) => { console.log(err) });
ws.on("close", (event) => { console.log(event) });
ws.on("message", (event) => {
  data = JSON.parse(event.data)
  if (data.channel === "playState" || data.channel === "track" || data.channel === "time") {
    channel = data.channel;
    payload = data.payload;
    switch (channel) {
      case "playState":
        if (payload !== module.exports.playing) module.exports.playing = payload;
        break;
      case "track":
        if (payload.title === module.exports.title && payload.artist === module.exports.artist && payload.albumArt === module.exports.albumArt) return;
        module.exports.title = payload.title;
        if (module.exports.title.length > 24) module.exports.title = module.exports.title.substring(0, 21) + "...";
        module.exports.artist = payload.artist;
        module.exports.albumArt = payload.albumArt;
        break;
      case "time":
        if ((payload.current > module.exports.completed/100 * payload.total + 1000) || (payload.current/payload.total < module.exports.completed/100)) {
          module.exports.completed = (payload.current / payload.total)*100
        }
        break;
      default:
        break;
    }
}});

window.onbeforeunload = (e) => {
    if (ws.ws.readyState === 1) { ws.close(); }
};

module.exports = {
  title: "Connecting to Spotify...",
  artist: " ",
  albumArt: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2000px-Spotify_logo_without_text.svg.png",
  completed: 0,
  playing: true
}
