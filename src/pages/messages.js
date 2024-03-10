import Head from 'next/head';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  SvgIcon,
  Typography
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useApi } from '../hooks/use-api';
import { MessagesTable } from '../sections/messages/messages-table';
import NextLink from 'next/link';
import ArrowLeftIcon from '@heroicons/react/24/solid/ArrowLeftIcon';

const Page = () => {
  const {
    messagesForConvoId,
    loading,
    navToMsgsFromLeadsTable,
  } = useApi()

  return (
    <>
      <Head>
        <title>
          GreeterBot
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Button
                  component={NextLink}
                  href={navToMsgsFromLeadsTable ? '/leads' : '/conversations'}
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <ArrowLeftIcon />
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  {navToMsgsFromLeadsTable ? 'Leads' : 'Conversation'}
                </Button>
                <Typography variant="h4">
                  Messages ({messagesForConvoId.length})
                  {loading && <CircularProgress />}
                </Typography>
              </Stack>
            </Stack>
            <MessagesTable
              items={messagesForConvoId}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
