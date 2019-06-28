import { makeStyles } from '@material-ui/styles';
import Avatar from '@material-ui/core/Avatar';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import NextLink from 'next/link';
import PersonIcon from '@material-ui/icons/Person';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';

import { useAuth } from '../Auth';
import Picture from '../Picture';
import ScaffoldContainer from '../ScaffoldContainer';
import UserClass from '../../src/User';

const logoRatio = 834 / 784;
const logoWidths = {
  xs: 40,
  md: 60,
};

const pages = [
  {
    href: '/dashboard',
    name: 'My Dashboard',
    public: false,
    private: true,
  }, {
    href: '/#why',
    name: 'Learn More',
    shortName: 'Learn More',
    public: true,
    private: false,
  }, {
    href: '/toolkit',
    name: 'Job Toolkit',
    shortName: 'Toolkit',
    public: true,
    private: true,
  }, {
    href: '/resources',
    name: 'State Resources',
    shortName: 'Resources',
    public: true,
    private: true,
  },
];

const useStyles = makeStyles(theme => ({
  container: {
    [theme.breakpoints.up('md')]: {
      alignItems: 'flex-end',
    },
  },
  logo: {
    position: 'relative',
    top: '4px',
    margin: '.8em .8em .8em 0',
    width: logoWidths.xs,
    height: logoWidths.xs * logoRatio,
    [theme.breakpoints.up('md')]: {
      width: logoWidths.md,
      height: logoWidths.md * logoRatio,
    },
  },
  titleContainer: {
    flexBasis: 0,
    [theme.breakpoints.down('sm')]: {
      flexBasis: 'auto',
    },
  },
  title: {
    fontSize: '1.5em',
    fontWeight: 300,
    cursor: 'pointer',
  },
  list: {
    display: 'flex',
    justifyContent: 'flex-end',
    listStyle: 'none',
  },
  link: {
    padding: theme.spacing(1, 3.5),
    color: '#000',
    cursor: 'pointer',
    width: '100%',
    display: 'inline-block',
    '&:hover': {
      backgroundColor: '#e4e4e4',
    },
  },
  drawerList: {
    width: 250,
  },
}));

function Nav(props) {
  const { onSignOut, user } = props;
  const classes = useStyles();
  const { showSignIn } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const handleSignInClick = () => showSignIn();

  return (
    <React.Fragment>
      <Drawer anchor="right" open={isDrawerOpen} onClose={closeDrawer}>
        <div
          tabIndex={0}
          role="button"
          onClick={closeDrawer}
          onKeyDown={closeDrawer}
        >
          <div className={classes.drawerList}>

            <Hidden smUp implementation="js">
              <List>
                {user ? (
                  <React.Fragment>
                    <NextLink href="/dashboard">
                      <ListItem button>
                        <ListItemIcon>
                          <Avatar src={user.photoURL} alt={user.displayName}>
                            <PersonIcon />
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText primary={user.displayName} secondary={user.email} />
                      </ListItem>
                    </NextLink>
                    <NextLink href="/dashboard">
                      <ListItem button>
                        <ListItemIcon><DashboardIcon /></ListItemIcon>
                        <ListItemText primary="My dashboard" />
                      </ListItem>
                    </NextLink>
                    <ListItem button onClick={onSignOut}>
                      <ListItemIcon><PowerSettingsNewIcon /></ListItemIcon>
                      <ListItemText primary="Sign out" />
                    </ListItem>
                  </React.Fragment>
                ) : (
                  <ListItem button onClick={handleSignInClick}>
                    <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                    <ListItemText primary="Sign in" />
                  </ListItem>
                )}
              </List>
              <Divider />
            </Hidden>

            <List>
              {pages
                .filter(page => page.shortName)
                .filter(page => (user && page.private) || (!user && page.public))
                .map(page => (
                  <NextLink href={page.href} key={page.shortName}>
                    <ListItem button>
                      <ListItemText primary={page.shortName} />
                    </ListItem>
                  </NextLink>
                ))}
            </List>
          </div>
        </div>
      </Drawer>

      <ScaffoldContainer padding={false}>
        <Grid container justify="space-between" alignItems="center" className={classes.container}>
          <NextLink href="/">
            <Grid item>
              <Grid container alignItems="center">
                <Hidden xsDown implementation="css">
                  <Grid item>
                    <Picture path="nj.webp" fallbackType="png" alt="New Jersey Logo" className={classes.logo} />
                  </Grid>
                </Hidden>
                <Grid item className={classes.titleContainer}>
                  <Typography variant="h1" color="primary" className={classes.title}>Career Network</Typography>
                </Grid>
              </Grid>
            </Grid>
          </NextLink>
          <Grid item style={{ flex: 1 }}>
            <Hidden mdUp implementation="css">
              <div style={{ textAlign: 'right' }}>
                <IconButton onClick={openDrawer} aria-label="Menu">
                  <MenuIcon />
                </IconButton>
              </div>
            </Hidden>
            <Hidden smDown implementation="css">
              <nav>
                <ul className={classes.list}>
                  {!user && (
                    <Typography>
                      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                      <Link
                        className={classes.link}
                        onClick={handleSignInClick}
                        component="button"
                        underline="none"
                        variant="body1"
                      >
                        Get Started Today
                      </Link>
                    </Typography>
                  )}
                  {pages
                    .filter(page => (user && page.private) || (!user && page.public))
                    .map(page => (
                      <li key={page.href} className={classes.listItem}>
                        <Typography>
                          <NextLink href={page.href}>
                            { /* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <Link className={classes.link} underline="none">{page.name}</Link>
                          </NextLink>
                        </Typography>
                      </li>
                    ))}
                </ul>
              </nav>
            </Hidden>
          </Grid>
        </Grid>
      </ScaffoldContainer>
    </React.Fragment>
  );
}

Nav.propTypes = {
  onSignOut: PropTypes.func.isRequired,
  user: PropTypes.instanceOf(UserClass),
};

Nav.defaultProps = {
  user: null,
};

export default Nav;
