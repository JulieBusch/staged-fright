import NewSpeechForm from '../components/NewSpeechForm';
import { connect } from 'react-redux';
import { setSpeechData } from '../../redux/action-creators';

const mapStateToProps = state => ({
  wpm: state.get('wpm'),
  speechText: state.get('speechText')
});

const mapDispatchToProps = dispatch => ({
  handleSubmit: (evt) => {
    evt.preventDefault();
    dispatch(setSpeechData(evt.target.textField.value));
    evt.target.textField.value = '';
  },

  	onChange: (evt) => {
		console.log('onChange!')
		console.log(evt);
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(NewSpeechForm);
