import PropTypes from 'prop-types';
import {format} from 'date-fns';
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
import {Scrollbar} from 'src/components/scrollbar';
import {QueueListIcon} from '@heroicons/react/24/solid';
import {useApi} from "../../hooks/use-api";

export const LeadsTable = (props) => {
  const {
    items = [],
  } = props;

  const {
    companiesByCompanyId,
    getUserDataFromConvoMsgs,
  } = useApi()

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
                const dateStr = format((convo._ts*1000), 'MM/dd/yyyy')
                const timeStr = format((convo._ts*1000), 'p')
                const company = companiesByCompanyId && convo && convo.company_id && companiesByCompanyId[convo.company_id]
                const userData = getUserDataFromConvoMsgs(convo)
                return (
                  <TableRow
                    key={convo.id}
                  >
                    <TableCell>{i+1}</TableCell>
                    <TableCell>
                      <Stack direction={'column'} justifyContent={'center'}>
                        <Typography variant={'subtitle2'} textAlign={'center'}>{dateStr}</Typography>
                        <Typography variant={'subtitle2'} textAlign={'center'}>{timeStr}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{company.name}</TableCell>
                    <TableCell>{userData.user_first_name} {userData.user_last_name}</TableCell>
                    <TableCell>{userData.user_email}</TableCell>
                    <TableCell>{userData.user_phone_number}</TableCell><TableCell>
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
