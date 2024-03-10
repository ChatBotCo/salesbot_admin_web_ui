import Head from 'next/head';
import {Layout as DashboardLayout} from 'src/layouts/dashboard/layout';
import {UsersTable} from "../sections/users/users-table";

const Page = () => {
  return (
    <>
      <Head>
        <title>
          GreeterBot
        </title>
      </Head>
      <UsersTable />
    </>
  )
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
