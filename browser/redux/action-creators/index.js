import { push, replace } from 'react-router-redux';
import firedux, { firebaseApp } from '../store/firedux';
import { SET_VOLUME_DATA, SET_PITCH_DATA, SET_SEMITONE_DATA } from '../constants';
const sessionKey = firedux.ref.key;

const goToSummary = dispatch => {
	dispatch(push(`/${sessionKey}/feedback`));
};

const goToChooseView = dispatch => {
	dispatch(push(`/${sessionKey}/choose-view`));
};

const goToNewSpeech = dispatch => {
	dispatch(push(`/${sessionKey}/new-speech`));
};

export const submitSpeechData = fields => dispatch => {
  firedux.set('speechData', fields)
  .then(dispatch(goToChooseView));
};

export const populatePremadeSpeech = id => dispatch => {
	firebaseApp.database().ref(`sessions/${id}`)
	.once('value', (value) => {
		const { speechLines, wpm } = value.val().speechData;
		firedux.set('speechData', { speechLines, wpm })
		.then(dispatch(goToNewSpeech));
	});
};

export const sendFeedback = fields => dispatch => {
  firedux.push('speechData/feedback', fields);
};

export const updateData = (loudness, monotonyBool) => dispatch => {
	firedux.update('speechData', {
		pitch: monotonyBool,
		loudness
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
	})
	.then(dispatch(goToSummary));
};

export const addVolumeMetricData = volumeDataArr => dispatch => {
	console.log('we made it inside addVolumeMetricData!');
	firedux.update('speechData', {
		volumeDataArr
	})
};

export const addPitchMetricData = pitchDataArr => dispatch => {
	console.log('we made it inside addPitchMetricData!');
	firedux.update('speechData', {
		pitchDataArr
	})
};

export const addSemitoneMetricData = semitoneDataArr => dispatch => {
	console.log('we made it inside addSemitoneMetricData!');
	firedux.update('speechData', {
		semitoneDataArr
	})
};
