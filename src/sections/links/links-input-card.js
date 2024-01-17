import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  FormLabel,
  TextField
} from '@mui/material';
import { useState } from 'react';
import { InfoPopover } from '../../components/info-popover';
import { useApi } from '../../hooks/use-api';
import PropTypes from 'prop-types';

export const LinksInputCard = (props) => {
  const {
    selectedCompanyId,
  } = props;

  const {
    saving,
    addLink,
  } = useApi()

  const [linkUrl, setLinkUrl] = useState('');

  const handleChange = e => {
    const url = e.target.value;
    setLinkUrl(url);
    // setIsValid(isValidUrl(url) || url === '')
  }

  return (
    <Card>
      <CardContent sx={{pb:1}}>
        <FormLabel id="link-input">
          <InfoPopover infoText={'This is necessary so that the chatbot understands your products or services. The chatbot will also gain an understanding of how you present your company and (in a limited way) your sales strategy'} id={'link-input-info'} />
          What is your homepage?
        </FormLabel>
        <TextField
          disabled={saving}
          aria-labelledby="link-input"
          fullWidth
          onChange={handleChange}
          required
          value={linkUrl || ''}
          helperText={'We will train the chatbot based on all publicly available information anywhere in your website'}
          placeholder={'http://example.com'}
        />
      </CardContent>
      <CardActions sx={{pl:3, pb:3}}>
        {saving ? <CircularProgress /> :  (
          <Button
            disabled={linkUrl === ''}
            variant="contained"
            onClick={()=>addLink(linkUrl, selectedCompanyId)}
          >
            Submit
          </Button>
        )}
        {saving && <div style={{marginLeft:'20px'}}>This can take several minutes to complete. Please be patient</div>}
      </CardActions>
    </Card>
  );
};

LinksInputCard.propTypes = {
  selectedCompanyId: PropTypes.string
};
