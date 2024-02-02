import { Box, Button, CircularProgress, Container, Stack, Typography } from '@mui/material';
import { LogsTable } from './logs-table';
import { useRootAdmin } from '../../hooks/use-root-admin';

export const LogsSection = () => {
  const {
    loadingLogs,
    loadLogs,
    logsPage, logsRowsPerPage,
  } = useRootAdmin()

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Stack
            spacing={3}
            justifyContent={'space-between'}
            direction={'row'}
          >
            <Typography variant="h4">
              System Logs
              {loadingLogs && <CircularProgress />}
            </Typography>
            <Button
              disabled={loadingLogs}
              variant='contained'
              onClick={()=>loadLogs(logsPage, logsRowsPerPage)}
            >
              Load Logs
            </Button>
          </Stack>

          <LogsTable />
        </Stack>
      </Container>
    </Box>
  )
};
