import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import {SearchRounded} from '@mui/icons-material';

export const Searche_Field = ({placeholder='Rechercher', width=300}) => {
    return (
        <>
            <Paper
                component="form"
                sx={{ mr:10 , display: 'flex', alignItems: 'center', minWidth:300, width: width }}
            >
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                    <SearchRounded />
                </IconButton>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder={placeholder}
                    inputProps={{ 'aria-label': 'rechercher' }}
                />
            </Paper>
        </>
    )
}
