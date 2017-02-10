import { push, replace } from 'react-router-redux';
import firedux, { firebaseApp } from '../store/firedux';
const sessionKey = firedux.ref.key;

export const submitSpeechData = fields => dispatch => {
  firedux.set('speechData', fields)
  .then(dispatch(push(`/${sessionKey}/choose-view`)));
};

export const populatePremadeSpeech = id => dispatch => {
	firebaseApp.database().ref(`sessions/${id}`)
	.once('value', (value) => {
		const { speechLines, wpm } = value.val().speechData;
		firedux.set('speechData', { speechLines, wpm })
		.then(dispatch(push(`/${sessionKey}/new-speech`)));
	});
};

export const sendFeedback = fields => dispatch => {
  firedux.push('speechData/feedback', fields);
};

export const finishRecording = dispatch => {
	//redirects instead of a push as a way to get over component mounting scroll problems
	dispatch(push(`/${sessionKey}/feedback`));
};

export const updateData = (loudness, monotonyBool) => dispatch => {
	firedux.update('speechData', {
		pitch: monotonyBool,
		loudness,
	});
};

export const startRecording = dispatch => {
	firedux.update('speechData', {
		recording: true,
	});
};

export const stopRecording = dispatch => {
	firedux.update('speechData', {
		recording: false,
	});
};
