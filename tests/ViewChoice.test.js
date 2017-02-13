import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ViewChoice from '../browser/react/components/ViewChoice';

describe ('Component: ViewChoice', () => {

	const minProps = {
		params: {
			sessionKey: 'FakeSessionName'
		}
	};

	let choicePage;

	beforeEach('Create the component', () => {
		choicePage = shallow(<ViewChoice {...minProps} />);
	});


	it ('renders without issues', () => {
		expect(
			choicePage.is('div')).to.be.equal(true);
	});

	it ('displays description when the HINT button is clicked', () => {

	});

	it ('opens the FeedbackForm when DONE WITH VR button is clicked', () => {

	});
	
	it ('loads the practice page when CONTINUE button is clicked', () => {

	});
});
