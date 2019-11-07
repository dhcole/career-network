import PropTypes from 'prop-types';
import React from 'react';
import DropdownQuestion from './DropdownQuestion';
import RadiosQuestion from './RadiosQuestion';

import AirtablePropTypes from '../../../Airtable/PropTypes';

export default function OptionQuestion(props) {
  const { isInGroup, responseOptionsControl, ...restProps } = props;

  switch (responseOptionsControl) {
    case 'Dropdown':
      return <DropdownQuestion {...restProps} horizontalOnDesktop={isInGroup} />;
    case 'Radios':
      return <RadiosQuestion {...restProps} />;
    default:
      return null;
  }
}

OptionQuestion.propTypes = {
  isInGroup: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  question: AirtablePropTypes.question.isRequired,
  responseOptions: AirtablePropTypes.questionResponseOptions.isRequired,
  responseOptionsControl: AirtablePropTypes.questionResponseOptionsControl.isRequired,
  value: PropTypes.string,
};

OptionQuestion.defaultProps = {
  isInGroup: false,
  value: null,
};
