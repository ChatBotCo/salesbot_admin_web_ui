import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormLabel,
  Stack,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';
import PropTypes from 'prop-types';
import { useApi } from '../../hooks/use-api';

const defaultValues = {
  name: '',
  description: '',
  email_for_leads: '',
}

export const CompanyEdit = (props) => {
  const {
    company,
  } = props;

  const {
    loading,
    saving,
    saveCompanyChanges,
  } = useApi()

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
    setValues(company || defaultValues)
  }, [company])

  useEffect(() => {
    if(company) {
      let changes = false;
      for (let key in defaultValues) {
        if (values[key] !== company[key]) {
          changes = true;
          break;
        }
      }
      setUnsavedChanges(changes);
    }
  }, [values, company])

  // if(!company) return <>{loading && <CircularProgress />}</>

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      <Stack direction={'row'} sx={{ justifyContent: 'flex-end', mb:2 }}>
        {saving ? <CircularProgress /> :  (
          <Button
            disabled={!(company && unsavedChanges)}
            variant="contained"
            onClick={()=>{
              saveCompanyChanges(values)
            }}
          >
            {(company && unsavedChanges) ? 'Save Changes' : 'No Unsaved Changes'}
          </Button>
        )}
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
                Name
              </FormLabel>
              <TextField
                fullWidth
                helperText="What is the name of your company?"
                name="name"
                onChange={handleChange}
                required
                value={values.name || ''}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{mb:2}}>
        <CardContent>
          <Grid
            container
          >
            <Grid
              xs={12}
            >
              <FormLabel id="contact-radio-buttons-group">
                Description
              </FormLabel>
              <TextField
                fullWidth
                helperText="Provide a brief (1-2 sentences) description of what your company does or sells."
                name="description"
                onChange={handleChange}
                required
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
    </form>
  );
};

CompanyEdit.propTypes = {
  company: PropTypes.object
};
