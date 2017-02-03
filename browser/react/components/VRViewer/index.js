import React, { Component } from 'react';
import styles from './styles';
import InitialLoading from '../InitialLoading';
import DesktopVRView from '../DesktopVRView';
import {speech} from '../../../../public/speech-line-test-data.js';
import { SoundMeter } from './utils/loudness';

export default class VRViewer extends Component {

  constructor(props) {
    super(props);
    // console.log("PROPS", props);
    this.state = {
      scrollOffset: 0, 
      time: window.performance.now(),
      loading: true,
      loudness: 0,
    }
    this.startRecording = this.startRecording.bind(this);
    // this.streamToStore = this.streamToStore.bind(this);
    this.speechLines = props.speechLines.map((line, idx) => ({
      line, idx, position: [0.28, idx, -0.26]
      }))
  }

  startRecording() {
    navigator.mediaDevices.getUserMedia = (navigator.mediaDevices.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);

    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var source;
    var stream;

    var analyser = audioCtx.createAnalyser();
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.85;

    if (navigator.mediaDevices.getUserMedia) {
       navigator.mediaDevices.getUserMedia({ audio: true })
       .then((stream) => {
          this.stream = stream
          var soundMeter = window.soundMeter = new SoundMeter(audioCtx);
                soundMeter.connectToSource(stream, (e) => {
                  if (e) {
                    alert(e);
                    return;
                  }
                  setInterval(() => {
                    console.log(soundMeter.instant.toFixed(2));
                    this.setState({ 
                      loudness: soundMeter.slow.toFixed(2) 
                    });
                    console.log('slow', soundMeter.slow.toFixed(2));
                    console.log(soundMeter.clip);
                  }, 200);
                });
            //connect audio context to the stream we created
             // source = audioCtx.createMediaStreamSource(stream);
             // source.connect(analyser);
             // this.streamToStore(analyser);
        })
       .catch(e => console.error('getUserMedia() failed: ' + e))
    }
  }


// streamToStore(analyser) {

//   analyser.fftSize = 2048;
//   // the AnalyserNode.frequencyBinCount value is half the fft
//   // & = how many data pts we collect for that buffer size
//   var bufferLength = analyser.frequencyBinCount;

//   // instantiate an unsigned 8-bit integer array to hold our values
//   var dataArray = new Uint8Array(bufferLength);

//   var poll = () => {
//     // loops and gets the data continuously over time
//     this.pollRafId = requestAnimationFrame(poll);

//     // fill the array with the current sine wave for the point in time polled
//     analyser.getByteTimeDomainData(dataArray);
//     //console.log(dataArray);
//   };

//   // starts the loop off; it will run continuously from here
//   poll();
// }

  componentDidMount () {
    setTimeout(() => this.setState({ loading: false }), 1500); 
    this.tick(window.performance.now());
    setTimeout(this.startRecording, 4000)
    // setTimeout(this.props.showSummary, 8000)
  }

  componentWillUnmount () {
    cancelAnimationFrame(this.pollRafId);
    cancelAnimationFrame(this.tickRafId)
    this.stream && this.stream.getAudioTracks().forEach(track => track.stop())
    soundMeter.stop();
  }

  componentWillReceiveProps () {
    //update speechLines prop  
  }

  tick = time => {
    const dt = time - this.state.time
    //wpm modifies coefficient multiplying scrollOffset + dt
    const scrollOffset = this.state.scrollOffset + 0.0005 * dt
    this.setState({ time, scrollOffset })
    this.tickRafId = requestAnimationFrame(this.tick)
  }
  //make it so scrollOffset is directly comparable to idx and lines 
  //scrolloffset - if it is > # lines - exit scene 

  render () {
    const { handleSubmit, isInitialized } = this.props;
    const { scrollOffset, loading } = this.state
    const scene = document.querySelector('a-scene');

    if (navigator.userAgent.match('Mobi')) {
      if (loading) {
        return <InitialLoading />;
      } else return (
        <div>
          <a-scene>
            <a-assets>
              <video muted id="mvp" autoPlay loop src="/DT_RNC.mp4" />
            </a-assets>
            <a-videosphere src="#mvp"></a-videosphere>
            <a-entity position="0 0 3.8">
              <a-camera>
              </a-camera>
            </a-entity>
            {
              this.speechLines
              .filter(({ position: [x, y, z] }) => y > scrollOffset - 1 && y < scrollOffset - 5)
              .map(({ line, position, idx }) =>
                <a-entity key={ idx } 
                position={ position.join(' ') } 
                geometry="primitive: plane; width: 100" 
                material="side: double; transparent: true; opacity: 0; color: #EF2D5E" /*scale="5 5 5"*/ 
                text={`value: ${line}; line-height: 30px; anchor: center; wrapCount: 1000; align: center;`} />
              )
            }
          </a-scene>
        </div>
      );
    } else return <DesktopVRView />
  }
}

VRViewer.defaultProps = {
  handleSubmit: () => {
    console.log('Still fetching dispatch from server...');
  }
};

VRViewer.propTypes = {
  welcomeText: React.PropTypes.string,
  handleSubmit: React.PropTypes.func
};
