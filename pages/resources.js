import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import fetch from 'unfetch';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import ScaffoldContainer from '../components/ScaffoldContainer';
import StaticCollection from '../components/StaticCollection';

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 5,
  },
  progress: {
    margin: '0 auto',
    marginTop: theme.spacing.unit * 5,
    display: 'block',
  },
});

class Resources extends React.Component {
  constructor() {
    super();
    this.state = { categories: [] };
  }

  async componentDidMount() {
    const categoryResult = await fetch('https://careers.gardenstate.tech/api/airtable/v0/appPhpA6Quf0pCBDm/Resource%20Categories?view=API%20State%20Resources%20Page');
    const categoryJson = await categoryResult.json();
    const categories = categoryJson.records.filter(c => c.fields['Resources']);

    const itemResult = await fetch('https://careers.gardenstate.tech/api/airtable/v0/appPhpA6Quf0pCBDm/Resources?view=API%20State%20Resources%20Page');
    const itemJson = await itemResult.json();
    const items = itemJson.records;

    categories.forEach(category => {
      category.items = category.fields['Resources']
        .map(itemId => items.find(item => item.id === itemId))
        .filter(item => item);
    });

    this.setState({
      categories: categories.filter(category => category.items.length),
    });
  }

  render() {
    const { classes } = this.props;
    const { categories } = this.state;

    return (
      <div className={classes.root}>
        <ScaffoldContainer>
          <Typography variant="h3" component="h1">State Resources</Typography>
          <Typography variant="subtitle1">
            Find information and links about the state resources available to you through in-person and online services.
          </Typography>
          {categories.length ? null :
            <CircularProgress className={classes.progress} color="secondary" />
          }
          <StaticCollection categories={categories} />
        </ScaffoldContainer>
      </div>
    );
  }
}

Resources.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Resources);
