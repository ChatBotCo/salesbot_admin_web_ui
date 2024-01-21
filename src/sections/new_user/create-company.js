import { useCallback, useState, useEffect } from 'react';
import {
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormLabel, Snackbar,
  Stack,
  TextField,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { useApi } from '../../hooks/use-api';
import { InfoPopover } from '../../components/info-popover';

export const CreateCompany = () => {

  const {
    loading,
    saving,
    createCompany,
    showSaveResults, saveResults, handleDismissSaveResults, saveResultsSeverity,
  } = useApi()

  const defaultValues = {
    name:'',
    description:'',
    email_for_leads:'',
  }

  const [values, setValues] = useState(defaultValues);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const handleChange = useCallback(
    (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
    },
    []
  );

  useEffect(() => {
    let changes = false;
    for (let key in defaultValues) {
      if (values[key] !== defaultValues[key]) {
        changes = true;
        break;
      }
    }
    setUnsavedChanges(changes);
  }, [values])

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={4}
      >
        <Stack spacing={1}>
          <Typography variant="h4">
            Before we begin...
          </Typography>
          <Typography variant="h6">
            Please tell us a little about your company
          </Typography>
          <Typography varient="subtitle1">
            This information will be fed into the chatbot to inform it about your company and how to sell it.
          </Typography>
        </Stack>
        <div>
          {saving ? <CircularProgress /> :  (
            <Button
              disabled={!unsavedChanges}
              variant="contained"
              onClick={()=>{
                createCompany(values)
              }}
            >
              {unsavedChanges ? 'Save Changes' : 'No Unsaved Changes'}
            </Button>
          )}
        </div>
      </Stack>

      <Card sx={{mt:2}}>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={6}
            >
              <FormLabel id="company-name">
                <InfoPopover infoText={'The chatbot will use this to represent your company'} id={'company-name'} />
                What is the name of your company?
              </FormLabel>
              <TextField
                aria-labelledby="company-name"
                fullWidth
                label="Type here"
                name="name"
                onChange={handleChange}
                value={values.name || ''}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{mt:2}}>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={6}
            >
              <FormLabel id="company-description">
                <InfoPopover infoText={'The chatbot will use this to introduce your company to your site visitors'} id={'products-services'} />
                What type of products or services does your company sell?
              </FormLabel>
              <TextField
                aria-labelledby="company-description"
                fullWidth
                label="Type here"
                name="description"
                onChange={handleChange}
                value={values.description || ''}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{mt:2}}>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={6}
            >
              <FormLabel id="company-email_for_leads">Contact email for this company</FormLabel>
              <TextField
                aria-labelledby="company-email_for_leads"
                fullWidth
                helperText="The email where we will send generated leads"
                label="Type here"
                name="email_for_leads"
                onChange={handleChange}
                value={values.email_for_leads || ''}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Snackbar open={showSaveResults} autoHideDuration={6000} onClose={handleDismissSaveResults}>
        <Alert onClose={handleDismissSaveResults} severity={saveResultsSeverity} sx={{ width: '100%' }}>
          {saveResults}
        </Alert>
      </Snackbar>
    </form>
  );
};
