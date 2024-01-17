import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}
export const LinksTrainingProgress = (props) => {
  const {
    progress,
  } = props

  return (
    <Card>
      <CardContent sx={{pb:1}}>
        <Typography variant={'h3'}>
          <CircularProgress />
          {"Training in progress"}
        </Typography>
        <Typography variant={'subtitle1'}>
          Reload this page to monitor the progress
        </Typography>
        <Box sx={{ width: '100%' }}>
          <LinearProgressWithLabel value={progress} />
        </Box>
      </CardContent>
    </Card>
  );
};

LinksTrainingProgress.propTypes = {
  progress: PropTypes.number,
};
