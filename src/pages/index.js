import Head from 'next/head';
import {Layout as DashboardLayout} from 'src/layouts/dashboard/layout';
import {MetricsGrid} from '../sections/metrics/metrics-grid';
import {CreateCompany} from '../sections/new_user/create-company';
import {Box, Container} from '@mui/material';
import {useApi} from '../hooks/use-api';
import {ChatBotSection} from '../sections/chatbot/chatbots_section';
import {LinksSection} from '../sections/links/links-section';
import {useAuth} from '../hooks/use-auth';
import {ApprovalStatusSection} from "../sections/users/approval-status-section";

const Page = () => {
  const {
    onboardingStep,
    onboardingSteps,
    userApprovalStatus,
  } = useApi()

  const {user} = useAuth()

  let displayEl
  if(!user) displayEl = <></>
  else if(userApprovalStatus !== 'approved'){
    displayEl = <ApprovalStatusSection />
  } else {
    switch (onboardingStep) {
      case onboardingSteps.createCompany:
        displayEl = <CreateCompany />
        break
      case onboardingSteps.customizeChatbot:
        displayEl = <ChatBotSection />
        break
      case onboardingSteps.scrapeLinks:
        displayEl = <LinksSection />
        break
      case onboardingSteps.done:
        displayEl = <MetricsGrid />
        break;
      default:
        displayEl = <></>
        break
    }
  }

  return (
    <>
      <Head>
        <title>
          Greeter.Bot
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
