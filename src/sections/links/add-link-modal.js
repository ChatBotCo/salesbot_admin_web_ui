import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  FormLabel, Modal,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { useApi } from '../../hooks/use-api';
import { InfoPopover } from '../../components/info-popover';
import PropTypes from 'prop-types';

export const AddLinkModal = (props) => {
  const {
    showAddLinkModal,
    setShowAddLinkModal,
  } = props

  const {
    loading,
    saving,
  } = useApi()

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={showAddLinkModal}
      onClose={()=>setShowAddLinkModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Card s x={{mb:2}}>
          <CardHeader
            title="Provide a link to train the chatbot"
          />
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
                  // onChange={handleChange}
                  required
                  // value={values.greeting || ''}
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            {saving ? <CircularProgress /> :  (
              <Button
                variant="contained"
                onClick={()=>{}}
              >
                Add Training Link
              </Button>
            )}
          </CardActions>
        </Card>
      </Box>
    </Modal>
  );
};

AddLinkModal.propTypes = {
  showAddLinkModal: PropTypes.bool,
  setShowAddLinkModal: PropTypes.func,
};