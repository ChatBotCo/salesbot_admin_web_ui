import { Button, Card, CardContent, CardHeader, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/use-api';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

const maxLinks = 10;
const StyledTextField = styled(TextField)({
  '& .MuiInputBase-input::placeholder': {
    color: 'lightgray'
  },
  '& .MuiInputBase-input::-ms-input-placeholder': {
    color: 'lightgray'
  },
  '& .MuiInputBase-input::-webkit-input-placeholder': {
    color: 'lightgray'
  }
});

export const LinksInputCard = ({ selectedCompanyId }) => {
  const { startTraining2 } = useApi();
  const [linkObjs, setLinkObjs] = useState([]);

  useEffect(() => {
    const initialLinkObjs = Array.from({ length: maxLinks }, (_, i) => ({
      id: `link_${i + 1}`,
      link: ''
    }));
    setLinkObjs(initialLinkObjs);
  }, []);

  const handleChange = (id) => (e) => {
    const newUrl = e.target.value;
    setLinkObjs(currentLinkObjs =>
      currentLinkObjs.map(linkObj =>
        linkObj.id === id ? { ...linkObj, link: newUrl } : linkObj
      )
    );
  };

  const handleStartTraining = () => {
    const _links = linkObjs
      .filter(l=>l.link)
      .map(l=>l.link)
      .map(l=>l.startsWith('http') ? l : `https://${l}`)
    startTraining2(selectedCompanyId, _links)
  };

  const linkEls = linkObjs.map(linkObj => (
    <StyledTextField
      key={linkObj.id}
      fullWidth
      value={linkObj.link}
      placeholder={'https://example.com'}
      sx={{ mb: 1 }}
      onChange={handleChange(linkObj.id)}
    />
  ));

  return (
    <Card>
      <CardHeader
        title={'Add links to teach your chatbot about your company'}
        subheader={'This is necessary so that the chatbot understands your products or services...'}
        action={(
          <Button
            disabled={!selectedCompanyId || linkObjs.every(obj => !obj.link)}
            variant="contained"
            onClick={handleStartTraining}
          >
            Start Training
          </Button>
        )}
      />
      <CardContent sx={{ pb: 1 }}>
        {linkEls}
      </CardContent>
    </Card>
  );
};

LinksInputCard.propTypes = {
  selectedCompanyId: PropTypes.string
};
