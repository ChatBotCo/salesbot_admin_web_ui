import Head from 'next/head';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { ChatBotSection } from '../sections/chatbot/chatbots_section';

const Page = () => {
  return (
    <>
      <Head>
        <title>
          Chatbot
        </title>
      </Head>
      <ChatBotSection />
    </>
  )
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
