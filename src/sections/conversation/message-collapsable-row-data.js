import PropTypes from 'prop-types';
import { Collapse, TableCell, TableRow } from '@mui/material';

export const MessageCollapsableRowData = ({ msg, expanded }) => {
  return (
    <TableRow sx={{ borderTop: '2px white solid', borderLeft: '20px lightgray solid' }}>
      <TableCell colSpan={5} sx={{ pt: '0', pb: '0', overflowX: 'auto' }}>
        <Collapse in={expanded}>
          <pre style={{ color: 'darkgray', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {JSON.stringify(msg, null, 2)}
          </pre>
        </Collapse>
      </TableCell>
    </TableRow>
  );
};

MessageCollapsableRowData.propTypes = {
  msg: PropTypes.object,
  expanded: PropTypes.bool,
};
