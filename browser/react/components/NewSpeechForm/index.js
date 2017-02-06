import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { MyPracticeButton } from '../uiElements';
import { teal300 } from 'material-ui/styles/colors';

export default class NewSpeechForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      wpm: props.wpm,
      speechText: props.speechLines,
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
    this.props.submitSpeechDataForm({
      wpm: this.state.wpm,
      speechText: this.state.speechText
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col s12" style={{backgroundColor: teal300 }} >
                <h4>
                  <span className='flow-text' style={{color: '#FFFFFF'}}>
                    Please customize your speech information below, and then click the button to start practicing! 
                  </span>
                </h4>
          </div>
          <div className="col s6">
            <form onSubmit={this.handleSubmit}>
              <TextField
                id="wpm-field-controlled"
                floatingLabelText="Words per minute (average is 110-150)"
                type="number"
                fullWidth={true}
                value={this.state.wpm}
                onChange={this.handleChange('wpm')}
              />
              <br />
              <TextField
                id="speechtext-field-controlled"
                floatingLabelText="Speech text"
                multiLine={true}
                rows={15}
                fullWidth={true}
                value={this.state.speechText}
                onChange={this.handleChange('speechText')}
              />
              <br />
              <MyPracticeButton />
            </form>
          </div>
          <div className="col s6">
            <img src="/speech-writer.gif" style={{ width: '100%', padding: '4.8vw 0vw 2vw 2vw' }}/>
          </div>
        </div>
      </div>
    );
  }
}
