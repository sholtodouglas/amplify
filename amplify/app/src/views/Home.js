import React from 'react';
// import section header
import SectionHeader from '../components/sections/partials/SectionHeader';
// import sections
import HeroSplit from '../components/sections/HeroSplit';
import Clients from '../components/sections/Clients';
import GenericSection from '../components/sections/GenericSection';
import FeaturesTiles from '../components/sections/FeaturesTiles';
import Testimonial from '../components/sections/Testimonial';
import Cta from '../components/sections/Cta';
// import some required elements
import Image from '../components/elements/Image';
import Modal from '../components/elements/Modal';

class Home extends React.Component {

  state = {
    videoModalActive: false
  }
  openModal = (e) => {
    e.preventDefault();
    this.setState({ videoModalActive: true });
  }

  closeModal = (e) => {
    e.preventDefault();
    this.setState({ videoModalActive: false });
  }

  render() {

    const genericSection01Header = {
      title: 'What we do',
      paragraph: "We've built a fully on-chain market for data labelling (and later, any work) that is 3x cheaper than mechanical turk and far faster than the opaque, enterprise focused specialists where you are directed to'talk to sales'). By cutting out the middle-man, we can access people on demand and at-cost, then iteratively cross-validate across labellers to drive quality. We hope to enable a future where anyone can earn SOL through structured tasks, and anyone can distribute work as easily as spinning up cloud compute. "
    }

    return (
      <React.Fragment>
        <HeroSplit className="illustration-section-01" />
        <Clients topDivider bottomDivider />
        <GenericSection topDivider className="center-content">
          <SectionHeader data={genericSection01Header} className="reveal-from-bottom" />
        </GenericSection>         
        <FeaturesTiles topDivider className="center-content" />
        <Testimonial topDivider />  
        <Cta split />
      </React.Fragment>
    );
  }
}

export default Home;