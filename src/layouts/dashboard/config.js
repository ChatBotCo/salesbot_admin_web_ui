import CogIcon from '@heroicons/react/24/solid/CogIcon';
import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UserPlusIcon from '@heroicons/react/24/solid/UserPlusIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';
import { SvgIcon } from '@mui/material';
import { ChatBubbleLeftRightIcon, HandThumbUpIcon, StarIcon, ChartBarIcon } from '@heroicons/react/24/solid';

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
    title: 'Leads',
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
];
