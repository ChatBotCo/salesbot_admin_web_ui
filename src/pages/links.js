import Head from 'next/head';
import {
  Alert,
  Box, Button,
  CircularProgress,
  Container, Modal,
  Snackbar,
  Stack, SvgIcon,
  Typography
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useApi } from '../hooks/use-api';
import { useState } from 'react';
import { CompanyTabs } from '../components/company-tabs';
import { LinksTable } from '../sections/links/links-table';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { AddLinkModal } from '../sections/links/add-link-modal';
import { LinksInputCard } from '../sections/links/links-input-card';
import { LinksStartScrape } from '../sections/links/links-start-scrape';

const Page = () => {
  const {
    loading,
    linksById,
    showSaveResults, saveResults, handleDismissSaveResults, saveResultsSeverity,
  } = useApi()

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);

  const linksForSelectedCompany = Object.values(linksById).filter(link=>link.company_id === selectedCompanyId)

  return (
    <>
      <AddLinkModal setShowAddLinkModal={setShowAddLinkModal} showAddLinkModal={showAddLinkModal} selectedCompanyId={selectedCompanyId} />
      <Head>
        <title>
          Training
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Stack
              spacing={3}
              justifyContent={'space-between'}
              direction={'row'}
            >
              <Typography variant="h4">
                Train Your Chat Bot
                {loading && <CircularProgress />}
              </Typography>
            </Stack>
            <CompanyTabs setSelectedCompanyId={setSelectedCompanyId} selectedCompanyId={selectedCompanyId}/>
            {!linksForSelectedCompany.length ? <LinksInputCard selectedCompanyId={selectedCompanyId} /> : ''}
            {linksForSelectedCompany.length ? <LinksStartScrape selectedCompanyId={selectedCompanyId}/> : ''}
            {linksForSelectedCompany.length ? <LinksTable items={linksForSelectedCompany} /> : ''}
          </Stack>
        </Container>
      </Box>
      <Snackbar open={showSaveResults} autoHideDuration={6000} onClose={handleDismissSaveResults}>
        <Alert onClose={handleDismissSaveResults} severity={saveResultsSeverity} sx={{ width: '100%' }}>
          {saveResults}
        </Alert>
      </Snackbar>
    </>
  )
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
