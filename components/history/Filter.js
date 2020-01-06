import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(1),
  },
}));

export default function Filter(props) {
  const classes = useStyles();
  const { filterOptions, onChange } = props;

  return (
    <div>
      <FormControl>
        <FormGroup>
          {Object.keys(filterOptions).map(option => (
            <FormControlLabel
              key={option}
              classes={{
                root: classes.root,
              }}
              control={
                <Checkbox
                  onChange={onChange(option)}
                  value={option}
                  checked={filterOptions[option] === undefined ? true : filterOptions[option]}
                />
              }
              label={option}
            />
          ))}
        </FormGroup>
      </FormControl>
    </div>
  );
}

Filter.propTypes = {
  filterOptions: PropTypes.objectOf(PropTypes.bool).isRequired,
  onChange: PropTypes.func.isRequired,
};

Filter.defaultProps = {};
