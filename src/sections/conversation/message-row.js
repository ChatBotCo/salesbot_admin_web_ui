import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Button, Stack, SvgIcon, TableCell, TableRow } from '@mui/material';
import { HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/react/24/solid';
import { RefinementEditRow } from './refinement-edit-row';
import { useApi } from '../../hooks/use-api';

export const MessageRow = ({refinement, msg, rowIndex}) => {
  const {
    addRefinement,
    updateRefinement,
  } = useApi()

  const onClickFeedback = (refinement, msg, is_positive)=>{
    if(refinement) {
      const _refinement = {...refinement}
      _refinement.is_positive = is_positive
      updateRefinement(_refinement)
    } else {
      addRefinement(msg, is_positive)
    }
  }

  let refineUp = false
  let refineDown = false
  if(refinement) {
    refineUp = refinement.is_positive
    refineDown = !refinement.is_positive
  }
  const userData = Object.entries(msg)
                         .filter(([key, value]) => key.startsWith('user_') && key !== 'user_msg' && (typeof value === 'string' || (typeof value === 'boolean' && value)))
                         .map(([key, value]) => `${key}: ${value}`)
                         .join(', ');

  return (
    <>
      <TableRow
        key={rowIndex}
      >
        <TableCell>
          {rowIndex+1}
        </TableCell>
        <TableCell>
          {format((msg._ts*1000), 'MM/dd/yyyy hh:mm pp')}
        </TableCell>
        <TableCell>
          {msg.user_msg}
        </TableCell>
        <TableCell>
          {msg.assistant_response}
        </TableCell>
        <TableCell>
          {userData}
        </TableCell>
        <TableCell>
          <Stack direction={'row'}>
            <Button
              variant={refineUp ? 'contained' : ''}
              onClick={()=>onClickFeedback(refinement, msg, true)}
            >
              <SvgIcon fontSize="small">
                <HandThumbUpIcon />
              </SvgIcon>
            </Button>
            <Button
              variant={refineDown ? 'contained' : ''}
              onClick={()=>onClickFeedback(refinement, msg, false)}
            >
              <SvgIcon fontSize="small">
                <HandThumbDownIcon />
              </SvgIcon>
            </Button>
          </Stack>
        </TableCell>
      </TableRow>
      {
        refinement && (<RefinementEditRow refinement={refinement}/> )
      }
    </>
  );
};

MessageRow.propTypes = {
  refinement: PropTypes.object,
  msg: PropTypes.object,
  rowIndex: PropTypes.number,
};
