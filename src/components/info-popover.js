import {useState} from "react";
import {Popover, SvgIcon, Typography} from "@mui/material";
import {InformationCircleIcon} from "@heroicons/react/24/outline";
import PropTypes from "prop-types";

export const InfoPopover = (props) => {
  const {
    id,
    infoText,
    extra,
  } = props

  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);

  const handleClick =
    (event) => {
      setPopoverAnchorEl(event.currentTarget);
    };

  const handleClose = () => {
    setPopoverAnchorEl(null);
  };

  const open = Boolean(popoverAnchorEl);
  //greeting-info-popover
  // const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Popover
        id={id}
        open={open}
        anchorEl={popoverAnchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Typography sx={{ p: 2 }}>{infoText}</Typography>
        {extra}
      </Popover>

      <SvgIcon
        fontSize="small"
        sx={{cursor:'pointer'}}
        aria-describedby={id} variant="contained" onClick={handleClick}
      >
        <InformationCircleIcon />
      </SvgIcon>
    </>
  );
};

InfoPopover.propTypes = {
  id: PropTypes.string,
  infoText: PropTypes.string,
  extra: PropTypes.object,
};
