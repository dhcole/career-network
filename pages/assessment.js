import { makeStyles } from '@material-ui/styles';
import React, { useCallback, useState } from 'react';
import Router from 'next/router';
import Typography from '@material-ui/core/Typography';

import { allPropsLoaded, englishList, fullyLoaded } from '../src/app-helper';
import { useAuth, withAuthRequired } from '../components/Auth';
import { useRecords } from '../components/Airtable';
import { useUserSubcollection } from '../components/Firebase';
import AssessmentSectionList from '../components/assessment/AssessmentSectionList';
import BackgroundHeader from '../components/BackgroundHeader';
import FullPageProgress from '../components/FullPageProgress';
import ScaffoldContainer from '../components/ScaffoldContainer';
import withTitle from '../components/withTitle';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
  },
  backgroundHeader: {
    paddingBottom: theme.spacing(12),
  },
  assessmentContainer: {
    marginTop: theme.spacing(-11),
  },
}));

function Assessment() {
  const classes = useStyles();
  const allQuestionResponses = useUserSubcollection('questionResponses');
  const [scrollToY, setScrollToY] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const { user, userDocRef } = useAuth();
  const assessmentConfiguration = {
    assessmentSections: useRecords('Assessment Sections'),
    allAssessmentSubsections: useRecords('Assessment Subsections'),
    allAssessmentEntries: useRecords('Assessment Entries'),
    allQuestions: useRecords('Questions'),
    allQuestionGroups: useRecords('Question Groups'),
    allQuestionResponseOptions: useRecords('Question Response Options'),
  };

  const buildPostAssessmentIntercomAttributes = () => {
    const attributes = { 'initial-assessment-completed': new Date() };

    // kind of a hacky one-off
    const { allQuestionGroups } = assessmentConfiguration;
    const resourcesQuestionGroup = allQuestionGroups.find(qg => qg.fields.Slug === 'basic-needs');
    const resourceQuestionIds = resourcesQuestionGroup.fields.Questions;
    const positiveResourceQuestionResponses = allQuestionResponses.filter(
      // all "additional resources" questions checked in assessment
      doc => resourceQuestionIds.includes(doc.id) && doc.data().value === true
    );
    const englishListOfResourcesRequested = englishList(
      positiveResourceQuestionResponses.map(doc => doc.data().question.fields.Label)
    ).toLowerCase();
    if (englishListOfResourcesRequested) {
      attributes['basic-resources-requested'] = englishListOfResourcesRequested;
    }

    return attributes;
  };

  const handleComplete = () => {
    setIsFinished(true);

    // save a complete copy of the exact configassessment configuration answered
    // (for a paper trail, and for using to display a read-only view of answers)
    userDocRef
      .collection('assessmentConfigurationsLog')
      .doc('initialAssessment')
      .set(assessmentConfiguration);

    // set flag on user: initial assessment is complete
    // (will need refactor when introducing multiple assessments)
    userDocRef.set(
      { isAssessmentComplete: true, shouldSeeAssesssmentCompletionCelebration: true },
      { merge: true }
    );
    window.Intercom('update', buildPostAssessmentIntercomAttributes());
    Router.push('/dashboard');
  };

  const scrollToRef = useCallback(node => {
    if (node !== null) {
      setScrollToY(node.offsetTop - 24);
    }
  }, []);

  return (
    <div className={classes.root}>
      <BackgroundHeader className={classes.backgroundHeader}>
        <ScaffoldContainer>
          <Typography ref={scrollToRef} component="h1" variant="h2" gutterBottom>
            Hi, {user && user.firstName}
          </Typography>
        </ScaffoldContainer>
      </BackgroundHeader>
      <ScaffoldContainer className={classes.assessmentContainer}>
        {fullyLoaded(user, allPropsLoaded(assessmentConfiguration), allQuestionResponses) &&
        !isFinished ? (
          <AssessmentSectionList
            scrollToY={scrollToY}
            onComplete={handleComplete}
            allQuestionResponses={allQuestionResponses}
            {...assessmentConfiguration}
            enforceValidity
          />
        ) : (
          <FullPageProgress />
        )}
      </ScaffoldContainer>
    </div>
  );
}

export default withAuthRequired(withTitle(Assessment, 'Questionnaire'));
