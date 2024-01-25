import { format } from 'date-fns';
import {
  Box,
  Button,
  Card,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { CheckCircleIcon as CheckCircleIconSolid, QueueListIcon } from '@heroicons/react/24/solid';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/use-auth';
import { useApi } from '../../hooks/use-api';
import { useEffect, useState } from 'react';

export const ConversationsTable = () => {

  const {
    user,
  } = useAuth()

  const {
    conversationsByCompanyId,
    companiesByCompanyId,
    selectedCompanyId,
    deleteConvo,
    convoHasUserData,
    msgsByConvoId,
    messageCountsPerConvo,
  } = useApi()

  const [conversations, setConversations] = useState([]);
  const [mostRecentMsgByConvoId, setMostRecentMsgByConvoId] = useState({});

  const mostRecentMessageForConvo = convo=>{
    const msgs = msgsByConvoId[convo.id] || []
    const sortedMsgs = msgs.sort((a, b) => {
      if (a._ts < b._ts) {
        return 1;
      }
      if (a._ts > b._ts) {
        return -1;
      }
      return 0;
    });
    if(sortedMsgs.length) {
      return sortedMsgs[0]
    } else {
      return null
    }
  }

  useEffect(() => {
    const company = companiesByCompanyId[selectedCompanyId]
    if(company) {
      const convos = conversationsByCompanyId[selectedCompanyId] || []

      let _mostRecentMsgByConvoId = convos.reduce((acc, convo) => {
        acc[convo.id] = mostRecentMessageForConvo(convo)
        return acc;
      }, {});
      setMostRecentMsgByConvoId(_mostRecentMsgByConvoId)

      const sortedConvos = convos.sort((convoA, convoB) => {
        const msgA = _mostRecentMsgByConvoId[convoA.id] || {_ts:0}
        const msgB = _mostRecentMsgByConvoId[convoB.id] || {_ts:0}
        if (msgA._ts < msgB._ts) {
          return 1;
        }
        if (msgA._ts > msgB._ts) {
          return -1;
        }
        return 0;
      });
      const filteredSortedItems = sortedConvos.filter(convo=>messageCountsPerConvo[convo.id])
      setConversations(filteredSortedItems)
    } else {
      setConversations([])
    }
  },[selectedCompanyId, conversationsByCompanyId, companiesByCompanyId, msgsByConvoId]);

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
                  Last Message
                </TableCell>
                {
                  user && user.role==='root' && (
                    <TableCell>
                      Database ID
                    </TableCell>
                  )
                }
                <TableCell/>
                <TableCell>Many Messages</TableCell>
                <TableCell>Lead Generated?</TableCell>
                {
                  user && user.role === 'root' && <TableCell/>
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {conversations.map((convo, i) => {
                const msg = mostRecentMsgByConvoId[convo.id] || {_ts:0}
                const dateStr = format((msg._ts*1000), 'MM/dd/yyyy')
                const timeStr = format((msg._ts*1000), 'p')
                const leadGen = convoHasUserData(convo) ? (
                  <Stack direction={'row'} justifyContent={'center'}>
                    <Typography variant='subtitle2'>YES</Typography>
                    <SvgIcon fontSize="small" color={'success'}>
                      <CheckCircleIconSolid />
                    </SvgIcon>
                  </Stack>
                ) : ''
                return (
                  <TableRow
                    hover
                    key={convo.id}
                    sx={{cursor:'pointer'}}
                  >
                    <TableCell>
                      {i+1}
                    </TableCell>
                    <TableCell>
                      <Stack direction={'column'} justifyContent={'center'}>
                        <Typography variant={'subtitle2'} textAlign={'center'}>{dateStr}</Typography>
                        <Typography variant={'subtitle2'} textAlign={'center'}>{timeStr}</Typography>
                      </Stack>
                    </TableCell>
                    {
                      user && user.role==='root' && (
                        <TableCell>
                          {convo.id}
                        </TableCell>
                      )
                    }
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
                    <TableCell>
                      <Stack direction={'row'} justifyContent={'center'}>
                        {messageCountsPerConvo[convo.id]}
                      </Stack>
                    </TableCell>
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
