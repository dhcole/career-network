import { MuiThemeProvider } from '@material-ui/core/styles';
import App, { Container } from 'next/app';
import CssBaseline from '@material-ui/core/CssBaseline';
import Head from 'next/head';
import JssProvider from 'react-jss/lib/JssProvider';
import React from 'react';

import Firebase, { FirebaseContext } from '../components/Firebase';
import Footer from '../components/Footer'
import getPageContext from '../src/getPageContext';
import Header from '../components/Header'

class MyApp extends App {
  constructor() {
    super();
    this.pageContext = getPageContext();
  }

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Head>
          <title>Career Network</title>
        </Head>
        <FirebaseContext.Provider value={new Firebase()}>
          {/* Wrap every page in Jss and Theme providers */}
          <JssProvider
            registry={this.pageContext.sheetsRegistry}
            generateClassName={this.pageContext.generateClassName}
          >
            {/* MuiThemeProvider makes the theme available down the React
              tree thanks to React context. */}
            <MuiThemeProvider
              theme={this.pageContext.theme}
              sheetsManager={this.pageContext.sheetsManager}
            >
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              {/* Pass pageContext to the _document though the renderPage enhancer
                to render collected styles on server-side. */}
              <Header />
              <main>
                <Component pageContext={this.pageContext} {...pageProps} />
              </main>
              <Footer />
            </MuiThemeProvider>
          </JssProvider>
        </FirebaseContext.Provider>
      </Container>
    );
  }
}

export default MyApp;
