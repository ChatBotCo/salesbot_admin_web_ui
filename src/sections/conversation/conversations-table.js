import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Box,
  Button,
  Card,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import NextLink from 'next/link';
import { QueueListIcon } from '@heroicons/react/24/solid';

export const ConversationsTable = (props) => {
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
                <TableCell/>
                <TableCell>
                  Date Started
                </TableCell>
                <TableCell>
                  ID
                </TableCell>
                <TableCell/>
                <TableCell>Many Messages</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((convo, i) => {
                return (
                  <TableRow
                    hover
                    key={convo.id}
                    onClick={()=>console.log('click row')}
                    sx={{cursor:'pointer'}}
                  >
                    <TableCell>
                      {i+1}
                    </TableCell>
                    <TableCell>
                      {format((convo._ts*1000), 'MM/dd/yyyy hh:mm pp')}
                    </TableCell>
                    <TableCell>
                      {convo.id}
                    </TableCell>
                    <TableCell>
                      <Button
                        href={`/messages?convo_id=${convo.id}`}
                        startIcon={(
                          <SvgIcon fontSize="small">
                            <QueueListIcon />
                          </SvgIcon>
                        )}
                        sx={{ mt: 3 }}
                        variant="contained"
                      >
                        Messages
                      </Button>
                    </TableCell>
                    <TableCell>{convo.many_msgs}</TableCell>
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

ConversationsTable.propTypes = {
  items: PropTypes.array,
};
