import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import Typography from '@material-ui/core/Typography';
import formatDate from 'date-fns/format';
import ScaffoldContainer from '../ScaffoldContainer';
import StatusChip from './ApplicationStatusChip';
import { APPLICATION_STATUS_TYPES } from './constants';

const useStyles = makeStyles(theme => ({
  textField: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
    fontWeight: 500,
  },
  footer: {
    padding: theme.spacing(2, 3),
  },
}));

const getStatusEntryField = (statusEntries, entryId, fieldName) => {
  const entry = statusEntries.find(item => item.id === entryId);
  return entry ? entry[fieldName] : null;
};
function ApplicationTable({ applications }) {
  const classes = useStyles();

  const rows = applications.map(({ document, id }) => ({
    jobTitle: document.jobTitle,
    company: document.company,
    lastUpdate: getStatusEntryField(
      document.statusEntries,
      document.currentStatusEntryId,
      'timestamp'
    ),
    status: getStatusEntryField(document.statusEntries, document.currentStatusEntryId, 'status'),
    id,
  }));

  const formatLastUpdate = timestamp => formatDate(timestamp.toDate(), 'MMM eo');

  return (
    <div className={classes.root}>
      <ScaffoldContainer>
        <Table className={classes.table} aria-label="application-table">
          <TableHead>
            <TableRow>
              <TableCell>Details</TableCell>
              <TableCell align="left">Last Update</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left" />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(({ jobTitle, company, lastUpdate, status, id }) => (
              <TableRow key={id}>
                <TableCell component="th" scope="row">
                  <Typography variant="body1">{jobTitle}</Typography>
                  <Typography variant="body2">at {company}</Typography>
                </TableCell>
                <TableCell align="left">{lastUpdate && formatLastUpdate(lastUpdate)}</TableCell>
                <TableCell align="left">
                  <StatusChip status={status} />
                </TableCell>
                <TableCell align="left">Edit</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScaffoldContainer>
    </div>
  );
}

ApplicationTable.propTypes = {
  applications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      document: PropTypes.object,
    })
  ),
};

ApplicationTable.defaultProps = {
  applications: [],
};

export default ApplicationTable;
