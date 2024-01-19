import { Button, SvgIcon, TextField, Unstable_Grid2 as Grid } from '@mui/material';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

const defaultValues = {
  prompt: '',
  url: '',
}

export const RedirectPromptRow = (props) => {
  const {
    rowData,
    rowIndex,
    handleDeleteRow,
    handleChange,
  } = props

  const [values, setValues] = useState(defaultValues);

  useEffect(() => {
    setValues(rowData || defaultValues)
  }, [rowData])

  return (
    <Grid
      container
      spacing={1}
    >
      <Grid
        xs={6}
      >
        <TextField
          fullWidth
          label="Prompt"
          name="prompt"
          onChange={e=>handleChange(e,rowIndex)}
          value={values.prompt || ''}
        />
      </Grid>
      <Grid
        xs={5}
      >
        <TextField
          fullWidth
          label="URL"
          name="url"
          onChange={e=>handleChange(e,rowIndex)}
          value={values.url || ''}
        />
      </Grid>
      <Grid
        xs={1}
      >
        <Button
          onClick={()=>handleDeleteRow(rowIndex)}
        >
          <SvgIcon fontSize="small">
            <TrashIcon />
          </SvgIcon>
        </Button>
      </Grid>
    </Grid>
  );
};

RedirectPromptRow.propTypes = {
  rowData: PropTypes.object,
  rowIndex: PropTypes.number,
  handleDeleteRow: PropTypes.func,
  handleChange: PropTypes.func,
};
