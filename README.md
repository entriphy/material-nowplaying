# Material Now Playing
Stream overlay for displaying the current song

![material-nowplaying img](https://github.com/evilarceus/material-nowplaying/raw/master/public/overlay.png)

## Usage
### To start:
* If you haven't already, check the "Enable JSON API" checkbox under Desktop Settings > General in GPMDP (if that's the player you're using)

1. In a terminal session:
```bash
$ git clone https://github.com/evilarceus/material-nowplaying
$ cd material-nowplaying
$ npm install
$ npm start
```

* Make sure to change the player to the one you want to use in src/config.js (line 2):
```
player: '<player>',
```
* The currently valid options are: ```gpmdp``` ([Google Play Music Desktop Player](https://github.com/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-)) and ```spotify``` (Spotify)

2. In your streaming software (preferably OBS Studio), add a browser source that links to ```http://localhost:3000```.
