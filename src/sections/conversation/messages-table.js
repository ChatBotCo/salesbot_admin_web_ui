import PropTypes from 'prop-types';
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
  TableRow
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { useApi } from '../../hooks/use-api';
import { HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/react/24/solid';
import { RefinementEditRow } from './refinement-edit-row';

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
                  User Data Collected
                </TableCell>
                <TableCell>
                  Feedback (optional)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedItems.map((msg, i) => {
                const refinement = refinements.find(r=>r.message_id===msg.id)
                refinement && console.log(refinement)
                let refineUp = false
                let refineDown = false
                if(refinement) {
                  refineUp = refinement.is_positive
                  refineDown = !refinement.is_positive
                }
                const userData = Object.entries(msg)
                                       .filter(([key, value]) => key.startsWith('user_') && key !== 'user_msg' && (typeof value === 'string' || (typeof value === 'boolean' && value)))
                                       .map(([key, value]) => `${key}: ${value}`)
                                       .join(', ');
                return (
                  <>
                  <TableRow
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
                    <TableCell>
                      <Stack direction={'row'}>
                        <Button
                          variant={refineUp && 'contained'}
                        >
                          <SvgIcon fontSize="small">
                            <HandThumbUpIcon />
                          </SvgIcon>
                        </Button>
                        <Button
                          variant={refineDown && 'contained'}
                        >
                          <SvgIcon fontSize="small">
                            <HandThumbDownIcon />
                          </SvgIcon>
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                  {
                    refinement && (<RefinementEditRow refinement={refinement} msg={msg}/> )
                  }
                  </>
                )
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
