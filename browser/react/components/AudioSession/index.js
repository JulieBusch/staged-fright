import React, { Component } from 'react';
import {
    stdSemitones,
    freqToMIDI,
    findFundamentalFreq,
    SoundMeter
} from './utils';
import recognizeMicrophone from 'watson-speech/speech-to-text/recognize-microphone';
import 'whatwg-fetch';

class AudioSession extends Component {
    constructor(props) {
        super(props);

        this.state = {
            recording: false,
            rawMessages: [],
            formattedMessages: [],
            audioSource: null,
            speakerLabels: false,
        }

        this.meterInterval = null;
        this.pitchInterval = null;

        this.pitchRafId = null;
        this.pitch = props.pitch || false;

        //an array of pitch measures, in MIDI values. Stores up to ten seconds' worth of data at once.
        this.pitchDataPoints = [ 40 ];

    }

    startRecording = () => {
        if (navigator.userAgent.match('Mobi')) return;
        navigator.mediaDevices.getUserMedia = (navigator.mediaDevices.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia ||
          navigator.msGetUserMedia);
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        if (navigator.mediaDevices.getUserMedia) {
           navigator.mediaDevices.getUserMedia({ audio: true })
           .then((stream) => {
              this.stream = stream
            })
           .then(() => {
                this.processPitch(this.audioCtx, this.stream)
           })
           .then(() => {
                this.processVolume(this.audioCtx, this.stream)
           })
           .then(() => console.log("THIS IS THE TOKEN IN STATE ", this.state.token))
           // .then(() => this.streamToWatson(this.stream))
           .then(() => this.doWatson(this.stream))
           .catch(e => console.error('getUserMedia() failed: ' + e))
        }
        this.setState({ recording: true });
    }

    processVolume = (context, stream) => {
        console.log('processing volume!');
        var soundMeter = this.soundMeter = new SoundMeter(context);

        soundMeter.connectToSource(stream, (e) => {
            if (e) {
                alert(e);
                return;
            }
        this.meterInterval = setInterval(() => {
            console.log('syncing data!');
            //this.props.syncData(soundMeter.slow.toFixed(2), this.pitch)
        }, 200);
      });
    }

    processPitch = (context, stream) => {

        const analyserAudioNode = context.createAnalyser();
        analyserAudioNode.fftSize = 2048;

        const sourceAudioNode = context.createMediaStreamSource(stream);
        sourceAudioNode.connect(analyserAudioNode);

        const detectPitch = () => {
            console.log('detecting pitch!');

            var buffer = new Uint8Array(analyserAudioNode.fftSize);
            this.pitchDataPoints = this.pitchDataPoints.length > 249 ? this.pitchDataPoints.slice(1, 250) : this.pitchDataPoints.slice();
            //hacky workaround for extensibility error
            var bufferLength = analyserAudioNode.fftSize;
            analyserAudioNode.getByteTimeDomainData(buffer);
            var fundamentalFreq = findFundamentalFreq(buffer, context.sampleRate);
            if (fundamentalFreq !== -1) {
                this.pitchDataPoints.push(freqToMIDI(fundamentalFreq));
            } else this.pitchDataPoints.push(0);
            this.pitchRafId = window.requestAnimationFrame(detectPitch);
        };
        detectPitch();

        this.pitchInterval = setInterval(() => {
            const stdSemi = stdSemitones(this.pitchDataPoints.filter(e => e > 0));
            const monotonyBool = stdSemi < 3.5
            this.pitch = monotonyBool;
        }, 500);
    }

    stopRecording = () => {
        console.log('stopping recording!');
        cancelAnimationFrame(this.pitchRafId);
        this.stream && this.stream.getAudioTracks().forEach(track => track.stop());
        this.soundMeter.stop();
        clearInterval(this.meterInterval);
        clearInterval(this.pitchInterval);
        this.setState({ recording: false });
        clearInterval(this.state.tokenInterval);
    }

    // resetWatson = () => {
    //     if (this.state.audioSource) {
    //       this.stopTranscription();
    //     }
    //     this.setState({ rawMessages: [], formattedMessages: [] });
    // }

    // stopTranscription = () => {
    //     //this.stream && this.stream.stop();
    //     console.log(this.stream);
    //     this.setState({ audioSource: null });
    // }

    // getRecognizeOptions = (stream, extra) => {
    //     var keywords = this.getKeywordsArr();
    //     return Object.assign({
    //       mediaStream: stream,
    //       token: this.state.token,
    //       smart_formatting: true, // formats phone numbers, currency, etc. (server-side)
    //       format: true, // adds capitals, periods, and a few other things (client-side)
    //       model: this.state.model,
    //       objectMode: true,
    //       interim_results: true,
    //       continuous: true,
    //       word_alternatives_threshold: 0.01, // note: in normal usage, you'd probably set this a bit higher
    //       keywords: keywords,
    //       keywords_threshold: keywords.length
    //         ? 0.01
    //         : undefined, // note: in normal usage, you'd probably set this a bit higher
    //       timestamps: true, // set timestamps for each word - automatically turned on by speaker_labels
    //       speaker_labels: this.state.speakerLabels, // includes the speaker_labels in separate objects unless resultsBySpeaker is enabled
    //       resultsBySpeaker: this.state.speakerLabels, // combines speaker_labels and results together into single objects, making for easier transcript outputting
    //       speakerlessInterim: this.state.speakerLabels // allow interim results through before the speaker has been determined
    //     }, extra);
    //   }

    // streamToWatson = (stream) => {
    //     this.setState({ audioSource: 'mic' });
    //       // The recognizeMicrophone() method is a helper method provided by the watson-speech package
    //       // It sets up the microphone, converts and downsamples the audio, and then transcribes it over a WebSocket connection
    //       // It also provides a number of optional features, some of which are enabled by default:
    //       //  * enables object mode by default (options.objectMode)
    //       //  * formats results (Capitals, periods, etc.) (options.format)
    //       //  * outputs the text to a DOM element - not used in this demo because it doesn't play nice with react (options.outputElement)
    //       //  * a few other things for backwards compatibility and sane defaults
    //       // In addition to this, it passes other service-level options along to the RecognizeStream that manages the actual WebSocket connection.
    //       this.handleStream(recognizeMicrophone(this.getRecognizeOptions(stream)));
    // }

    // handleStream = (stream) => {
    //         // cleanup old stream if appropriate
    //     // if (this.stream) {
    //     //   this.stream.stop();
    //     //   this.stream.removeAllListeners();
    //     //   this.stream.recognizeStream.removeAllListeners();
    //     // }
    //     console.log("THIS IS THE STREAM IN handleStream ", stream);
    //     // this.watsonStream = stream;
    //     this.captureSettings();

    //     // grab the formatted messages and also handle errors and such
    //     stream.on('data', this.handleFormattedMessage).on('end', this.handleTranscriptEnd);  //possibly eventually implement error handling for w/e

    //     // when errors occur, the end event may not propagate through the helper streams.
    //     // However, the recognizeStream should always fire a end and close events
    //     stream.recognizeStream.on('end', () => {
    //         console.log('ending rec stream');
    //       if (this.state.error) {
    //         this.handleTranscriptEnd();
    //       }
    //     });

    //     // grab raw messages from the debugging events for display on the JSON tab
    //     stream.recognizeStream
    //       .on('message', (frame, json) => this.handleRawdMessage({sent: false, frame, json}))
    //       .on('send-json', json => this.handleRawdMessage({sent: true, json}))
    //       .once('send-data', () => this.handleRawdMessage({
    //         sent: true, binary: true, data: true // discard the binary data to avoid wasting memory
    //       }))
    //       .on('close', (code, message) => this.handleRawdMessage({close: true, code, message}));

    //     ['open','close','finish','end','error', 'pipe'].forEach(e => {
    //         stream.recognizeStream.on(e, console.log.bind(console, 'rs event: ', e));
    //         stream.on(e, console.log.bind(console, 'stream event: ', e));
    //     });
    // }

    handleRawdMessage = (msg) => {
        console.log(msg);

        this.setState({rawMessages: this.state.rawMessages.concat(msg)});
    }

    handleFormattedMessage = (msg) => {
        console.log(msg);

        this.setState({formattedMessages: this.state.formattedMessages.concat(msg)});
    }

    // captureSettings = () => {
    //     this.setState({
    //       settingsAtStreamStart: {
    //         model: this.state.model,
    //         keywords: this.getKeywordsArr(),
    //         speakerLabels: this.state.speakerLabels
    //       }
    //     });
    //   }

    handleTranscriptEnd = () => { //connected to our shit
        // note: this function will be called twice on a clean end,
        // but may only be called once in the event of an error
        this.setState({audioSource: null});
        console.log("WE ARE IN HANDLE TRANSCRIPT END");
    }

    // watsonTokenSetup = () => {
    //     this.fetchToken();
    //     // tokens expire after 60 minutes, so automatcally fetch a new one ever 50 minutes
    //     // Not sure if this will work properly if a computer goes to sleep for > 50 minutes and then wakes back up
    //     // react automatically binds the call to this

    //     this.setState({'tokenInterval' : setInterval(this.fetchToken, 50 * 60 * 1000) });
    // }

    // fetchToken = () => {
    //     return fetch('/api/token').then(res => {
    //       if (res.status != 200) {
    //         throw new Error('Error retrieving auth token');
    //       }
    //       return res.text();
    //     }). // todo: throw here if non-200 status
    //     then(token => this.setState({ token })).catch(console.log);
    // }

    // handleKeywordsChange = (e) => {
    //     this.setState({ keywords: e.target.value });
    // }

    // getKeywordsArr = () => {
    //     return this.state.keywords.split(',').map(k => k.trim()).filter(k => k);
    // }

    // getFinalResults = () => {
    //   console.log(this.state.formattedMessages.filter(r => r.results && r.results.length && r.results[0].final));
    //   return this.state.formattedMessages.filter(r => r.results && r.results.length && r.results[0].final);
    // }

    // getCurrentInterimResult = () => {
    //   const r = this.state.formattedMessages[this.state.formattedMessages.length - 1];

    //   // When resultsBySpeaker is enabled, each msg.results array may contain multiple results. However, all results
    //   // in a given message will be either final or interim, so just checking the first one still works here.
    //   if (!r || !r.results || !r.results.length || r.results[0].final) {
    //     return null;
    //   }
    //   return r;
    // }

    // getFinalAndLatestInterimResult = () => {
    //   const final = this.getFinalResults();
    //   const interim = this.getCurrentInterimResult();
    //   if (interim) {
    //     final.push(interim);
    //   }
    //   return final;
    // }

    doWatson = stream => 
        fetch('/api/token')
            .then((response) => {
              return response.text();
            })
            .then((token) => {
                console.log('my little token', token);
              var myStream = recognizeMicrophone({
                mediaStream: stream,
                token: token,
                continuous: true, // false = automatically stop transcription the first time a pause is detected
                objectMode: true,

              });

              myStream.on('error', function(err) {
                console.log(err);
              });

              myStream.on('data', this.handleFormattedMessage).on('end', this.handleTranscriptEnd)

            myStream.recognizeStream.on('end', () => {
              if (this.state.error) {
                this.handleTranscriptEnd();
              }
            });

            // grab raw messages from the debugging events for display on the JSON tab
            myStream.recognizeStream
              .on('message', (frame, json) => this.handleRawdMessage({sent: false, frame, json}))
              .on('send-json', json => this.handleRawdMessage({sent: true, json}))
              .once('send-data', () => this.handleRawdMessage({
                sent: true, binary: true, data: true // discard the binary data to avoid waisting memory
              }))
              .on('close', (code, message) => this.handleRawdMessage({close: true, code, message}));

            })
            .catch(function(error) {
              console.log(error);
            });

    componentDidMount() {
        // console.log('getting the token!');
        // this.watsonTokenSetup();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.recording && !this.state.recording) {
            this.startRecording();
        } else {
            if (nextProps.recording === false && this.state.recording) {
                this.stopRecording();
            }
        }
    }

    render() {
        return(<div>{ this.props.children }</div>)
    }
}

export default AudioSession;
