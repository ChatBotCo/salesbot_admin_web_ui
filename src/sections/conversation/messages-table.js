import PropTypes from 'prop-types';
import { Box, Card, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { useApi } from '../../hooks/use-api';
import { MessageRow } from './message-row';

export const MessagesTable = (props) => {
  const {
    items = [],
  } = props;

  const {
    refinements,
  } = useApi()

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
                <TableCell/>
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
                  Feedback (optional)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedItems.map((msg, i) => {
                const refinement = refinements.find(r=>r.message_id===msg.id)
                return <MessageRow refinement={refinement} msg={msg} rowIndex={i} key={i} />
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
