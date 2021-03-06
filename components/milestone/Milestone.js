import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import ActivitiesSection from './ActivitiesSection';
import Section from '../activityTemplate/Section';
import ExploreSection from './Explore/ExploreSection';
import TemplateHeader from '../TemplateHeader';
import { JOB_SEARCH_CATEGORIES, MILESTONE_TYPES } from '../../constants';

const useStyles = makeStyles(theme => ({
  section: {
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(3),
  },
}));

export default function Milestone(props) {
  const classes = useStyles();
  const { milestone, activityTemplates } = props;
  const { category, slug, title, milestoneGoal } = milestone;

  const categoryType = JOB_SEARCH_CATEGORIES.find(cat => cat.slug === category);
  const milestoneType = MILESTONE_TYPES.find(ms => ms.slug === slug);
  const activitiesSection = milestone.sections.find(section => section.slug === 'activities');
  const overviewSection = milestone.sections.find(section => section.slug === 'milestone');
  const exploreSection = milestone.sections.find(section => section.slug === 'more-milestones');
  return (
    <div className={classes.root}>
      <TemplateHeader
        categoryType={categoryType.slug}
        categoryLabel={categoryType.name}
        milestoneType={milestoneType.slug}
        milestoneLabel={milestoneType.name}
        title={title}
        isMilestone
        milestoneGoal={milestoneGoal}
      />
      <Section sectionData={overviewSection} />
      <ActivitiesSection sectionData={activitiesSection} activityTemplates={activityTemplates} />
      <ExploreSection sectionData={exploreSection} category={milestone.category} />
    </div>
  );
}

Milestone.propTypes = {
  milestone: PropTypes.objectOf(PropTypes.any).isRequired,
  activityTemplates: PropTypes.arrayOf(PropTypes.any),
};

Milestone.defaultProps = {
  activityTemplates: [],
};
