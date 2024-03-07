import {Box, Container, Stack, SvgIcon, Typography, Unstable_Grid2 as Grid} from '@mui/material';
import ClockIcon from '@heroicons/react/24/solid/ClockIcon';
import {useAuth} from "../../hooks/use-auth";
import {NoSymbolIcon} from "@heroicons/react/24/solid";

export const ApprovalStatusSection = () => {
  const {
    user,
  } = useAuth()

  if(!user) return <></>

  let displayEl
  if(user.approval_status === 'rejected') {
    displayEl = (
      <Grid
        xs={12}
      >
        <Stack direction={'row'}>
          <SvgIcon fontSize="large" color={'error'}>
            <NoSymbolIcon />
          </SvgIcon>
          <Typography variant={'h4'} color={'primary'}>Request Denied</Typography>
        </Stack>
        <Typography variant={'subtitle1'}>Site administrators have rejected the request for this account.</Typography>
        <Typography variant={'subtitle1'}>Please contact hello@greeter.bot.</Typography>
      </Grid>
    )
  } else {
    displayEl = (
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
        <Typography variant={'subtitle1'}>Please contact hello@greeter.bot to inquire about status.</Typography>
      </Grid>
    )
  }

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
          {displayEl}
          <Grid
            xs={12}
          >
            <Typography variant={'h5'}>{user.user_name}</Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
};
