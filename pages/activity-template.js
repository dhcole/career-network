import React from 'react';
import { useRouter } from 'next/router';
import { fullyLoaded } from '../src/app-helper';
import useTemplate from '../components/activityTemplate/useTemplate';
import { useAuth, withAuthRequired } from '../components/Auth';
import { useUserSubcollection } from '../components/Firebase';
import ActivityTemplate from '../components/activityTemplate/ActivityTemplate';
import FullPageProgress from '../components/FullPageProgress';
import withTitle from '../components/withTitle';

function ActivityTemplatePage() {
  const { user } = useAuth();
  const { query } = useRouter();
  const activityTemplate = useTemplate(query.template);
  // Once we have the cms, use the template-id param to retrieve the
  // page template and user inputs

  const allPracticeQuestionInputs = useUserSubcollection('practiceQuestionInputs');

  return fullyLoaded(user, activityTemplate, allPracticeQuestionInputs) ? (
    <ActivityTemplate
      templateId={query.template}
      activityTemplate={activityTemplate}
      allPracticeQuestionInputs={allPracticeQuestionInputs}
    />
  ) : (
    <FullPageProgress />
  );
}

export default withAuthRequired(withTitle(ActivityTemplatePage, 'Activity'));
