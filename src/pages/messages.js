import Head from 'next/head';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useApi } from '../hooks/use-api';
import { MessagesTable } from '../sections/conversation/messages-table';
import NextLink from 'next/link';
import ArrowLeftIcon from '@heroicons/react/24/solid/ArrowLeftIcon';

const Page = () => {
  const {messagesForConvoId} = useApi()

  return (
    <>
      <Head>
        <title>
          Messages
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
                  href="/conversations"
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <ArrowLeftIcon />
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Conversation
                </Button>
                <Typography variant="h4">
                  Messages ({messagesForConvoId.length})
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
