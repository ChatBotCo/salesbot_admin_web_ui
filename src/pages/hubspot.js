import Head from 'next/head';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent, CircularProgress,
  Container,
  FormLabel,
  Snackbar,
  Stack,
  TextField,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useApi } from '../hooks/use-api';
import { useCallback, useEffect, useState } from 'react';
import { useHubspot } from '../hooks/use-hubspot';

const Page = () => {
  const {
    saving,
    loading,
    companiesByCompanyId,
    showSaveResults, saveResults, handleDismissSaveResults, saveResultsSeverity,
    selectedCompanyId,
    saveCompanyChanges,
  } = useApi()

  const {

  } = useHubspot()

  const [selectedCompany, setSelectedCompany] = useState({});

  useEffect(() => {
    const company = companiesByCompanyId[selectedCompanyId]
    setSelectedCompany(company)
    if(company){
      setAccessToken(company.hubspot_access_token || '')
    }
  }, [companiesByCompanyId, selectedCompanyId])

  const [accessToken, setAccessToken] = useState('');

  const handleChange = useCallback(
    event => {
      setAccessToken(event.target.value)
    },
    []
  );

  const handleSave = ()=>{
    if(selectedCompany && accessToken) {
      const company = {
        ...selectedCompany,
        hubspot_access_token: accessToken
      }
      saveCompanyChanges(company)
    } else {
      window.alert('no selected company or no access token provided')
    }
  }

  const st = {
    fontFamily: 'Source Code Pro,Consolas,Monaco,Courier New,monospace',
    fontWeight: '500',
    borderRadius: '3px',
    backgroundColor: '#eaf0f6',
    padding: '2px 4px',
    margin: '4px',
    maxWidth: '220px',
    textAlign: 'center',
    fontSize: 'small',
    listStyle: 'none'
  }

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
          flexGrow: 1,
          py: 8
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
                <Typography variant="h4">
                  Connect Your HubSpot Account
                  {(saving || loading) && <CircularProgress />}
                </Typography>
              </Stack>
            </Stack>

            <Card sx={{mb:2}}>
              <CardContent>
                <Grid
                  container
                >
                  <Grid
                    xs={12}
                  >
                    <FormLabel id="contact-radio-buttons-group">
                      Enter the access token for your HubSpot private app
                    </FormLabel>
                    <TextField
                      fullWidth
                      helperText="Private app access token"
                      name="name"
                      onChange={handleChange}
                      required
                      value={accessToken}
                    />
                    <Typography>
                      Create a private app in your HubSpot account
                      (<a href='https://developers.hubspot.com/docs/api/private-apps#create-a-private-app'>follow instructions HERE</a>).
                      It does not matter what the name of the private app is.<p/>
                      The private app will require the following scopes:
                      <ul>
                        <li style={st}>crm.objects.contacts.write</li>
                        <li style={st}>crm.schemas.contacts.write</li>
                        <li style={st}>crm.objects.contacts.read</li>
                        <li style={st}>crm.objects.deals.read</li>
                        <li style={st}>crm.schemas.deals.read</li>
                      </ul>
                      Copy/paste the access token for the private app you create here.
                    </Typography>
                  </Grid>
                </Grid>
                <CardActions>
                  {
                    selectedCompany &&
                    selectedCompany.hubspot_access_token !== accessToken &&
                    accessToken &&
                    <Button
                      variant={'contained'}
                      onClick={handleSave}
                      sx={{maxWidth:'250px'}}
                    >
                      Save
                    </Button>
                  }
                </CardActions>
              </CardContent>
            </Card>
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
