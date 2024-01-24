import PropTypes from 'prop-types';
import { Button, FormLabel, Stack, TableCell, TableRow, TextField } from '@mui/material';
import { InfoPopover } from '../../components/info-popover';
import { useCallback, useEffect, useState } from 'react';
import { useApi } from '../../hooks/use-api';

export const RefinementEditRow = ({refinement}) => {
  const {
    updateRefinement,
  } = useApi()

  const [answer, setAnswer] = useState('')

  const handleChange = useCallback(
    (event) => {
      setAnswer(event.target.value)
    },
    []
  )

  useEffect(() => {
    setAnswer(refinement.answer)
  }, [refinement])

  const undoChanges = ()=> {
    setAnswer(refinement.answer)
  }

  const saveChanges = ()=> {
    const _refinement = {...refinement}
    _refinement.answer = answer
    updateRefinement(_refinement)
  }

  if(refinement.is_positive) return <></>

  return (
    <TableRow sx={{borderTop:'2px white solid', borderLeft:'20px lightgray solid'}}>
      <TableCell colSpan={5}>
        <FormLabel id="refinement-answer">
          <InfoPopover infoText={"You have indicated that you don't like how the chatbot responded to this question from the site visitor. Write exactly how the chatbot should have responded here and next time it will repeat your words almost exactly."} id={'refinement-answer-info'} />
          How should the chatbot respond instead?
        </FormLabel>
        <TextField
          fullWidth
          onChange={handleChange}
          value={answer || ''}
        />
      </TableCell>
      <TableCell>
        <Stack justifyContent={'center'} direction={'row'}>
          <Button
            disabled={answer === refinement.answer}
            variant='contained'
            onClick={saveChanges}
          >
            Save
          </Button>
          <Button
            disabled={answer === refinement.answer}
            onClick={undoChanges}
          >
            Undo
          </Button>
        </Stack>
      </TableCell>
    </TableRow>
  );
};

RefinementEditRow.propTypes = {
  refinement: PropTypes.object,
};
