import { Box, Container, Stack, SvgIcon, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import ClockIcon from '@heroicons/react/24/solid/ClockIcon';

export const ApprovalStatusSection = () => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="xl">
        <Grid
          container
          spacing={3}
        >
          <Grid
            xs={12}
          >
            <Stack direction={'row'}>
              <SvgIcon fontSize="large" color={'primary'}>
                <ClockIcon />
              </SvgIcon>
              <Typography variant={'h4'} color={'primary'}>Approval Pending</Typography>
            </Stack>
            <Typography variant={'subtitle1'}>This account is pending approval by site administrators</Typography>
            <Typography variant={'subtitle1'}>Please contact hello@saleschat.bot to inquire about status.</Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
};
