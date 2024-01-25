import {Alert, Box, CircularProgress, Container, Snackbar, Stack, Typography} from '@mui/material';
import {useApi} from '../../hooks/use-api';
import {LinksTable} from './links-table';
import {LinksInputCard} from './links-input-card';
import {LinksStartScrape} from './links-start-scrape';
import {LinksTrainingComplete} from './links-training-complete';
import {LinksTrainingProgress} from './links-training-progress';

export const LinksSection = () => {
  const {
    loading,
    linksById,
    showSaveResults, saveResults, handleDismissSaveResults, saveResultsSeverity,
    companiesByCompanyId,
    selectedCompanyId,
  } = useApi()

  const linksForSelectedCompany = Object.values(linksById).filter(link=>link.company_id === selectedCompanyId)
  const selectedCompany = companiesByCompanyId[selectedCompanyId] || {}

  const hasLinks = linksForSelectedCompany.length > 0
  const hasIncompleteLinks = linksForSelectedCompany.filter(link=>link.status==='').length > 0
  const isCompanyTraining = selectedCompany.training

  let isTraingingComplete = false
  let trainingHeaderEl
  if(!hasLinks) {
    trainingHeaderEl = <LinksInputCard selectedCompanyId={selectedCompanyId} />
  } else if(hasLinks && hasIncompleteLinks && !isCompanyTraining) {
    trainingHeaderEl = <LinksStartScrape selectedCompanyId={selectedCompanyId}/>
  } else if(hasLinks && hasIncompleteLinks && isCompanyTraining) {
    const manyLinks = linksForSelectedCompany.length
    const manyCompleteLinks = linksForSelectedCompany.filter(link=>link.status!=='').length > 0
    trainingHeaderEl = <LinksTrainingProgress progress={Math.floor(manyCompleteLinks / manyLinks * 100)}/>
  } else {
    isTraingingComplete = true
    trainingHeaderEl = <LinksTrainingComplete />
  }

  return (
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
              {isTraingingComplete ? 'Chatbot Training Results' : 'Train Your Chatbot'}
              {loading && <CircularProgress />}
            </Typography>
          </Stack>
          {trainingHeaderEl}
          {linksForSelectedCompany.length ? <LinksTable items={linksForSelectedCompany} /> : ''}
        </Stack>
      </Container>
      <Snackbar open={showSaveResults} autoHideDuration={6000} onClose={handleDismissSaveResults}>
        <Alert onClose={handleDismissSaveResults} severity={saveResultsSeverity} sx={{ width: '100%' }}>
          {saveResults}
        </Alert>
      </Snackbar>
    </Box>
  )
};
