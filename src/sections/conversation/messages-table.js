import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Box, Card, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';

export const MessagesTable = (props) => {
  const {
    items = [],
  } = props;

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
                  Date Started
                </TableCell>
                <TableCell>
                  User Question
                </TableCell>
                <TableCell>
                  ChatBot Response
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((msg, i) => {
                console.log(msg)
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
