import React, { Component } from 'react';
import { Link } from 'react-router';
import HelpHint from '../HelpHint';
import HelpNote from '../HelpNote';
import HowTo from '../HowTo';
import styles from './styles';
import { teal300 } from 'material-ui/styles/colors';

import { VRButton } from '../uiElements';

class ViewChoice extends Component {
    constructor(props) {
        super(props);

        this.state = { showHint: false}

        this.onHint = this.onHint.bind(this);
    }

    onHint() {
        this.setState({ showHint: true});
    }

    handleClick() {
        dispatch(stopRecording);
        // stops recording and moves to summary page
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col s12" style={{backgroundColor: teal300 }} >
                        <h4 className="center" style={styles.center}>
                          <span style={{color: '#FFFFFF'}}>
                            Welcome to StagedFright's VR speech practice mode!
                          </span>
                        </h4>
                    </div>

                    <div className="row padded" style={styles.padded}>
                        <div className="col s12">
                            <h4 className="center" style={styles.center}>First Time User?</h4>
                            <p className="center" style={styles.center}>Click the button below to view helpful hints</p>
                            <div className="col s4">
                            </div>
                            <div className="col s4" onClick={this.onHint} >
                                <VRButton label={"Hint"} color={teal300} type={"submit"} />
                            </div>
                            <div className="col s4">
                            </div>

                        </div>
                        <div className="col s12">
                            { this.state.showHint ? <HowTo /> : null }
                        </div>
                    </div>

                    <div className="col s6">
                        <div className="padded" style={styles.padded}>
                            <h4 className="center" style={styles.center}>Continue on Mobile</h4>
                            <ul className="list" style={styles.list}>
                                <li className="list" style={styles.list}>Allow microphone access on your desktop browser.</li>
                                <li className="list" style={styles.list}>Navigate to the following URL on your VR-enabled mobile device:</li>
                            </ul>
                            <p style={{fontSize: '18px'}}><strong>{window.location.href.replace(/choose-view/, "practice")}</strong></p>
                            <br/>
                            <p style={{fontSize: '14px'}}>Click the button below once you are done in mobile VR</p>
                            <br/>
                            <Link to={`/${this.props.params.sessionKey}/feedback`}>
                                <VRButton label={"Done with VR"} color={teal300} type={"submit"} onClick={this.handleClick} />
                            </Link>
                            <HelpNote />
                        </div>
                    </div>
                    <div className="col s6">
                        <div className="padded" style={styles.padded}>
                            <h4 className="center" style={styles.center}>Continue on Desktop</h4>
                            <ul>
                                <li className="list" style={styles.list}>Allow microphone access on your desktop browser.</li>
                                <li className="list" style={styles.list}>Click the button below to enter VR view:</li>
                            </ul>
                            <div>
                                <br/>
                                <Link to={`/${this.props.params.sessionKey}/practice`}>
                                    <VRButton label={"Continue"} color={teal300} type={"submit"} />
                                </Link>
                                <br/>
                                <br/>
                            </div>
                            <HelpHint />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ViewChoice;
