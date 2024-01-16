import {useCallback, useEffect, useState} from 'react';
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';
import PropTypes from 'prop-types';
import {useApi} from "../../hooks/use-api";
import {InfoPopover} from "../../components/info-popover";

const defaultValues = {
  name: '',
  description: '',
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

  const handleChangeCheckbox = useCallback(
    (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.checked
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

  if(!company) return <>{loading && <CircularProgress />}</>

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
                helperText="What is the name of your company?"
                name="description"
                onChange={handleChange}
                required
                value={values.description || ''}
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
