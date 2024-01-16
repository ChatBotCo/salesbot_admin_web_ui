import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Modal,
  TextField
} from '@mui/material';
import { useApi } from '../../hooks/use-api';
import PropTypes from 'prop-types';
import { useState } from 'react';

export const AddLinkModal = (props) => {
  const {
    showAddLinkModal,
    setShowAddLinkModal,
    selectedCompanyId,
  } = props

  const {
    saving,
    addLink,
  } = useApi()

  const [linkUrl, setLinkUrl] = useState('');
  const [isValid, setIsValid] = useState(true);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'transparent',
    p: 4,
    focus: 'none',
  };

  const handleChange = e => {
    const url = e.target.value;
    setLinkUrl(url);
    // setIsValid(isValidUrl(url) || url === '')
  }

  const isValidUrl = string=>{
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  const dismissModal = ()=>{
    setLinkUrl('')
    setIsValid(true)
    setShowAddLinkModal(false)
  }

  const submit = ()=>{
    // if(isValidUrl(linkUrl)) {
      addLink(linkUrl, selectedCompanyId)
      dismissModal()
    // }
  }

  return (
    <Modal
      open={showAddLinkModal}
      onClose={()=>setShowAddLinkModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Card sx={{mb:2}}>
          <CardHeader
            title="Provide a link to train the chatbot"
          />
          <CardContent>
            <TextField
              fullWidth
              onChange={handleChange}
              required
              value={linkUrl || ''}
              error={!isValid}
              helperText={!isValid && 'Please only enter a valid web URL like:"http://example.com"'}
            />
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            {saving ? <CircularProgress /> :  (
              <>
                <Button
                  onClick={dismissModal}
                  color={'secondary'}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={submit}
                >
                  Submit
                </Button>
              </>
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
  selectedCompanyId: PropTypes.string,
};