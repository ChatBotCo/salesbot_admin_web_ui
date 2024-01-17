import { Button, Card, CardContent, Typography } from '@mui/material';
import { useApi } from '../../hooks/use-api';
import PropTypes from 'prop-types';

export const LinksStartScrape = (props) => {
  const {
    selectedCompanyId,
  } = props;

  const {
    startTraining,
  } = useApi()


  return (
    <Card>
      <CardContent sx={{pb:1}}>
        <Typography variant={'h3'}>
          {"We're ready to train your chatbot!"}
        </Typography>
        <Typography sx={{ml:5, mr:5}}>
          Once you start the training process (click button below) it will take potentially several hours to complete.  You may close this window and come back to check on the progress.  We will email you when the training is complete.
        </Typography>
        <Button
          aria-labelledby="link-start-scrape"
          variant="contained"
          onClick={()=>startTraining(selectedCompanyId)}
        >
          Start Training
        </Button>
      </CardContent>
    </Card>
  );
};

LinksStartScrape.propTypes = {
  selectedCompanyId: PropTypes.string,
};
