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
const config = require("./config");
const player = require("./players/" + config.player);

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
        albumArt: " ",
        completed: 0,
        playing: true
      }
   }

    getSongInfo = () => {
      if (player.title !== this.state.songTitle || player.artist !== this.state.songArtist) {
        this.setState({songTitle: player.title, songArtist: player.artist});
      }
      if (player.albumArt !== this.state.albumArt) {
        this.setState({albumArt: player.albumArt});
      }
      if (player.completed !== this.state.completed) {
        this.setState({completed: player.completed});
      }
      if (player.playing !== this.state.playing) {
        this.setState({playing: player.playing});
      }
    }


    componentDidMount = () => {
      setInterval(() => { this.getSongInfo(); }, 500)
    }

    render = () => {
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