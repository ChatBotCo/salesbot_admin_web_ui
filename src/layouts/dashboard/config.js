import {SvgIcon} from '@mui/material';
import {
  AcademicCapIcon,
  BeakerIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  CloudArrowDownIcon,
  HandThumbUpIcon
} from '@heroicons/react/24/solid';

export const items = [
  {
    title: 'Overview',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Conversations',
    path: '/conversations',
    icon: (
      <SvgIcon fontSize="small">
        <ChatBubbleLeftRightIcon />
      </SvgIcon>
    )
  },
  // {
  //   title: 'Generated Leads',
  //   path: '/leads',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <StarIcon />
  //     </SvgIcon>
  //   )
  // },
  {
    title: 'Customize Your Chatbot',
    path: '/chatbots',
    icon: (
      <SvgIcon fontSize="small">
        <HandThumbUpIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Install Your Chatbot',
    path: '/install',
    icon: (
      <SvgIcon fontSize="small">
        <CloudArrowDownIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Test Your Chatbot',
    path: '/playground',
    icon: (
      <SvgIcon fontSize="small">
        <BeakerIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Training Results',
    path: '/links',
    icon: (
      <SvgIcon fontSize="small">
        <AcademicCapIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Edit Your Company',
    path: '/companies',
    icon: (
      <SvgIcon fontSize="small">
        <BuildingStorefrontIcon />
      </SvgIcon>
    )
  },
];
