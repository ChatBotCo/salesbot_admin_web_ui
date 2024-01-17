import Head from 'next/head';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { MetricsGrid } from '../sections/metrics/metrics-grid';
import { useAuth } from '../hooks/use-auth';
import { NewUser } from '../sections/new_user/new-user';
import { Box, Container } from '@mui/material';
import { useApi } from '../hooks/use-api';
import { ChatBotSection } from '../sections/chatbot/chatbots_section';

const now = new Date();

const Page = () => {
  const {
    onboardingStep,
    onboardingSteps,
  } = useApi()

  console.log(onboardingStep)

  let displayEl = <></>
  switch (onboardingStep) {
    case onboardingSteps.createCompany:
      displayEl = <NewUser />
      break
    case onboardingSteps.customizeChatbot:
      displayEl = <ChatBotSection />
      break
    case onboardingSteps.scrapeLinks:
      // navMenuButtons = (
      //   <SideNavItem
      //     active={true}
      //     icon={(
      //       <SvgIcon fontSize="small">
      //         <AcademicCapIcon />
      //       </SvgIcon>
      //     )}
      //     key={'Train Your Chat Bot'}
      //     path={'/links'}
      //     title={'Train Your Chat Bot'}
      //   />
      // )
      break
    case onboardingSteps.done:
      displayEl = <MetricsGrid />
      break;
    default:
      displayEl = <></>
      break
  }

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
        <Container maxWidth="xl">
          {displayEl}
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
