import React from 'react';

import Logo from './Logo';
import constants from '../constants/constants';

const Hero = () => (
  <div className="hero my-5 text-center" data-testid="hero">
    {/* <Logo testId="hero-logo" /> */}
    <h1 className="mb-4" data-testid="hero-title">{ constants.appName }</h1>

    <p className="lead" data-testid="hero-lead">
    Get meeting summaries in a snap with Meeting McBrieferson!
    </p>
  </div>
);

export default Hero;
