import { compareDesc } from 'date-fns';
import Button from '@material-ui/core/Button';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import FeedCard from './FeedCard';
import FirebasePropTypes from '../Firebase/PropTypes';

export default function ActivityList(props) {
  const { activities, completedTasks, limit } = props;
  const sorted = [
    ...activities.map(a => ({
      ...a.data(),
      cardType: 'ACTIVITY',
    })),
    ...completedTasks.map(t => ({
      ...t.data(),
      cardType: 'TASK',
    })),
  ].sort((a, b) => compareDesc(a.timestamp.toDate(), b.timestamp.toDate()));

  return (
    <div>
      {!sorted.length && <Typography color="textSecondary">None</Typography>}
      {sorted
        .slice(0, limit)
        .map(item =>
          item.cardType === 'ACTIVITY' ? (
            <FeedCard
              cardType={item.cardType}
              title={item.briefDescription}
              subheader={item.activityTypeLabel}
              date={item.dateCompleted}
              timeSpentInMinutes={item.timeSpentInMinutes}
              key={item.timestamp}
            />
          ) : (
            <FeedCard
              cardType={item.cardType}
              title={item.task.fields.Title}
              subheader={item.task.fields.Category}
              date={item.timestamp}
              key={item.taskId}
            />
          )
        )}
      {!!sorted.length && (
        <NextLink href="/progress">
          <Button color="primary" variant="contained" fullWidth>
            See All Progress
          </Button>
        </NextLink>
      )}
    </div>
  );
}

ActivityList.propTypes = {
  activities: FirebasePropTypes.querySnapshot.isRequired,
  completedTasks: FirebasePropTypes.querySnapshot.isRequired,
  limit: PropTypes.number.isRequired,
};
