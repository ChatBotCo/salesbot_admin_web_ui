import Head from 'next/head';
import { Box, CircularProgress, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useApi } from '../hooks/use-api';
import { OverviewConversationsByDate } from '../sections/overview/overview-conversations-by-date';

const now = new Date();

const Page = () => {
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
  // console.log(seriesData)

  return (
    <>
      <Head>
        <title>
          Sales Chatbot
        </title>
      </Head>
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
                chartSeries={seriesData}
                sx={{ height: '100%' }}
                title={'New Conversations per Date'}
              />
            </Grid>
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
    </>
  )
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
