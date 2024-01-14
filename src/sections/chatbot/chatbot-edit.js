import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox, CircularProgress,
  Divider,
  FormControlLabel, FormLabel, Radio, RadioGroup, Stack,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';
import PropTypes from 'prop-types';
import {useApi} from "../../hooks/use-api";

const llmModels = [
  {
    value: 'salesbot-gpt-4-1106-preview',
    label: 'OpenAI Chat GPT-4'
  },
  {
    value: 'keli-35-turbo',
    label: 'OpenAI Chat GPT-3.5'
  },
];

const defaultValues = {
  show_avatar: true,
  llm_model: 'keli-35-turbo',
  contact_prompt: '',
  contact_link: '',
  contact_method: '',
  greeting: '',
}

export const ChatbotEdit = (props) => {
  const {
    chatbot,
  } = props;

  const {
    loading,
    saving,
    saveChatbotChanges,
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
    setValues(chatbot || defaultValues)
  }, [chatbot])

  useEffect(() => {
    if(chatbot) {
      let changes = false;
      for (let key in defaultValues) {
        if (values[key] !== chatbot[key]) {
          changes = true;
          break;
        }
      }
      setUnsavedChanges(changes);
    }
  }, [values, chatbot])

  // console.log(values)

  if(!chatbot) return <>{loading && <CircularProgress />}</>

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      <Stack direction={'row'} sx={{ justifyContent: 'flex-end', mb:2 }}>
        {saving ? <CircularProgress /> :  (
          <Button
            disabled={!(chatbot && unsavedChanges)}
            variant="contained"
            onClick={()=>{
              saveChatbotChanges(values)
            }}
          >
            {(chatbot && unsavedChanges) ? 'Save Changes' : 'No Unsaved Changes'}
          </Button>
        )}
      </Stack>

      <Card sx={{mb:2}}>
        <CardContent>
          <Grid
            container
          >
            <Grid
              xs={6}
            >
              <FormLabel id="llm-model-picker">Which LLM model would you like to use?</FormLabel>
              <TextField
                aria-labelledby="llm-model-picker"
                fullWidth
                label="LLM Model"
                name="llm_model"
                onChange={handleChange}
                select
                SelectProps={{ native: true }}
                value={values.llm_model}
              >
                {llmModels.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{mb:2}}>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            {/*"contact_prompt": "Try to get the customer to fill out the 'Contact Us' form so that a human representative can contact them to discuss what they require.",*/}
            {/*"contact_link": "https://saleschat.bot/contact-us/",*/}
            {/*"contact_method": 'app_install',*/}
            {/*"greeting": "Hi! Ask me how AI will your boost sales",*/}
            <Grid
              xs={12}
              md={6}
            >
              <FormLabel id="contact-radio-buttons-group">How should the chatbot create a lead?</FormLabel>
              <RadioGroup
                aria-labelledby="contact-radio-buttons-group"
                name="contact_method"
                value={values.contact_method || 'app_install'}
                onChange={handleChange}
              >
                <FormControlLabel value="app_install" control={<Radio />} label="Try to get the user to install the app" />
                <FormControlLabel value="contact_form" control={<Radio />} label="Try to get the user to fill out a contact form" />
              </RadioGroup>
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <TextField
                fullWidth
                helperText="Provide a URL to a webpage that instructs your users how to install your app."
                label="Where should they be redirected if they want to install your app?"
                name="contact_link"
                onChange={handleChange}
                value={values.contact_link || ''}
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
              <FormLabel id="contact-radio-buttons-group">How should the chatbot greet visitors to your website?</FormLabel>
              <TextField
                fullWidth
                helperText="Provide the default greeting from your chatbot"
                name="greeting"
                onChange={handleChange}
                required
                value={values.greeting || ''}
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
              <FormControlLabel control={
                <Checkbox
                  checked={values.show_avatar || false}
                  onChange={handleChangeCheckbox}
                  name="show_avatar"
                />
              } label="Show Animated Avatar Character" />
            </Grid>
            {values.show_avatar && (
              <Grid
                xs={12}
              >
                <Card sx={{border: '1px solid lightgray'}}>
                  <CardHeader
                    title="Customize Your Avatar"
                  />
                  <CardContent sx={{ pt: 0 }}>
                    <Box sx={{ m: -1.5 }}>
                      <Grid
                        container
                        spacing={3}
                      >

                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};

ChatbotEdit.propTypes = {
  chatbot: PropTypes.object
};
