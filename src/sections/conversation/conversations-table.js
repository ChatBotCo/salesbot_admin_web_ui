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
import {TrashIcon} from "@heroicons/react/24/outline";
import {useAuth} from "../../hooks/use-auth";
import {useApi} from "../../hooks/use-api";

export const ConversationsTable = (props) => {
  const {
    items = [],
    messageCountsPerConvo = {},
  } = props;

  const {
    user,
  } = useAuth()

  const {
    deleteConvo,
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

  const filteredSortedItems = sortedItems.filter(convo=>messageCountsPerConvo[convo.id])

  const handleDeleteConvo = convoId => {
    if(window.confirm('Are you sure you want to delete this conversation permanently?')) {
      deleteConvo(convoId)
    }
  }

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
                <TableCell>Lead Generated?</TableCell>
                {
                  user && user.role === 'root' && <TableCell/>
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSortedItems.map((convo, i) => {
                const leadGen = (convo.user_email || convo.user_phone_number) ? 'YES' : ''
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
                    <TableCell>{messageCountsPerConvo[convo.id]}</TableCell>
                    <TableCell>{leadGen}</TableCell>
                    {
                      user && user.role === 'root' && (
                        <TableCell>
                          <Button
                            onClick={()=>handleDeleteConvo(convo.id)}
                          >
                            <SvgIcon fontSize="small">
                              <TrashIcon />
                            </SvgIcon>
                          </Button>
                        </TableCell>
                      )
                    }
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
  messageCountsPerConvo: PropTypes.object,
};
