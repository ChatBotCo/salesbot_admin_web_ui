import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';
import PropTypes from 'prop-types';
import {useApi} from "../../hooks/use-api";

const llmModels = [
  {
    value: 'salesbot-gpt-4-1106-preview',
    label: 'GPT-4'
  },
  {
    value: 'keli-35-turbo',
    label: 'GPT-3.5'
  },
];

const defaultValues = {
  show_avatar: true,
  llm_model: 'keli-35-turbo',
}

export const ChatbotEdit = (props) => {
  const {
    chatbot,
  } = props;

  const {
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

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      <Card>
        <CardContent>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Select LLM Model"
                  name="llm_model"
                  onChange={handleChange}
                  required
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
              <Grid
                xs={12}
              >
                <FormControlLabel control={
                  <Checkbox
                    checked={values.show_avatar || false}
                    onChange={handleChangeCheckbox}
                    name="show_avatar"
                  />
                } label="Show Avatar" />
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
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          {(chatbot && unsavedChanges) && (
            <Button
              variant="contained"
              onClick={()=>{
                saveChatbotChanges(values)
              }}
            >
              Save Changes
            </Button>
          )}
        </CardActions>
      </Card>
    </form>
  );
};

ChatbotEdit.propTypes = {
  chatbot: PropTypes.object
};
