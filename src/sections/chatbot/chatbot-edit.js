import {useCallback, useEffect, useState} from 'react';
import {
  Button,
  Card, CardActions,
  CardContent, CardHeader,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack, SvgIcon,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';
import PropTypes from 'prop-types';
import {useApi} from "../../hooks/use-api";
import {InfoPopover} from "../../components/info-popover";
import { RedirectPromptRow } from './redirect-prompt-row';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { swap } from 'formik';
import { de } from 'date-fns/locale';

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
  llm_model: 'keli-35-turbo',
  contact_link: '',
  greeting: '',
  redirect_prompts: [],
  show_call_to_action: false,
  collect_user_info: false,
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
    const _values = chatbot || defaultValues
    if(!_values.redirect_prompts) _values.redirect_prompts = []
    setValues(_values)
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
    const incompleteRedirectPrompt = values.redirect_prompts.find(rdp=>{
      return !rdp.prompt ||
        !rdp.url ||
        !(rdp.prompt && rdp.prompt.trim()) ||
        !(rdp.url && rdp.url.trim())
    }) !== undefined

    if(values.show_call_to_action && !values.contact_link) {
      alert('Please provide a redirect webpage for the call-to-action button')
    } else if(values.show_call_to_action && !values.contact_link.startsWith('http')) {
      alert('Call-to-action URL needs to start with https://...')
    } else if(incompleteRedirectPrompt) {
      alert('Every "Redirect Action" needs to have both a prompt and a valid URL')
    } else {
      saveChatbotChanges(values)
    }
  }

  const addRedirectPrompt = ()=>{
    const _values = {...values}
    _values.redirect_prompts.push({prompt:'', url:''})
    setValues(_values)
  }
  const deleteRedirectPromptRow = rowIndex => {
    const _values = {...values}
    _values.redirect_prompts = _values.redirect_prompts.filter((_, index) => index !== rowIndex)
    setValues(_values)
  };

  const handleChangeRedirectRow = (event, rowIndex) => {
    const _values = {...values}
    _values.redirect_prompts.forEach((rowData, index) => {
      if(index === rowIndex) {
        rowData[event.target.name] = event.target.value
      }
    })
    setValues(_values)
  }

  const getAvatarViewImage = ()=>{
    switch(values.avatar_view) {
      case 'avatar':
        return '/assets/chat-with-avatar.png'
      case 'none':
        return '/assets/chat-without-avatar.png'
      case 'headshot':
      default:
        return '/assets/chat-with-headshot.png'


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
        <CardHeader title='AI Configuration' sx={{pb:0}}/>
        <CardContent sx={{pt:1}}>
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
        <CardHeader title='Avatar Character' sx={{pb:0}}/>
        <CardContent sx={{pt:1}}>
          <Grid
            container
          >
            <Grid
              xs={12}
              md={6}
            >
              <FormLabel id="show-avatar-radio-buttons-group">
                <InfoPopover
                  infoText={'The chatbot character is simply an adornment and does not impact the quality of the chatbot response.'}
                  id={'lead-info'}
                />
                Would you like to display the chatbot character?
              </FormLabel>
              <RadioGroup
                aria-labelledby="show-avatar-radio-buttons-group"
                name="avatar_view"
                value={values.avatar_view || 'headshot'}
                onChange={handleChange}
              >
                <FormControlLabel value="headshot" control={<Radio />} label={<>Static headshot image <InfoPopover infoText={'Small image downloaded and no animation'} id={'headshot-info'}/></>} />
                <FormControlLabel value="avatar" control={<Radio />} label={<>Animated 3D avatar <InfoPopover infoText={'~3MB download + life-like animation and lipsync w/ audio playback reading chatbot responses'} id={'avatar-info'}/></>} />
                <FormControlLabel value="none" control={<Radio />} label={<>No avatar, text-only <InfoPopover infoText={'No avatar representation'} id={'none-info'}/></>} />
              </RadioGroup>
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <img style={{width:'200px', marginLeft:'10px', marginBottom:'10px'}}
                   src={getAvatarViewImage()}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{mb:2}}>
        <CardHeader title='Default Greeting' sx={{pb:0}}/>
        <CardContent sx={{pt:1}}>
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
        <CardHeader title='How do you want to do generate leads?' sx={{pb:0}}/>
        <CardContent sx={{pt:1}}>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={6}
            >
              <FormControlLabel control={
                <Checkbox
                  checked={values.show_call_to_action || false}
                  onChange={handleChangeCheckbox}
                  name="show_call_to_action"
                />
              } label={<>
                Call-to-action Button
                <InfoPopover
                  id={'contact-link'}
                  extra={<img style={{width:'200px', margin:'5px'}} src='/assets/call-to-action-button.png'/>}
                />
              </>} />
            </Grid>
            <Grid
              xs={12}
              md={6}
            >
              <FormLabel id="contact-link-label">
                Call-to-action redirect webpage
                <InfoPopover
                  infoText={'Where do you want to redirect users when they click on the call-to-action button?'}
                  id={'contact-link'}
                />
              </FormLabel>
              <TextField
                aria-labelledby="contact-link-label"
                fullWidth
                error={values.show_call_to_action && values.contact_link === ''}
                name="contact_link"
                onChange={handleChange}
                value={values.contact_link || ''}
              />
            </Grid>
            <Grid
              xs={12}
            >
              <FormControlLabel control={
                <Checkbox
                  checked={values.collect_user_info || false}
                  onChange={handleChangeCheckbox}
                  name="collect_user_info"
                />
              } label={<>
                Solicit Contact Info
                <InfoPopover
                  id={'solicit-user-info'}
                  infoText={'If this is checked then the chatbot will try to collect contact information from your customer.  Any information collected will be emailed to you and available on this Admin portal for you to review.'}
                />
              </>} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{mb:2}}>
        <CardHeader title='Redirect Actions' sx={{pb:0}}/>
        <CardContent sx={{pt:1, pb:0}}>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
            >
              <FormLabel id="redirect-prompts">
                Instruct the chatbot to show a hyperlink to another webpage if the user asks for a specific type of information.
              </FormLabel>
            </Grid>
            <Grid
              xs={12}
            >
              <img style={{
                width:'75%',
                marginLeft:'10px',
                opacity:'60%',
                border:'1px dashed gray',
              }}
                   src={'/assets/redirect_prompt_row.png'}
              />
            </Grid>
            <Grid
              xs={12}
            >
              {values.redirect_prompts.map((rdp,i)=>
                <RedirectPromptRow key={i}
                                   rowData={{prompt:rdp.prompt||'', url:rdp.url||''}}
                                   rowIndex={i}
                                   handleDeleteRow={deleteRedirectPromptRow}
                                   handleChange={handleChangeRedirectRow}
                />
              )}
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{pl:3, pb:3}}>
          <Button
            variant="contained"
            onClick={addRedirectPrompt}
            startIcon={(
              <SvgIcon fontSize="small">
                <PlusIcon />
              </SvgIcon>
            )}
          >
            Add
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

ChatbotEdit.propTypes = {
  chatbot: PropTypes.object
};
