import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { MyRaisedButton, SelectField } from '../uiElements';
import styles from './styles';

export default class FeedbackForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      device: '',
      rating: '',
      realistic: '',
      volumehelpful: '',
      overall: '',
      addtl: '',
      usability: '',
      design: '',
      wouldusefuture: '',
      wouldusepresent: '',
      mostwanted: '',
      performance: '',
    };
  }

  handleChange = field => event => {
    const value = event.target.value;

    this.setState({
      [`${field}`]: value
    })
  }

  handleSubmit = event => {
    event.preventDefault();
    this.props.submitFeedback({
      device: this.state.device,
      rating: this.state.rating,
      performance: this.state.performance,
      realistic: this.state.realistic,
      volumehelpful: this.state.volumehelpful,
      overall: this.state.overall,
      addtl: this.state.addtl,
      usability: this.state.usability,
      design: this.state.design,
      wouldusefuture: this.state.wouldusefuture,
      wouldusepresent: this.state.wouldusepresent,
      mostwanted: this.state.mostwanted
    });
  }

  handleSelectChange = field => (event, index, value) => this.setState({
    [`${field}`]: value
  });

  render() {
    return (
      <div>
        <h3 style={styles.title}><strong>Thanks for trying out StagedFright!</strong></h3>
        <h4>Tell us what your experience was like by filling out the short form below.  
        </h4>
        <div style={styles.container}>
          <form onSubmit={this.handleSubmit}>
            <br />
            <SelectField 
              value={this.state.device}
              handleChange={this.handleSelectChange('device')}
              label={'What device did you use to test StagedFright?'}
              opt1={'A VR-enabled mobile device'}
              opt2={'A desktop browser'}
              opt3={'Both!'}
            />        
            <br />            
            <SelectField 
              value={this.state.performance}
              handleChange={this.handleSelectChange('performance')}
              label={'Did you experience any performance-related issues (e.g. lag, visual artifacts) when testing StagedFright?'}
              opt1={'Yes'}
              opt2={'No'}
            />        
            <br />
            <h3>If you experienced any performance/device compatibility issues when using StagedFright, please let us know your device/browser, and the nature of the issues experienced, in the 'additional comments' section below. 
            </h3>
            <br/>
            <SelectField 
              value={this.state.usability}
              handleChange={this.handleSelectChange('usability')}
              label={'How easy was it to use StagedFright? (1 = like taking candy from a baby; 5 = like Theseus slaying the Minotaur)'}
              opt1={'1'}
              opt2={'2'}
              opt3={'3'}
              opt4={'4'}
              opt5={'5'}
            />
            <br />        
            <SelectField 
              value={this.state.design}
              handleChange={this.handleSelectChange('design')}
              label={`How would you rate the visual design/appeal of StagedFright's user interface? (1 = eyesore; 5 = eye candy)` }
              opt1={'1'}
              opt2={'2'}
              opt3={'3'}
              opt4={'4'}
              opt5={'5'}
            />
            <br />           
            <SelectField 
              value={this.state.wouldusepresent}
              handleChange={this.handleSelectChange('wouldusepresent')}
              label={`How likely are you to use StagedFright, if it remains in its current form? (1 = not at all likely; 5 = very likely)` }
              opt1={'1'}
              opt2={'2'}
              opt3={'3'}
              opt4={'4'}
              opt5={'5'}
            />
            <br />           
            <TextField
              id="realistic-field-controlled"
              floatingLabelText="What aspects of StagedFright were most faithful to the experience of actual public speaking?"
              value={this.state.realistic}
              multiLine={true}
              rows={3}
              onChange={this.handleChange('realistic')}
            />
            <br />        
            <TextField
              id="volumehelpful-field-controlled"
              floatingLabelText="Was the speech volume feedback intelligible/helpful?"
              value={this.state.volumehelpful}
              onChange={this.handleChange('volumehelpful')}
            />
            <br />    
            <SelectField 
              value={this.state.mostwanted}
              handleChange={this.handleSelectChange('mostwanted')}
              label={`Which of the following features would you most like to see added to StagedFright? (If you feel very strongly about more than one feature, please tell us in the 'additional comments' section below!)` }
              opt1={'Real-time pitch feedback (i.e. whether I am speaking too monotonously)'}
              opt2={'Real-time enunciation feedback (i.e. whether I am speaking clearly)'}
              opt3={'Analysis/data visualization of your performance after each practice session'}
              opt4={'Ability to control (e.g. pause, skip, rewind text scrolling) teleprompter/recording during practice'}
              opt5={'Ability to create an account and view your practice history/track performance over time'}              
              opt6={'Additional settings to speak in/audiences to speak to'}              
              opt7={`Ability to invite others to 'join the audience' and listen to your speech practice in real-time`}
            />
            <br />         
            <TextField
              id="overall-field-controlled"
              floatingLabelText="Do you have any suggestions for improvements/enhancements you'd like to see?"
              multiLine={true}
              rows={3}
              value={this.state.overall}
              onChange={this.handleChange('overall')}
            />
            <br/>
            <SelectField 
              value={this.state.wouldusefuture}
              handleChange={this.handleSelectChange('wouldusefuture')}
              label={`How likely are you to use StagedFright if improvements, such as the one(s) you suggested, are implemented? (1 = not at all likely; 5 = very likely)` }
              opt1={'1'}
              opt2={'2'}
              opt3={'3'}
              opt4={'4'}
              opt5={'5'}
            />
            <br />             
            <SelectField 
              value={this.state.rating}
              handleChange={this.handleSelectChange('rating')}
              label={'How would you rate your overall experience with StagedFright? (1 = waste of time; 5 = made my day)'}
              opt1={'1'}
              opt2={'2'}
              opt3={'3'}
              opt4={'4'}
              opt5={'5'}
            />
            <br /> 
            <TextField
              id="addtl-field-controlled"
              floatingLabelText="Any additional feedback/concerns? (Also feel free to address to Jola/Harmony/Julie/Christine in person!"
              multiLine={true}
              rows={5}
              value={this.state.addtl}
              onChange={this.handleChange('addtl')}
            />
            <br/>
            <h3>Thanks for your feedback! Click the button below to submit and be returned to the StagedFright homepage.
            </h3>
            <MyRaisedButton/>
          </form>
        </div>
      </div>
    );
  }
}
