const BrowserWebSocket = require("browser-websocket");
let ws = new BrowserWebSocket("ws://localhost:5672");
let data, channel, payload;

ws.on("open", () => {console.log("[GPMDP] WebSocket connected successfully!")})
ws.on("error", (err) => { 
  console.error(err); 
  module.exports.title = "Not connected";
  module.exports.artist = "Please refer to the README on GitHub for instructions."
});
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
        // if (payload.current < 1000 || payload.total < 1000) return;
        if ((payload.current > module.exports.completed/100 * payload.total + 1000) || (payload.current/payload.total < module.exports.completed/100)) {
          module.exports.completed = (payload.current / payload.total)*100
        }
        break;
      default:
        break;
    }
}});

module.exports = {
  title: "Connecting to GPMDP...",
  artist: " ",
  albumArt: "https://i.pinimg.com/originals/84/94/17/8494171e26ec282b89b07e64defcf4e0.png",
  completed: 0,
  playing: true
}
