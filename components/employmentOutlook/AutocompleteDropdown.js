import { InstantSearch, Configure, connectAutoComplete } from 'react-instantsearch-dom';
import { makeStyles } from '@material-ui/styles';
import algoliasearch from 'algoliasearch/lite';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PropTypes from 'prop-types';
import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const searchClient = algoliasearch('GVXRTXREAI', '327775f382e4df7687f8a578e64e238b');

const useStyles = makeStyles(() => ({
  wrapIcon: {
    display: 'inline-flex',
  },
}));

function AutocompleteSearch({ hits, currentRefinement, refine, onDropdownValueChange }) {
  const classes = useStyles();
  const options = hits.map(option => ({
    default: `Occupations`,
    Occupation: option.Occupation,
  }));

  return (
    <>
      <Autocomplete
        id="occupation-autocomplete-select"
        options={options}
        groupBy={option => option.default}
        getOptionLabel={option => option.Occupation}
        noOptionsText={
          <>
            <Typography style={{ fontWeight: 'bold' }} gutterBottom>
              Sorry, we couldn&apos;t find any occupations matching your search.{' '}
            </Typography>
            <Typography>
              You may want to check spelling or try searching with other terms.
            </Typography>
          </>
        }
        style={{ width: '100%' }}
        onInputChange={event => refine(event.currentTarget.value)}
        onChange={(event, value) => onDropdownValueChange(value ? value.Occupation : '')}
        renderInput={params => (
          <TextField
            variant="outlined"
            {...params}
            value={currentRefinement}
            label={
              <div className={classes.wrapIcon}>
                <SearchIcon style={{ marginRight: '0.5rem', marginTop: '-0.2rem' }} /> Search or
                Select an Occupation
              </div>
            }
            fullWidth
          />
        )}
      />
    </>
  );
}

AutocompleteSearch.propTypes = {
  hits: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentRefinement: PropTypes.string.isRequired,
  refine: PropTypes.func.isRequired,
  onDropdownValueChange: PropTypes.func.isRequired,
};

const CustomAutocomplete = connectAutoComplete(AutocompleteSearch);

function AutocompleteDropdown(props) {
  const { onChange } = props;
  return (
    <InstantSearch searchClient={searchClient} indexName="DISTINCT_OCCUPATION">
      <Configure hitsPerPage={1000} />
      <CustomAutocomplete onDropdownValueChange={onChange} />
    </InstantSearch>
  );
}

AutocompleteDropdown.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default AutocompleteDropdown;
