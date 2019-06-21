import { makeStyles } from '@material-ui/styles';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import Typography from '@material-ui/core/Typography';

import { useAuth, withAuthRequired } from '../components/Auth';
import { useRecords } from '../components/Airtable';
import AssessmentSectionList from '../components/assessment/AssessmentSectionList';
import FullPageProgress from '../components/FullPageProgress';
import ScaffoldContainer from '../components/ScaffoldContainer';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(5),
  },
}));

function Assessment() {
  const classes = useStyles();
  const [allQuestionResponses, setAllQuestionResponses] = useState([]);
  const [scrollToY, setScrollToY] = useState(0);
  const { user, userDocRef } = useAuth();
  const cleanupRef = useRef();
  const recordProps = {
    assessmentSections: useRecords('appPhpA6Quf0pCBDm/Assessment%20Sections?view=API'),
    allAssessmentEntries: useRecords('appPhpA6Quf0pCBDm/Assessment%20Entries?view=API'),
    allQuestions: useRecords('appPhpA6Quf0pCBDm/Questions?view=API'),
    allQuestionGroups: useRecords('appPhpA6Quf0pCBDm/Question%20Groups?view=API'),
    allQuestionResponseOptions: useRecords('appPhpA6Quf0pCBDm/Question%20Response%20Options?view=API'),
    allQuestionResponses, // for initial hydration (use case: incomplete assessment)
  };

  const fullyLoaded = user && Object.values(recordProps)
    .map(array => array.length)
    .reduce((accum, length) => accum && !!length, true);

  const scrollToRef = useCallback((node) => {
    if (node !== null) {
      setScrollToY(node.offsetTop - 24);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const snapshot = await userDocRef.collection('questionResponses').get();
      cleanupRef.current = snapshot;
      setAllQuestionResponses(snapshot.docs);
    })();

    return () => {
      if (typeof cleanupRef.current === 'function') {
        cleanupRef.current();
      }
    };
  }, [userDocRef]);

  return (
    <div className={classes.root}>
      <ScaffoldContainer>
        {fullyLoaded ? (
          <React.Fragment>
            <Typography ref={scrollToRef} component="h1" variant="h2" gutterBottom>
              Welcome,
              {' '}
              {user && user.firstName}
              !
            </Typography>

            <AssessmentSectionList scrollToY={scrollToY} {...recordProps} />
          </React.Fragment>
        ) : (
          <FullPageProgress />
        )}
      </ScaffoldContainer>
    </div>
  );
}

export default withAuthRequired(Assessment);
