import React from 'react';
import chai, { expect } from 'chai';                                     
chai.use(require('chai-enzyme')());
import { shallow, mount } from 'enzyme';

import PitchTracker, { PitchCircle, PitchLabel,  colorChange } from '../src/browser/react/components/PitchTracker';

//dependency injection for aframe 
global.AFRAME = {
  components: {
    camera: {},
    geometry: {},
    material: {},
    position: {},
    scale: {}
  }
};

describe('<PitchTracker />', () => {

  let root;
  before('render the root', () => 
    root = shallow(<PitchTracker />));

  it('renders without exploding', () =>
    expect(root).to.have.length.of(1));

  it('renders <a-entity>', () => {
    expect(root.find('a-entity')).to.have.length(1);
  });

  describe('colorChange utility function', () => {
    it('returns the right color based on the pitch boolean prop passed in', () => {
      const green = `#00FF00`;
      const yellow = `#FFFF00`;
      expect(colorChange(true)).to.equal(yellow);
      expect(colorChange(false)).to.equal(green);
    });
  });

  describe('<PitchCircle/> subcomponent', () => {
    let root;
    before('render the root', () => 
      root = shallow(<PitchCircle />));

    it('renders without exploding', () =>
      expect(root).to.have.length.of(1));

    it('renders <a-entity>', () => {
      expect(root.find('a-entity')).to.have.length(1);
    });

    it('renders <a-entity> with components', () => {
      const myPitchCircle = mount(
        <PitchCircle position='0 0 0' rotation='0 5.34 0' geometry='primitive: circle; radius: 1' pitch={false}/>
      );
      let renderedElement = myPitchCircle.find('a-entity');
      expect(renderedElement).to.have.prop('position').eql('0 0 0');  
      expect(renderedElement).to.have.prop('rotation').eql('0 5.34 0');      
      expect(renderedElement).to.have.prop('geometry').eql('primitive: circle; radius: 1');

      //displays the right color based on the pitch prop passed in'
      expect(renderedElement).to.have.prop('material').eql(`color: ${colorChange(false)}`);
    });
  });

  describe('<PitchLabel/> subcomponent', () => {
    let root;
    before('render the root', () => 
      root = shallow(<PitchLabel />));

    it('renders without exploding', () =>
      expect(root).to.have.length.of(1));

    it('renders <a-entity>', () => {
      expect(root.find('a-entity')).to.have.length(1);
    });

    it('renders <a-entity> with components', () => {
      const myPitchLabel = mount(
        <PitchLabel position='5 5 5' scale='8 8 8' text='value: HELLO; line-height: 10px;'/>
      );
      let renderedElement = myPitchLabel.find('a-entity');
      expect(renderedElement).to.have.prop('position').eql('5 5 5');  
      expect(renderedElement).to.have.prop('scale').eql('8 8 8');      
      expect(renderedElement).to.have.prop('text').eql('value: HELLO; line-height: 10px;');
    });
  });

  describe('The composite component', () => {
    let newWrapper = mount(<PitchTracker pitch={true}/>);
    it('renders PitchCircle', () => 
      expect(newWrapper.find('PitchCircle')).to.have.length(1));    
    it('renders PitchLabel', () => 
      expect(newWrapper.find('PitchLabel')).to.have.length(1));
    it('passes the correct pitch prop to PitchCircle, resulting in the correct color being rendered', () => 
        expect(newWrapper.find('PitchCircle').html().indexOf(`color: ${colorChange(true)}`)).to.be.above(-1))
  });
});