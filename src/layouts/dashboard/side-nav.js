import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import { Box, Divider, Drawer, Stack, SvgIcon, useMediaQuery } from '@mui/material';
import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';
import { items } from './config';
import { SideNavItem } from './side-nav-item';
import { useAuth } from '../../hooks/use-auth';
import {
  AcademicCapIcon,
  BuildingStorefrontIcon,
  HandThumbUpIcon
} from '@heroicons/react/24/solid';
import { useApi } from '../../hooks/use-api';

export const SideNav = (props) => {
  const {user} = useAuth();

  const {
    onboardingSteps,
    onboardingStep,
  } = useApi()

  const { open, onClose } = props;
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  let navMenuButtons = <></>
  if(onboardingStep === onboardingSteps.done) {
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
    navMenuButtons = (
      <>
        <SideNavItem
          disabled={onboardingStep!==onboardingSteps.createCompany}
          active={onboardingStep===onboardingSteps.createCompany}
          icon={(
            <SvgIcon fontSize="small">
              <BuildingStorefrontIcon />
            </SvgIcon>
          )}
          title={'1. Create your Company'}
        />
        <SideNavItem
          disabled={onboardingStep!==onboardingSteps.customizeChatbot}
          active={onboardingStep===onboardingSteps.customizeChatbot}
          icon={(
            <SvgIcon fontSize="small">
              <HandThumbUpIcon />
            </SvgIcon>
          )}
          title={'2. Customize Your Chatbot'}
        />
        <SideNavItem
          disabled={onboardingStep!==onboardingSteps.scrapeLinks}
          active={onboardingStep===onboardingSteps.scrapeLinks}
          icon={(
            <SvgIcon fontSize="small">
              <AcademicCapIcon />
            </SvgIcon>
          )}
          title={'3. Train Your Chatbot'}
        />
      </>
    )
  }

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
