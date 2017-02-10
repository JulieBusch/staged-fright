import AudioSession from '../components/AudioSession';
import { connect } from 'react-redux';
import { updateData } from '../../redux/action-creators';
import { addVolumeMetricData, addPitchMetricData, addSemitoneMetricData } from '../../redux/action-creators';

const mapStateToProps = state => ({
  pitch: state.get('data').speechData
    ? state.get('data').speechData.pitch
    : false,
  recording: state.get('data').speechData
    ? state.get('data').speechData.recording
    : false
});

const mapDispatchToProps = dispatch => ({
  syncData: (loudness, monotonyBool) => {
    dispatch(updateData(loudness, monotonyBool));
  },
  syncVolumeData: (volumeDataArr) => {
    dispatch(addVolumeMetricData(volumeDataArr));
  },
  syncPitchData: (pitchDataArr) => {
    dispatch(addPitchMetricData(pitchDataArr));
  },
  syncSemitoneData: (semiDataArr) => {
    dispatch(addSemitoneMetricData(semiDataArr));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioSession);
