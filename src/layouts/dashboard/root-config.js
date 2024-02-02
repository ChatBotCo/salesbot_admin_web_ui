import {SvgIcon} from '@mui/material';
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import { DocumentTextIcon } from '@heroicons/react/24/solid';

export const rootItems = [
  {
    title: 'Users',
    path: '/users',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Logs',
    path: '/logs',
    icon: (
      <SvgIcon fontSize="small">
        <DocumentTextIcon />
      </SvgIcon>
    )
  },
];
