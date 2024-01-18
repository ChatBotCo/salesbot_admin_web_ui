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

const llmModels = [
  {
    value: 'salesbot-gpt-4-1106-preview',
    label: 'Slow and accurate (GPT v4)'
  },
  {
    value: 'keli-35-turbo',
    label: 'Fast and slightly-less-accurate (GPT v3.5)'
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

  const onClickSave = () => {
    if(values.contact_method !== 'none' && values.contact_link === '') {
      alert('Please provide a redirect webpage for the call-to-action button')
    } else {
      saveChatbotChanges(values)
    }
  }

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
            disabled={!(chatbot)}
            variant="contained"
            onClick={onClickSave}
          >
            {(chatbot) ? 'Save Changes' : 'No Unsaved Changes'}
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
              md={6}
            >
              <FormLabel id="llm-model-picker">
                <InfoPopover infoText={'LLM choice impacts speed and accuracy.  3.5 is fast but occasionally inaccurate.  4 is slower but much more effective and accurate.'} id={'models-info'} />
                Which LLM model would you like to use?
              </FormLabel>
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
          >
            <Grid
              xs={12}
            >
              <FormLabel id="contact-radio-buttons-group">
                <InfoPopover infoText={'This is the initial text that is displayed in a speech bubble that should entice your site visitors to engage with the chatbot.'} id={'greeting-info'} />
                How should the chatbot greet visitors to your website?
              </FormLabel>
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
              <FormLabel id="contact-radio-buttons-group">
                <InfoPopover
                  infoText={'The call-to-action button appears prominantly below the chat window and redirects the user to another webpage.  With this setting you are instructing the chatbot the purpose of this other webpage and how it should encourage people to click on the button'}
                  id={'lead-info'}
                  extra={<img style={{width:'200px', marginLeft:'10px', marginBottom:'10px'}} src='/assets/call-to-action-button.png'/>}
                />
                What should the call-to-action do?
              </FormLabel>
              <RadioGroup
                aria-labelledby="contact-radio-buttons-group"
                name="contact_method"
                value={values.contact_method || 'app_install'}
                onChange={handleChange}
              >
                <FormControlLabel value="app_install" control={<Radio />} label="Helps the user install our app" />
                <FormControlLabel value="contact_form" control={<Radio />} label="Takes the user to a contact form" />
                <FormControlLabel value="none" control={<Radio />} label="No call-to-action button" />
              </RadioGroup>
            </Grid>
            {
              values.contact_method !== 'none' && (
                  <Grid
                    xs={12}
                    md={6}
                  >
                    <FormLabel id="contact-link-label">
                      <InfoPopover
                        infoText={'If the user clicks on the call-to-action - where do you want to redirect them?'}
                        id={'contact-link'}
                      />
                      Call-to-action redirect webpage
                    </FormLabel>
                    <TextField
                      aria-labelledby="contact-link-label"
                      fullWidth
                      error={values.contact_method !== 'none' && values.contact_link === ''}
                      name="contact_link"
                      onChange={handleChange}
                      value={values.contact_link || ''}
                    />
                  </Grid>
                )
            }
            {/*<Grid*/}
            {/*  xs={12}*/}
            {/*  md={6}*/}
            {/*>*/}
            {/*  <FormLabel id="contact-prompt-label">*/}
            {/*    <InfoPopover infoText={'Instruct the chatbot exactly how you want it to sell your products or services to your customers'} id={'contact-prompt-info'} />*/}
            {/*    Custom instructions or sales strategy*/}
            {/*  </FormLabel>*/}
            {/*  <TextField*/}
            {/*    aria-labelledby="contact-prompt-label"*/}
            {/*    fullWidth*/}
            {/*    name="contact_prompt"*/}
            {/*    onChange={handleChange}*/}
            {/*    value={values.contact_prompt || ''}*/}
            {/*  />*/}
            {/*</Grid>*/}
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
              } label={<>Show Animated Avatar Character<InfoPopover infoText={'If checked then an animated 3D character will read the chatbot responses'} id={'show-avatar-info'} /></>} />
            </Grid>
            {/*{values.show_avatar && (*/}
            {/*  <Grid*/}
            {/*    xs={12}*/}
            {/*  >*/}
            {/*    <Card sx={{border: '1px solid lightgray'}}>*/}
            {/*      <CardHeader*/}
            {/*        title="Customize Your Avatar"*/}
            {/*      />*/}
            {/*      <CardContent sx={{ pt: 0 }}>*/}
            {/*        <Box sx={{ m: -1.5 }}>*/}
            {/*          <Grid*/}
            {/*            container*/}
            {/*            spacing={3}*/}
            {/*          >*/}

            {/*          </Grid>*/}
            {/*        </Box>*/}
            {/*      </CardContent>*/}
            {/*    </Card>*/}
            {/*  </Grid>*/}
            {/*)}*/}
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};

ChatbotEdit.propTypes = {
  chatbot: PropTypes.object
};
