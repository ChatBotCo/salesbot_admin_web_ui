import { Card, CardContent, SvgIcon, Typography } from '@mui/material';
import { AcademicCapIcon } from '@heroicons/react/24/solid';

export const LinksTrainingComplete = (props) => {
  return (
    <Card>
      <CardContent sx={{pb:1, background:'lightgreen'}}>
        <Typography variant={'h3'}>
          <SvgIcon fontSize="large">
            <AcademicCapIcon />
          </SvgIcon>
          {"Training complete!"}
        </Typography>
      </CardContent>
    </Card>
  );
};

LinksTrainingComplete.propTypes = {
};
