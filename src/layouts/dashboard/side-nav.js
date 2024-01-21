import NextLink from 'next/link';
import {usePathname} from 'next/navigation';
import PropTypes from 'prop-types';
import {Box, Divider, Drawer, Stack, SvgIcon, useMediaQuery} from '@mui/material';
import {Logo} from 'src/components/logo';
import {Scrollbar} from 'src/components/scrollbar';
import {items} from './config';
import {rootItems} from './root-config';
import {SideNavItem} from './side-nav-item';
import {AcademicCapIcon, BuildingStorefrontIcon, HandThumbUpIcon} from '@heroicons/react/24/solid';
import {useApi} from '../../hooks/use-api';
import {useAuth} from "../../hooks/use-auth";

export const SideNav = (props) => {
  const {
    onboardingSteps,
    onboardingStep,
    userApprovalStatus,
  } = useApi()

  const {
    user,
  } = useAuth()

  const { open, onClose } = props;
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  let navMenuButtons = <></>
  if(userApprovalStatus !== 'approved') navMenuButtons = <></>
  else if(onboardingStep === onboardingSteps.done) {
    navMenuButtons = (
      items.map((item) => {
        const active = item.path ? (pathname === item.path) : false;
        return (
          <SideNavItem
            active={active}
            disabled={item.disabled}
            external={item.external}
            icon={item.icon}
            key={item.title}
            path={item.path}
            title={item.title}
          />
        );
      })
    )
  } else {
    navMenuButtons = [
        <SideNavItem
          key={1}
          disabled={onboardingStep!==onboardingSteps.createCompany}
          active={onboardingStep===onboardingSteps.createCompany}
          icon={(
            <SvgIcon fontSize="small">
              <BuildingStorefrontIcon />
            </SvgIcon>
          )}
          title={'1. Create your Company'}
        />,
        <SideNavItem
          key={2}
          disabled={onboardingStep!==onboardingSteps.customizeChatbot}
          active={onboardingStep===onboardingSteps.customizeChatbot}
          icon={(
            <SvgIcon fontSize="small">
              <HandThumbUpIcon />
            </SvgIcon>
          )}
          title={'2. Customize Your Chatbot'}
        />,
        <SideNavItem
          key={3}
          disabled={onboardingStep!==onboardingSteps.scrapeLinks}
          active={onboardingStep===onboardingSteps.scrapeLinks}
          icon={(
            <SvgIcon fontSize="small">
              <AcademicCapIcon />
            </SvgIcon>
          )}
          title={'3. Train Your Chatbot'}
        />
    ]
  }

  console.log(user)

  const content = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': {
          height: '100%'
        },
        '& .simplebar-scrollbar:before': {
          background: 'neutral.400'
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            component={NextLink}
            href="/"
            sx={{
              display: 'inline-flex',
              height: 32,
              width: 32
            }}
          >
            <Logo />
          </Box>
        </Box>
        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3
          }}
        >
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: 'none',
              p: 0,
              m: 0
            }}
          >
            {navMenuButtons}
          </Stack>
        </Box>
        <Divider sx={{ borderColor: 'neutral.700' }} />
      </Box>
    </Scrollbar>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.800',
            color: 'common.white',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.800',
          color: 'common.white',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
