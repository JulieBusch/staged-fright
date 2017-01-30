import {
  CHANGE_WELCOME,
  SET_INITIALIZED,
  SET_SPEECH_DATA,
} from '../constants';
import axios from 'axios';

const createWelcomeText = (text) => ({ 
  type: CHANGE_WELCOME, 
  welcomeText: text 
});
const createInitialized = () => ({ 
  type: SET_INITIALIZED 
});

export const setSpeechData = ({ wpm, speechLines }) => ({ type: SET_SPEECH_DATA, 
  wpm, 
  speechLines 
});

// Used by the front end to live change the welcomeText.
export const changeWelcomeText = text => dispatch => {
  axios.put('/api/sessions', {welcomeText: text})
    .then(() => {
      dispatch(createWelcomeText(text));
    })
    .catch(() => {
      console.log('Changing Welcome Text Failed.');
    });
};

// This function is run by sockets after they've initialized a user.
export const fetchWelcomeText = () => dispatch => {
  // Fetch the recently reset session information.
  axios.get('/api/sessions')
    .then(res => {
      return res.data;
    })
    // Now reset the data.
    .then(({ session }) => {
      if (session.welcomeText) {
        dispatch(createWelcomeText(session.welcomeText));
        dispatch(createInitialized());
      } else {
        console.log('No previous welcome text.');
        dispatch(createInitialized());
      }
    })
    .catch(() => {
      console.log('Fetching Welcome Text Failed.');
    });
};
