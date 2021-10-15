import React from 'react';
import classNames from 'classnames';
import { SectionSplitProps } from '../../utils/SectionProps';
import Button from '../elements/Button';
import c from '../../assets/images/c.mp4';

const propTypes = {
  ...SectionSplitProps.types
}

const defaultProps = {
  ...SectionSplitProps.defaults
}

class HeroSplit extends React.Component {

  componentDidMount() {
    // this is only to handle inline style on window resize
    window.onresize = function () {
      this.forceUpdate();
    }.bind(this);
  }

  render() {

    const {
      className,
      topOuterDivider,
      bottomOuterDivider,
      topDivider,
      bottomDivider,
      hasBgColor,
      invertColor,
      invertMobile,
      invertDesktop,
      alignTop,
      imageFill,
      ...props
    } = this.props;

    const outerClasses = classNames(
      'hero section',
      topOuterDivider && 'has-top-divider',
      bottomOuterDivider && 'has-bottom-divider',
      hasBgColor && 'has-bg-color',
      invertColor && 'invert-color',
      className
    );

    const innerClasses = classNames(
      'hero-inner section-inner',
      topDivider && 'has-top-divider',
      bottomDivider && 'has-bottom-divider'
    );

    const splitClasses = classNames(
      'split-wrap',
      invertMobile && 'invert-mobile',
      invertDesktop && 'invert-desktop',
      alignTop && 'align-top'
    );

    return (
      <section
        {...props}
        className={outerClasses}
      >
        <div className="videoContainer" style={inlineVideo}>
        <video className='videoTag' autoPlay loop muted>
            <source src={c} type='video/mp4' />
        </video>
        </div>
        <div className="container">

          <div className={innerClasses}>
            <div className={splitClasses}>
              <div className="split-item" style={inlineStyle()}>
                <div className="hero-content split-item-content center-content-mobile">
                  <h1 className="mt-0 mb-16 reveal-from-bottom" data-reveal-delay="150">
                    Amplify
                  </h1>
                  <p className="mt-0 mb-32 reveal-from-bottom" data-reveal-delay="300">
                   A decentralised market for work
                  </p>
                  <div className="reveal-from-bottom" data-reveal-delay="450">
                    <Button tag="a" color="primary" href="https://cruip.com/" wideMobile>
                      Get started now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
// inline style
const inlineVideo = {
  height: '300px',
  width:'100%',
  position: 'relative',
  "z-index": -2
}


// inline style
const inlineCss = {
  minHeight: '492px'
}

const inlineStyle = function () {
  if (window.innerWidth > 641) {
    return inlineCss;
  }
};

HeroSplit.propTypes = propTypes;
HeroSplit.defaultProps = defaultProps;

export default HeroSplit;