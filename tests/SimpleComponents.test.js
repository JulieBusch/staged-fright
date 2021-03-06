import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import HelpHint from '../src/browser/react/components/HelpHint';
import HelpNote from '../src/browser/react/components/HelpNote';
import HowTo from '../src/browser/react/components/HowTo';

describe ('Simple Components:', () => {

	it ('HelpHint renders without issues', () => {
		expect(
			shallow(
				<HelpHint />
			).is('div')).to.be.equal(true);
	});

	it ('HelpNote renders without issues', () => {
		expect(
			shallow(
				<HelpNote />
			).is('div')).to.be.equal(true);
	});
	
	it ('HowTo renders without issues', () => {
		expect(
			shallow(
				<HowTo />
			).is('div')).to.be.equal(true);
	});

});