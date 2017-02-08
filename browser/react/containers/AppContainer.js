import VRViewer from '../components/VRViewer';
import { connect } from 'react-redux';
import { finishRecording, updateData } from '../../redux/action-creators';

const mapStateToProps = state => ({
  speechLines: state.get('data').speechData.speechLines,
  wpm: state.get('data').speechData.wpm,
  loudness: state.get('data').speechData.loudness,
  pitch: state.get('data').speechData.pitch,
});

const mapDispatchToProps = dispatch => ({
  showSummary: () => {
    dispatch(finishRecording);
  }, 

  syncData: (loudness, monotonyBool) => {
    dispatch(updateData(loudness, monotonyBool));
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(VRViewer);