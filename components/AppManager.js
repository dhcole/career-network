// This file should:
//  - show "signed in" on sign in
//  - show "signed out" on sign out
//  - redirect to '/' upon sign out (and not show a 403)
//  - redirect to '/welcome' or '/dashboard' upon sign in

import { useBeforeunload } from 'react-beforeunload';
import * as Sentry from '@sentry/browser';
import FacebookPixel from 'react-facebook-pixel';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef } from 'react';
import Router from 'next/router';

import { useAuth } from './Auth';
import EnvName from './EnvName';
import Footer from './Footer';
import Header from './Header';

export default function AppManager(props) {
  const { children } = props;
  const { user, signOut, wasSignedIn, isAuthKnown } = useAuth();
  const cleanupRef = useRef();
  const userId = user && user.uid;

  const handleSignOut = useCallback(async () => {
    await Router.push('/');
    signOut();
  }, [signOut]);

  useEffect(() => {
    Sentry.configureScope(scope => {
      scope.setUser(userId ? { id: userId } : null);
    });
  }, [userId]);

  const userIsCoach = user && user.isCoach;
  const userIsAssessmentComplete = user && user.isAssessmentComplete;
  useEffect(() => {
    if (userId && Router.router && Router.route === '/') {
      let url;

      if (userIsCoach) {
        url = '/coaching';
      } else if (userIsAssessmentComplete) {
        url = '/dashboard';
      } else {
        url = '/welcome';
      }

      (async () => {
        cleanupRef.current = Router.push(url);
      })();
    }

    return () => {
      if (typeof cleanupRef.current === 'function') {
        cleanupRef.current();
      }
    };
  }, [userId, userIsAssessmentComplete, userIsCoach]);

  const userCreationTimestampSeconds =
    user && user.creationTimestamp && user.creationTimestamp.seconds;
  const intercomUserHash = user && user.intercomUserHash;
  const userDisplayName = user && user.displayName;
  const userEmail = user && user.email;
  const userPhotoURL = user && user.photoURL;

  useEffect(() => {
    // start with a clean slate (prevent data leaks)
    if (!intercomUserHash) {
      window.Intercom('shutdown');
    }

    const config = {
      app_id: process.env.intercom.appId,
      environment: process.env.name, // custom data attribute

      // wait for intercomUserHash to be generated by async backend function:
      ...(intercomUserHash && {
        name: userDisplayName,
        email: userEmail,
        user_id: userId,
        user_hash: intercomUserHash,
        created_at: userCreationTimestampSeconds,
        avatar: {
          type: 'avatar',
          image_url: userPhotoURL,
        },
      }),
    };

    // the timeout prevents some kind of race condition that throws a benign console
    // error when booting immediately after the above "clean slate" shutdown
    window.setTimeout(() => window.Intercom('boot', config), 1);

    return () => window.Intercom('shutdown');
  }, [
    intercomUserHash,
    userCreationTimestampSeconds,
    userDisplayName,
    userEmail,
    userId,
    userPhotoURL,
  ]);

  useEffect(() => {
    // wait until login state is determined
    if (!isAuthKnown) {
      return;
    }

    // don't re-init after logging out
    if (wasSignedIn && !userId) {
      return;
    }

    // in fact, don't re-init ever (prevent duplicate pixel warning)
    if (window.fbq && window.fbq.loaded) {
      return;
    }

    const advancedMatching = userId && {
      em: userEmail,
      external_id: userId,
    };
    const options = {
      autoConfig: true,
      debug: false,
    };
    FacebookPixel.init(process.env.facebook.pixelId, advancedMatching, options);
    FacebookPixel.pageView();
  }, [isAuthKnown, userEmail, userId, wasSignedIn]);

  // end with a clean slate (prevent data leaks)
  useBeforeunload(event => {
    window.Intercom('shutdown');

    // The absence of a returnValue property on the event will guarantee the browser unload happens.
    // eslint-disable-next-line no-param-reassign
    delete event.returnValue;
  });

  return (
    <>
      {process.env.showName && <EnvName />}
      <Header onSignOut={handleSignOut} user={user} />
      <main>{children}</main>
      <Footer />
    </>
  );
}

AppManager.propTypes = {
  children: PropTypes.node.isRequired,
};
