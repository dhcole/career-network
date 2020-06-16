import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';

const useStyles = makeStyles(theme => ({
  textField: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
    fontWeight: 500,
  },
  dash: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(3, 2, 0),
    fontWeight: 500,
    fontSize: 16,
  },
  placeholderText: {
    opacity: 0.3,
    fontWeight: 400,
  },
}));

export const ADD = 'ADD';
export const UPDATE = 'UPDATE';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const monthYearIsValid = (month, year) => month && year && `${year}`.match(/^[0-9]{1,2}.[0-9]{2}$/);

const isValidDateRange = ({ startMonth, startYear, endMonth, endYear }) =>
  (!startMonth && !startYear && !endMonth && !endYear) ||
  (monthYearIsValid(startMonth, startYear) &&
    monthYearIsValid(endMonth, endYear) &&
    new Date(`${startMonth} ${startYear}`) <= new Date(`${endMonth} ${endYear}`));

function EmploymentItemForm({ handleChange, handleSubmit, values }) {
  const formId = 'employmentItems';
  const classes = useStyles();
  const [rangeError, setRangeError] = useState();

  useEffect(() => {
    if (rangeError) {
      setRangeError();
    }
  }, [values]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = event => {
    event.preventDefault();
    const { startMonth, startYear, endMonth, endYear, org, title } = values;
    if (isValidDateRange({ startMonth, startYear, endMonth, endYear })) {
      const start = startMonth && startYear ? `${startMonth} ${startYear}` : '';
      const end = endMonth && endYear ? `${endMonth} ${endYear}` : '';
      const updatedItem = {
        start,
        end,
        org,
        title,
      };
      handleSubmit(updatedItem);
    } else {
      setRangeError(true);
    }
  };

  return (
    <>
      <form id={formId} onSubmit={onSubmit}>
        <span>Job Title</span>
        <TextField
          className={classes.textField}
          fullWidth
          inputProps={{ name: 'title' }}
          id={`${formId}-title`}
          InputLabelProps={{ shrink: true }}
          onChange={handleChange}
          placeholder="Enter the Job Title"
          value={values.title || ''}
          variant="outlined"
        />
        <span>Company / Organization</span>
        <TextField
          margin="normal"
          className={classes.textField}
          fullWidth
          id={`${formId}-org`}
          InputLabelProps={{ shrink: true }}
          inputProps={{ name: 'org' }}
          onChange={handleChange}
          placeholder="Enter the Company / Organization Name"
          value={values.org || ''}
          variant="outlined"
        />
        <span>Employment Dates</span>
        <Grid container wrap="nowrap" spacing={1}>
          <Grid item md={3}>
            <Select
              className={classes.textField}
              displayEmpty
              fullWidth
              error={rangeError}
              id={`${formId}-start-month`}
              inputProps={{ name: 'startMonth', placeholder: 'Month' }}
              onChange={handleChange}
              value={values.startMonth || ''}
              variant="outlined"
            >
              <MenuItem value="" disabled>
                <span className={classes.placeholderText}>Month</span>
              </MenuItem>
              {MONTHS.map(startMonth => (
                <MenuItem key={startMonth} value={startMonth}>
                  {startMonth}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item md={3}>
            <TextField
              fullWidth
              variant="outlined"
              error={rangeError}
              className={classes.textField}
              id={`${formId}-start-year`}
              inputProps={{
                name: 'startYear',
              }}
              type="number"
              step={1}
              min={1900}
              max={2099}
              onChange={handleChange}
              placeholder="Year"
              value={values.startYear || ''}
            />
          </Grid>
          <div className={classes.dash}>–</div>
          <Grid item md={3}>
            <Select
              fullWidth
              variant="outlined"
              error={rangeError}
              className={classes.textField}
              inputProps={{ name: 'endMonth', placeholder: 'Month' }}
              id={`${formId}-end-month`}
              value={values.endMonth || ''}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem value="" disabled>
                <span className={classes.placeholderText}>Month</span>
              </MenuItem>
              {MONTHS.map(endMonth => (
                <MenuItem key={endMonth} value={endMonth}>
                  {endMonth}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item md={3}>
            <TextField
              fullWidth
              error={rangeError}
              variant="outlined"
              className={classes.textField}
              id={`${formId}-end-year`}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                name: 'endYear',
              }}
              type="number"
              step={1}
              min={1900}
              max={2099}
              onChange={handleChange}
              placeholder="Year"
              value={values.endYear || ''}
            />
          </Grid>
        </Grid>
        {rangeError && <FormHelperText error>Please enter valid date range.</FormHelperText>}
      </form>
    </>
  );
}

EmploymentItemForm.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  values: PropTypes.shape({
    startYear: PropTypes.string,
    startMonth: PropTypes.string,
    endYear: PropTypes.string,
    endMonth: PropTypes.string,
    title: PropTypes.string,
    org: PropTypes.string,
  }),
};

EmploymentItemForm.defaultProps = {
  values: {
    title: '',
    org: '',
    startMonth: '',
    endMonth: '',
    startYear: '',
    endYear: '',
  },
};

export default EmploymentItemForm;
