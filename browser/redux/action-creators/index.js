import { push, replace } from 'react-router-redux';
import firedux, { firebaseApp } from '../store/firedux';
import { SET_VOLUME_DATA, SET_PITCH_DATA, SET_SEMITONE_DATA } from '../constants';
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
	window.location.pathname = `/${sessionKey}/feedback`;
};

export const updateData = (loudness, monotonyBool) => dispatch => {
	firedux.update('speechData', {
		pitch: monotonyBool,
		loudness,
	});
};

export const addVolumeMetricData = volumeDataArr => dispatch => {
	firedux.update('speechData', {
		volumeDataArr
	})
}

export const addPitchMetricData = pitchDataArr => dispatch => {
	firedux.update('speechData', {
		pitchDataArr
	})
}

export const addSemitoneMetricData = semitoneDataArr => dispatch => {
	firedux.update('speechData', {
		semitoneDataArr
	})
}

// export const addVolumeMetricData = volumeDataArr => {
// 	return {
// 		type: SET_VOLUME_DATA,
// 		volumeDataArr
// 	}
// }

// export const addPitchMetricData = pitchDataArr => {
// 	return {
// 		type: SET_PITCH_DATA,
// 		pitchDataArr
// 	}
// }

// export const addSemitoneMetricData = semitoneDataArr => {
// 	return {
// 		type: SET_SEMITONE_DATA,
// 		semitoneDataArr
// 	}
// }
