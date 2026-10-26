import { useState } from "react";
import { FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from "@mui/material";
import { EditRounded, SaveRounded } from "@mui/icons-material";
import PropTypes from "prop-types";

export const InputEdit = ({ id, label, value, onUpdate }) => {
  const [edit, setEdit] = useState(true);
  const [inputValue, setInputValue] = useState(value);

  const handleEdit = () => {
    if (!edit) onUpdate(inputValue);
    setEdit(!edit);
  };

  return (
    <FormControl sx={{ mb: 2, width:'100%' }}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <OutlinedInput
        id={id}
        label={label}
        variant="outlined"
        value={inputValue}
        disabled={edit}
        onChange={(e) => setInputValue(e.target.value)}
        endAdornment={
          <InputAdornment position="end">
            <IconButton onClick={handleEdit}>
              {edit ? <EditRounded /> : <SaveRounded />}
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

InputEdit.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onUpdate: PropTypes.func.isRequired,
};
