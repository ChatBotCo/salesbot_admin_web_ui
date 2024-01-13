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

export const LeadsTable = (props) => {
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
                <TableCell>#</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell/>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((convo, i) => {
                return (
                  <TableRow
                    key={convo.id}
                  >
                    <TableCell>{i+1}</TableCell>
                    <TableCell>
                      {format((convo._ts*1000), 'MM/dd/yyyy hh:mm pp')}
                    </TableCell>
                    <TableCell>{convo.company_id}</TableCell>
                    <TableCell>{convo.user_first_name} {convo.user_last_name}</TableCell>
                    <TableCell>{convo.user_email}</TableCell>
                    <TableCell>{convo.user_phone_number}</TableCell><TableCell>
                    <Button
                      href={`/messages?convo_id=${convo.id}&from_leads=true`}
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

LeadsTable.propTypes = {
  items: PropTypes.array,
};
