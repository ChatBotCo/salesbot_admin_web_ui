import Head from 'next/head';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { LogsSection } from '../sections/logs/logs-section';

const Page = () => {
  return (
    <>
      <Head>
        <title>
          Keli.AI
        </title>
      </Head>
      <LogsSection />
    </>
  )
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
