import math from 'mathjs';

//VOLUME STUFF
//TO DO: refactor soundMeter code to ES6
var SoundMeter = function(context) {
  this.context = context;
  this.instant = 0.0;
  this.slow = 0.0;
  this.clip = 0.0;
  this.script = context.createScriptProcessor(2048, 1, 1);
  var that = this;
  this.script.onaudioprocess = function(event) {
    var input = event.inputBuffer.getChannelData(0);
    var i;
    var sum = 0.0;
    var clipcount = 0;
    for (i = 0; i < input.length; ++i) {
      sum += input[i] * input[i];
      if (Math.abs(input[i]) > 0.99) {
        clipcount += 1;
      }
    }
    that.instant = Math.sqrt(sum / input.length);
    that.slow = 0.95 * that.slow + 0.05 * that.instant;
    that.clip = clipcount / input.length;
  };
}

SoundMeter.prototype.connectToSource = function(stream, callback) {
  try {
    this.mic = this.context.createMediaStreamSource(stream);
    this.mic.connect(this.script);
    // necessary to make sample run, but should not be.
    this.script.connect(this.context.destination);
    if (typeof callback !== 'undefined') {
      callback(null);
    }
  } catch (e) {
    console.error(e);
    if (typeof callback !== 'undefined') {
      callback(e);
    }
  }
};
SoundMeter.prototype.stop = function() {
  this.mic.disconnect();
  this.script.disconnect();
};

//PITCH STUFF
	//The difference between two MIDI values is the semitone interval between the two notes.
	//The function stdSemitones takes the standard deviation of an array of MIDI values, which is an indicator of pitch variation. 
	const stdSemitones = (arrOfMIDI) => {
	    return arrOfMIDI.length && math.std(arrOfMIDI);
	};
	
	const freqToMIDI = (freq) => {
	    var log = Math.log(freq / 440) / Math.LN2;
	    var noteNumber = Math.round(12 * log) + 57;
	    return noteNumber;
	};

	const findFundamentalFreq = (buffer, sampleRate) => {
		// We use autocorrelation to find the fundamental frequency.

		// In order to correlate the signal with itself (hence the name of the algorithm), we will check two points 'k' frames away.
		// The autocorrelation index will be the average of these products. At the same time, we normalize the values.
		// Source: http://www.phy.mty.edu/~suits/autocorrelation.html

		// the default sample rate, depending on the hardware, is 44100Hz or 48000Hz.
		// a 'k' range between 120 and 650 covers signals ranging from ~70Hz to ~350Hz, which is just a little broader than the average frequency range for human speech (80-260Hz, per Wikipedia).
		var n = 1024, bestR = 0, bestK = -1;
		for(var k = 120; k <= 650; k++){
			var sum = 0;

			for(var i = 0; i < n; i++){
				sum += ((buffer[i] - 128) / 128) * ((buffer[i + k] - 128) / 128);
			}

			var r = sum / (n + k);

			if(r > bestR){
				bestR = r;
				bestK = k;
			}

			if(r > 0.95) {
				// Let's assume that this is good enough and stop right here
				break;
			}
		}

		if(bestR > 0.0025) {
			// The period (in frames) of the fundamental frequency is 'bestK'. Getting the frequency from there is trivial.
			var fundamentalFreq = sampleRate / bestK;
			return fundamentalFreq;
		}
		else {
			// We haven't found a good correlation
			return -1;
		}
	};

//WATSON FUNCTIONS

import recognizeMicrophone from 'watson-speech/speech-to-text/recognize-microphone';

export const resetWatson = () => {
    if (this.state.audioSource) {
      this.stopTranscription();
    }
    this.setState({ rawMessages: [], formattedMessages: [] });
}

export const stopTranscription = () => {
    //this.stream && this.stream.stop();
    console.log(this.stream);
    this.setState({ audioSource: null });
}

export const getRecognizeOptions = (extra) => {
    var keywords = this.getKeywordsArr();
    return Object.assign({
      mediaStream: this.stream,
      token: this.state.token, smart_formatting: true, // formats phone numbers, currency, etc. (server-side)
      format: true, // adds capitals, periods, and a few other things (client-side)
      model: this.state.model,
      objectMode: true,
      interim_results: true,
      continuous: true,
      word_alternatives_threshold: 0.01, // note: in normal usage, you'd probably set this a bit higher
      keywords: keywords,
      keywords_threshold: keywords.length
        ? 0.01
        : undefined, // note: in normal usage, you'd probably set this a bit higher
      timestamps: true, // set timestamps for each word - automatically turned on by speaker_labels
      speaker_labels: this.state.speakerLabels, // includes the speaker_labels in separate objects unless resultsBySpeaker is enabled
      resultsBySpeaker: this.state.speakerLabels, // combines speaker_labels and results together into single objects, making for easier transcript outputting
      speakerlessInterim: this.state.speakerLabels // allow interim results through before the speaker has been determined
    }, extra);
  }

export const streamToWatson = () => {
	this.setState({ audioSource: 'mic' });
      // The recognizeMicrophone() method is a helper method provided by the watson-speech package
      // It sets up the microphone, converts and downsamples the audio, and then transcribes it over a WebSocket connection
      // It also provides a number of optional features, some of which are enabled by default:
      //  * enables object mode by default (options.objectMode)
      //  * formats results (Capitals, periods, etc.) (options.format)
      //  * outputs the text to a DOM element - not used in this demo because it doesn't play nice with react (options.outputElement)
      //  * a few other things for backwards compatibility and sane defaults
      // In addition to this, it passes other service-level options along to the RecognizeStream that manages the actual WebSocket connection.
      this.handleStream(recognizeMicrophone(this.getRecognizeOptions()));
}

export const handleStream = (stream) => {
	    // cleanup old stream if appropriate
    // if (this.stream) {
    //   this.stream.stop();
    //   this.stream.removeAllListeners();
    //   this.stream.recognizeStream.removeAllListeners();
    // }
    this.stream = stream;
    this.captureSettings();

    // grab the formatted messages and also handle errors and such
    stream.on('data', this.handleFormattedMessage).on('end', this.handleTranscriptEnd);  //possibly eventually implement error handling for w/e 

    // when errors occur, the end event may not propagate through the helper streams.
    // However, the recognizeStream should always fire a end and close events
    stream.recognizeStream.on('end', () => {
      if (this.state.error) {
        this.handleTranscriptEnd();
      }
    });

    // grab raw messages from the debugging events for display on the JSON tab
    stream.recognizeStream
      .on('message', (frame, json) => this.handleRawdMessage({sent: false, frame, json}))
      .on('send-json', json => this.handleRawdMessage({sent: true, json}))
      .once('send-data', () => this.handleRawdMessage({
        sent: true, binary: true, data: true // discard the binary data to avoid wasting memory
      }))
      .on('close', (code, message) => this.handleRawdMessage({close: true, code, message}));

    // ['open','close','finish','end','error', 'pipe'].forEach(e => {
    //     stream.recognizeStream.on(e, console.log.bind(console, 'rs event: ', e));
    //     stream.on(e, console.log.bind(console, 'stream event: ', e));
    // });
}

export const handleRawdMessage = (msg) => {
    this.setState({rawMessages: this.state.rawMessages.concat(msg)});
}

export const handleFormattedMessage = (msg) => {
    this.setState({formattedMessages: this.state.formattedMessages.concat(msg)});
}

export const handleTranscriptEnd = () => { //connected to our shit 
    // note: this function will be called twice on a clean end,
    // but may only be called once in the event of an error
    this.setState({audioSource: null}); 
}

export const watsonTokenSetup = () => {
	this.fetchToken();
    // tokens expire after 60 minutes, so automatcally fetch a new one ever 50 minutes
    // Not sure if this will work properly if a computer goes to sleep for > 50 minutes and then wakes back up
    // react automatically binds the call to this

    this.setState({'tokenInterval' : setInterval(this.fetchToken, 50 * 60 * 1000) });
}

export const fetchToken = () => {
    return fetch('/api/token').then(res => {
      if (res.status != 200) {
        throw new Error('Error retrieving auth token');
      } 
      return res.text();
    }). // todo: throw here if non-200 status
    then(token => this.setState({ token })).catch(console.log);
}

export const handleKeywordsChange = (e) => {
    this.setState({ keywords: e.target.value });
}

export const getKeywordsArr = () => {
    return this.state.keywords.split(',').map(k => k.trim()).filter(k => k);
}

export const getFinalResults = () => {
  console.log(this.state.formattedMessages.filter(r => r.results && r.results.length && r.results[0].final));
  return this.state.formattedMessages.filter(r => r.results && r.results.length && r.results[0].final);
}

export const getCurrentInterimResult = () => {
  const r = this.state.formattedMessages[this.state.formattedMessages.length - 1];

  // When resultsBySpeaker is enabled, each msg.results array may contain multiple results. However, all results
  // in a given message will be either final or interim, so just checking the first one still works here.
  if (!r || !r.results || !r.results.length || r.results[0].final) {
    return null;
  }
  return r;
}

export const getFinalAndLatestInterimResult = () => {
  const final = this.getFinalResults();
  const interim = this.getCurrentInterimResult();
  if (interim) {
    final.push(interim);
  }
  return final;
}

export { findFundamentalFreq, freqToMIDI, stdSemitones, SoundMeter };
