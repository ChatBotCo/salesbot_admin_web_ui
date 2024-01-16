import { SvgIcon } from '@mui/material';
import {
  ChartBarIcon,
  ChatBubbleLeftRightIcon, CloudArrowDownIcon,
  HandThumbUpIcon,
  StarIcon
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
  {
    title: 'Generated Leads',
    path: '/leads',
    icon: (
      <SvgIcon fontSize="small">
        <StarIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Customize Your Chat Bot',
    path: '/chatbots',
    icon: (
      <SvgIcon fontSize="small">
        <HandThumbUpIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Install Your Chat Bot',
    path: '/install',
    icon: (
      <SvgIcon fontSize="small">
        <CloudArrowDownIcon />
      </SvgIcon>
    )
  },
];
