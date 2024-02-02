import {
  Box,
  Card,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import {
  ChevronLeftRoundedIcon,
  ChevronRightRoundedIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  FirstPageRoundedIcon,
  InformationCircleIcon,
  LastPageRoundedIcon
} from '@heroicons/react/24/solid';
import { InformationCircleIcon as InformationCircleIconOutline } from '@heroicons/react/24/outline';
import { useRootAdmin } from '../../hooks/use-root-admin';

export const LogsTable = (props) => {
  const {
  } = props;

  const {
    logMsgs,
    loadLogs,
    logsPage, setLogsPage,
    logsRowsPerPage, setLogsRowsPerPage,
    logsManyTotal,
  } = useRootAdmin()

  const handleChangePage = (event, newPage) => {
    setLogsPage(newPage);
    loadLogs(newPage, logsRowsPerPage)
  };

  const handleChangeRowsPerPage = (event) => {
    const _newRowsPerPage = parseInt(event.target.value, 10)
    setLogsRowsPerPage(_newRowsPerPage);
    setLogsPage(0);
    loadLogs(0, _newRowsPerPage)
  };

  console.log(logsManyTotal)

  // "id": "18963001-e878-4eef-8191-0e4403e368b4",
  //   "time": "2024-02-02T17:43:36.6317910Z",
  //   "level": 10,
  //   "levelStr": "Debug",
  //   "msg": "Poll",
  return (
    <Card>
      <Scrollbar sx={{maxHeight:400}}>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10, 50, 100]}
                  colSpan={4}
                  count={logsManyTotal}
                  rowsPerPage={logsRowsPerPage}
                  page={logsPage}
                  showFirstButton={true}
                  showLastButton={true}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
              <TableRow>
                <TableCell sx={{width:'1px'}}/>
                <TableCell sx={{width:'1px'}}>Level</TableCell>
                <TableCell sx={{width:'1px'}}>Timestamp</TableCell>
                <TableCell sx={{width:'100%'}}>Log Message</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logMsgs.map((logMsg,i) => {
                let textColor
                let levelIcon
                switch (logMsg.levelStr) {
                  case 'Debug':
                    textColor = 'primary'
                    levelIcon = (<SvgIcon fontSize="small" color={textColor}>
                      <InformationCircleIconOutline />
                    </SvgIcon>)
                    break;
                  case 'Info':
                    textColor = '#4caf50'
                    levelIcon = (<SvgIcon fontSize="small" color={'success'}>
                      <InformationCircleIcon />
                    </SvgIcon>)
                    break;
                  case 'Warn':
                    textColor = '#ff9800'
                    levelIcon = (<SvgIcon fontSize="small" color={'warning'}>
                      <ExclamationTriangleIcon />
                    </SvgIcon>)
                    break;
                  case 'Error':
                    textColor = 'error'
                    levelIcon = (<SvgIcon fontSize="small" color={textColor}>
                      <ExclamationCircleIcon />
                    </SvgIcon>)
                    break;
                }

                const date = new Date(logMsg.time);

                const formattedDate = new Intl.DateTimeFormat('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true
                }).format(date);

                return (
                  <TableRow
                    key={logMsg.id}
                  >
                    <TableCell sx={{
                      width:'1px',
                      fontSize:'x-small',
                      p:1,
                    }}>{i+1}</TableCell>
                    <TableCell sx={{width:'1px',p:1}}>
                      <Stack direction={'row'} justifyContent={'center'}>
                        {levelIcon}
                        <Typography
                          color={textColor}
                          fontSize={'x-small'}
                          sx={{pt:0.5}}
                        >
                          {logMsg.levelStr}
                        </Typography>
                    </Stack>
                    </TableCell>
                    <TableCell sx={{
                      width:'1px',
                      whiteSpace: 'nowrap',
                      fontSize:'x-small',
                      p:1,
                    }}>
                      {formattedDate}
                    </TableCell>
                    <TableCell sx={{width:'100%',p:1}}>
                      {logMsg.msg}
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

LogsTable.propTypes = {
};
