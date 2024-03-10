import { Box, CircularProgress, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { OverviewConversationsByDate } from '../overview/overview-conversations-by-date';
import { useApi } from '../../hooks/use-api';

export const MetricsGrid = (props) => {
  const {countPerDayByCompanyId, msgCountPerDayByCompanyId, loading} = useApi();

  const seriesData = Object.keys(countPerDayByCompanyId).map(companyId=>{
    return {
      name: companyId,
      data: Object.values(countPerDayByCompanyId[companyId])
    }
  })
  const seriesData_msgCountPerDayByCompanyId = Object.keys(msgCountPerDayByCompanyId).map(companyId=>{
    return {
      name: companyId,
      data: Object.values(msgCountPerDayByCompanyId[companyId])
    }
  })

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      {loading && <CircularProgress />}
      <Container maxWidth="xl">
        <Grid
          container
          spacing={3}
        >
          <Grid
            xs={12}
            lg={8}
          >
            <OverviewConversationsByDate
              chartSeries={seriesData_msgCountPerDayByCompanyId}
              sx={{ height: '100%' }}
              title={'New Message per Date'}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
};

MetricsGrid.protoTypes = {
};
