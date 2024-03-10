import Head from 'next/head';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { LinksSection } from '../sections/links/links-section';

const Page = () => {
  return (
    <>
      <Head>
        <title>
          GreeterBot
        </title>
      </Head>
      <LinksSection />
    </>
  )
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
