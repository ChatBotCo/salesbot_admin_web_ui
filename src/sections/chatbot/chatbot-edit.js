import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  SvgIcon,
  TextField, Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import PropTypes from 'prop-types';
import { useApi } from '../../hooks/use-api';
import { InfoPopover } from '../../components/info-popover';
import { RedirectPromptRow } from './redirect-prompt-row';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { AnsweredQuestionRow } from './answered-question-row';
import { CollapseCard } from '../../components/collapse-card';
import {
  ChatBubbleBottomCenterTextIcon,
  ServerStackIcon,
  UserCircleIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import CurrencyDollarIcon from '@heroicons/react/24/solid/CurrencyDollarIcon';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/solid';

const llmModels = [
  {
    value: 'gpt-4-0125-preview',
    label: 'Slow and accurate (GPT-4-0125-preview)'
  },
  {
    value: 'gpt-3.5-turbo-0125',
    label: 'Fast and slightly-less-accurate (GPT-3.5-Turbo-0125)'
  },
];

const defaultValues = {
  llm_model: 'gpt-3.5-turbo-0125',
  greeting: '',
  redirect_prompts: [],
  answered_questions: [],
  show_call_to_action: false,
  contact_link: '',
  redirect_to_calendar: false,
  calendar_link: '',
  collect_user_info: false,
  role_sales: true,
  role_support: false,
  chatbot_mode: 'mode-both'
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
    if(!_values.answered_questions) _values.answered_questions = []
    if(chatbot) {
      if(chatbot.role_sales && chatbot.role_support) {
        _values.chatbot_mode = 'mode-both'
      } else if(chatbot.role_sales) {
        _values.chatbot_mode = 'mode-sales'
      } else {
        _values.chatbot_mode = 'mode-support'
      }
    }
    setValues(_values)
  }, [chatbot])

  const onClickSave = () => {
    const incompleteRedirectPrompt = values.redirect_prompts.find(rdp=>{
      return !rdp.prompt ||
        !rdp.url ||
        !(rdp.prompt && rdp.prompt.trim()) ||
        !(rdp.url && rdp.url.trim())
    }) !== undefined

    if(values.chatbot_mode==='mode-both') {
      values.role_sales = true
      values.role_support = true
    } else if(values.chatbot_mode==='mode-sales') {
      values.role_sales = true
      values.role_support = false
    } else {
      values.role_sales = false
      values.role_support = true
    }

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

  const addAnsweredQuestion = ()=>{
    const _values = {...values}
    _values.answered_questions.push({question:'', answer:''})
    setValues(_values)
  }
  const deleteAnsweredQuestionRow = rowIndex => {
    const _values = {...values}
    _values.answered_questions = _values.answered_questions.filter((_, index) => index !== rowIndex)
    setValues(_values)
  };

  const handleAnsweredQuestionRow = (event, rowIndex) => {
    const _values = {...values}
    _values.answered_questions.forEach((rowData, index) => {
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

      {/*<CollapseCard*/}
      {/*  title={'AI Configuration'}*/}
      {/*  icon={<ServerStackIcon />}*/}
      {/*>*/}
      {/*  <Grid*/}
      {/*    container*/}
      {/*  >*/}
      {/*    <Grid*/}
      {/*      xs={12}*/}
      {/*      md={6}*/}
      {/*    >*/}
      {/*      <FormLabel id="llm-model-picker">*/}
      {/*        <InfoPopover infoText={'LLM choice impacts speed and accuracy.  3.5 is fast but occasionally inaccurate.  4 is slower but much more effective and accurate.'} id={'models-info'} />*/}
      {/*        Which LLM model would you like to use?*/}
      {/*      </FormLabel>*/}
      {/*      <TextField*/}
      {/*        aria-labelledby="llm-model-picker"*/}
      {/*        fullWidth*/}
      {/*        label="LLM Model"*/}
      {/*        name="llm_model"*/}
      {/*        onChange={handleChange}*/}
      {/*        select*/}
      {/*        SelectProps={{ native: true }}*/}
      {/*        value={values.llm_model}*/}
      {/*      >*/}
      {/*        {llmModels.map(option => (*/}
      {/*          <option*/}
      {/*            key={option.value}*/}
      {/*            value={option.value}*/}
      {/*          >*/}
      {/*            {option.label}*/}
      {/*          </option>*/}
      {/*        ))}*/}
      {/*      </TextField>*/}
      {/*    </Grid>*/}
      {/*  </Grid>*/}
      {/*</CollapseCard>*/}

      {/*<CollapseCard*/}
      {/*  title={'Avatar Character'}*/}
      {/*  icon={<UserCircleIcon/>}*/}
      {/*>*/}
      {/*  <Grid*/}
      {/*    container*/}
      {/*  >*/}
      {/*    <Grid*/}
      {/*      xs={12}*/}
      {/*      md={6}*/}
      {/*    >*/}
      {/*      <FormLabel id="show-avatar-radio-buttons-group">*/}
      {/*        <InfoPopover*/}
      {/*          infoText={'The chatbot character is simply an adornment and does not impact the quality of the chatbot response.'}*/}
      {/*          id={'lead-info'}*/}
      {/*        />*/}
      {/*        Would you like to display the chatbot character?*/}
      {/*      </FormLabel>*/}
      {/*      <RadioGroup*/}
      {/*        aria-labelledby="show-avatar-radio-buttons-group"*/}
      {/*        name="avatar_view"*/}
      {/*        value={values.avatar_view || 'headshot'}*/}
      {/*        onChange={handleChange}*/}
      {/*      >*/}
      {/*        <FormControlLabel value="headshot" control={<Radio />} label={<>Static headshot image <InfoPopover infoText={'Small image downloaded and no animation'} id={'headshot-info'}/></>} />*/}
      {/*        <FormControlLabel value="avatar" control={<Radio />} label={<>Animated 3D avatar <InfoPopover infoText={'~3MB download + life-like animation and lipsync w/ audio playback reading chatbot responses'} id={'avatar-info'}/></>} />*/}
      {/*      </RadioGroup>*/}
      {/*    </Grid>*/}
      {/*    <Grid*/}
      {/*      xs={12}*/}
      {/*      md={6}*/}
      {/*    >*/}
      {/*      <img style={{width:'200px', marginLeft:'10px', marginBottom:'10px'}}*/}
      {/*           src={getAvatarViewImage()}*/}
      {/*      />*/}
      {/*    </Grid>*/}
      {/*  </Grid>*/}
      {/*</CollapseCard>*/}

      <CollapseCard
        title='Default Greeting'
        icon={<ChatBubbleBottomCenterTextIcon/>}
      >
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
      </CollapseCard>

      <TextField
        name="chatbot_mode"
        label={'Choose your chatbot mode'}
        onChange={handleChange}
        select
        SelectProps={{ native: true }}
        value={values.chatbot_mode || 'mode-both'}
        sx={{mb:2, minWidth:300}}
      >
        <option
          key='mode-sales'
          value='mode-sales'
        >
          Sales
        </option>
        <option
          key='mode-support'
          value='mode-support'
        >
          Support
        </option>
        <option
          key='mode-both'
          value='mode-both'
        >
          Both
        </option>
      </TextField>

      {
        (values.chatbot_mode==='mode-sales' || values.chatbot_mode==='mode-both') && (
          <CollapseCard
            title='Sales Mode Options'
            icon={<CurrencyDollarIcon/>}
          >
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
              >
                {
                  values.role_sales ?
                    <Typography variant={'h6'}>How do you want to do generate leads?</Typography> :
                    <span style={{color:'gray'}}>Chatbot will not function as a sales rep.</span>
                }
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <FormControlLabel control={
                  <Checkbox
                    checked={values.show_call_to_action || false}
                    onChange={handleChangeCheckbox}
                    name="show_call_to_action"
                    disabled={!values.role_sales}
                  />
                } label={<>
                  Contact Us Button
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
                  onChange={e=>{
                    values.role_sales && handleChange(e)
                  }}
                  value={values.contact_link || ''}
                  disabled={!values.role_sales}
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
                    disabled={!values.role_sales}
                  />
                } label={<>
                  Solicit Contact Info
                  <InfoPopover
                    id={'solicit-user-info'}
                    infoText={'If this is checked then the chatbot will try to collect contact information from your customer.  Any information collected will be emailed to you and available on this Admin portal for you to review.'}
                  />
                </>} />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <FormControlLabel control={
                  <Checkbox
                    checked={values.redirect_to_calendar || false}
                    onChange={handleChangeCheckbox}
                    name="redirect_to_calendar"
                    disabled={!values.role_sales}
                  />
                } label={<>
                  Redirect to Calendar App
                  <InfoPopover
                    id={'redirect_to_calendar-info'}
                    infoText={'If this is checked then the chatbot will try to redirect site visitors to your calendar app to schedule a call with a sales rep.'}
                  />
                </>} />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <FormLabel id="redirect_to_calendar-label">
                  Link to your calendar app
                  <InfoPopover
                    infoText={'Where do you want to redirect users when they want to schedule a call with your sales rep?'}
                    id={'redirect_to_calendar-link'}
                  />
                </FormLabel>
                <TextField
                  aria-labelledby="redirect_to_calendar-label"
                  fullWidth
                  error={values.redirect_to_calendar && values.calendar_link === ''}
                  name="calendar_link"
                  onChange={e=>{
                    values.role_sales && handleChange(e)
                  }}
                  disabled={!values.role_sales}
                  value={values.calendar_link || ''}
                />
              </Grid>
            </Grid>
          </CollapseCard>
        )
      }

      <CollapseCard
        title='Redirect Actions'
        actions={(
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
        )}
      >
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
      </CollapseCard>

      <CollapseCard
        title='Questions & Answers'
        actions={(
          <Button
            variant="contained"
            onClick={addAnsweredQuestion}
            startIcon={(
              <SvgIcon fontSize="small">
                <PlusIcon />
              </SvgIcon>
            )}
          >
            Add
          </Button>
        )}
      >
        <Grid
          container
          spacing={3}
        >
          <Grid
            xs={12}
          >
            <FormLabel id="redirect-prompts">
              Sometimes the chatbot gets information a little wrong. Specify the answers to questions that your site visitors might have and that you find your chatbot getting wrong.
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
                 src={'/assets/answered-question-row.png'}
            />
          </Grid>
          <Grid
            xs={12}
          >
            {values.answered_questions.map((aq,i)=>
              <AnsweredQuestionRow key={i}
                                 rowData={{question:aq.question||'', answer:aq.answer||''}}
                                 rowIndex={i}
                                 handleDeleteRow={deleteAnsweredQuestionRow}
                                 handleChange={handleAnsweredQuestionRow}
              />
            )}
          </Grid>
        </Grid>
      </CollapseCard>
    </form>
  );
};

ChatbotEdit.propTypes = {
  chatbot: PropTypes.object
};
