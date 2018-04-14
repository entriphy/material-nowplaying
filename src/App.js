import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createMuiTheme } from 'material-ui/styles';
import Card, { CardContent, CardMedia } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from "@material-ui/icons/Pause"
import SkipNextIcon from '@material-ui/icons/SkipNext';
import {LinearProgress} from "material-ui/Progress"
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const BrowserWebSocket = require("browser-websocket");
let ws = new BrowserWebSocket("ws://localhost:5672");
let data, channel, payload, _artist, _title, _albumArt, _completed = 0, _playing = true;

ws.on("open", () => {console.log("WebSocket")})
ws.on("error", (err) => { console.log(err) });
ws.on("close", (event) => { console.log(event) });
ws.on("message", (event) => {
  data = JSON.parse(event.data)
  if (data.channel === "playState" || data.channel === "track" || data.channel === "time") {
    channel = data.channel;
    payload = data.payload;
    switch (channel) {
      case "playState":
        if (payload !== _playing) payload = _playing;
        break;
      case "track":
        console.log(payload.title, payload.artist, payload.albumArt)
        if (payload.title === _title && payload.artist === _artist && payload.albumArt === _albumArt) return;
        _title = payload.title;
        if (_title.length > 24) _title = _title.substring(0, 21) + "...";
        _artist = payload.artist;
        _albumArt = payload.albumArt;
        break;
      case "time":
        // if (payload.current < 1000 || payload.total < 1000) return;
        if ((payload.current > _completed/100 * payload.total + 1000) || (payload.current/payload.total < _completed/100)) {
          _completed = (payload.current / payload.total)*100
        }
        break;
      default:
        break;
    }
}})

const colorTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#2196f3"
    }
  }
})

const styles = theme => ({
  card: {
    display: 'inline-flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',

  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
    height: 151
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  title: {
    width: 281
  }
});

class MediaControlCard extends React.Component {
  constructor(props) {
      super(props);
      
      this.state = {
        songTitle: "[Song] Loading...",
        songArtist: "[Artist] Loading...",
        albumArt: "https://i.pinimg.com/originals/84/94/17/8494171e26ec282b89b07e64defcf4e0.png",
        completed: 0,
        playing: true
      }
   }

    getSongInfo = () => {
      if (_title !== this.state.songTitle || _artist !== this.state.songArtist) {
        this.setState({songTitle: _title, songArtist: _artist});
      }
      if (_albumArt !== this.state.albumArt) {
        this.setState({albumArt: _albumArt});
      }
      if (_completed !== this.state.completed) {
        this.setState({completed: _completed});
      }
      if (_playing !== this.state.playing) {
        this.setState({playing: _playing});
      }
    }


      

    render = () => {
      setInterval(this.getSongInfo, 500);
      const {classes, theme} = this.props;

      return(
        <div>
          <MuiThemeProvider theme={colorTheme}>
          <Card className={classes.card}>
            <div className={classes.details}>
              <CardContent className={classes.content}>
                <Typography variant="headline" className={classes.title}>
                  {this.state.songTitle}
                </Typography>
                <Typography variant="subheading" color="textSecondary">
                  {this.state.songArtist}
                </Typography>
              </CardContent>
              <div className={classes.controls}>
                <IconButton aria-label="Previous">
                  {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
                </IconButton>
                <IconButton aria-label="Play/pause">
                  {this.state.playing ? <PauseIcon className={classes.playIcon}/> : <PlayArrowIcon className={classes.playIcon}/>}
                </IconButton>
                <IconButton aria-label="Next">
                  {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
                </IconButton>
              </div>
              <LinearProgress color="primary" variant="determinate" value={this.state.completed} />
            </div>
            <CardMedia
             className={classes.cover}
              image={this.state.albumArt}
              title="Album"
            />
          </Card>
          </MuiThemeProvider>
        </div>
      )
    }
  }

MediaControlCard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(MediaControlCard);