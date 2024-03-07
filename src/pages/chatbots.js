import Head from 'next/head';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { ChatBotSection } from '../sections/chatbot/chatbots_section';
import { ColorPicker } from '../components/color-picker';

const Page = () => {
  return (
    <>
      <Head>
        <title>
          Greeter.Bot
        </title>
      </Head>
      {/*<ColorPicker/>*/}
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
