import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Box, Card, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';

export const MessagesTable = (props) => {
  const {
    items = [],
  } = props;

  const sortedItems = items.sort((a, b) => {
    if (a._ts < b._ts) {
      return 1;
    }
    if (a._ts > b._ts) {
      return -1;
    }
    return 0;
  });

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                </TableCell>
                <TableCell>
                  Date/Time
                </TableCell>
                <TableCell>
                  User Question
                </TableCell>
                <TableCell>
                  ChatBot Response
                </TableCell>
                <TableCell>
                  User Data Collected
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedItems.map((msg, i) => {
                const userData = Object.entries(msg)
                                       .filter(([key, value]) => key.startsWith('user_') && key !== 'user_msg' && (typeof value === 'string' || (typeof value === 'boolean' && value)))
                                       .map(([key, value]) => `${key}: ${value}`)
                                       .join(', ');
                return (
                  <TableRow
                    hover
                    key={msg.id}
                  >
                    <TableCell>
                      {i+1}
                    </TableCell>
                    <TableCell>
                      {format((msg._ts*1000), 'MM/dd/yyyy hh:mm pp')}
                    </TableCell>
                    <TableCell>
                      {msg.user_msg}
                    </TableCell>
                    <TableCell>
                      {msg.assistant_response}
                    </TableCell>
                    <TableCell>
                      {userData}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
};

MessagesTable.propTypes = {
  items: PropTypes.array,
};
