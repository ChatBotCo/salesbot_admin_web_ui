import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
  SvgIcon
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { ChevronDownIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

export const CollapseCard = ({ title, children, actions, icon }) => {
  const [expand, setExpand] = useState(false);

  return (
    <Card sx={{mb:2}}>
      <CardHeader
        title={title}
        avatar={icon && (
          <SvgIcon fontSize="small">
            {icon}
          </SvgIcon>
        )}
        action={
          <IconButton aria-label="settings">
            <SvgIcon fontSize="small">
              {
                expand ?
                  <ChevronDownIcon />:
                  <ChevronLeftIcon />
              }
            </SvgIcon>
          </IconButton>
        }
        sx={{pb:1, pt:1, cursor:'pointer'}}
        onClick={()=>setExpand(!expand)}
      />
      <Collapse in={expand}>
        <CardContent sx={{pt:1, pb:0}}>
          {children}
        </CardContent>
        {actions && (
          <CardActions sx={{pl:3, pb:3}}>
            {actions}
          </CardActions>
        )}
      </Collapse>
    </Card>
  );
};

CollapseCard.propTypes = {
  // title can be a string or a React element
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]).isRequired,
  // children can be a React node (element, string, number, fragment, etc.)
  children: PropTypes.node,
  actions: PropTypes.element,
  icon: PropTypes.element,
};
