import { Menu, MenuOpenRounded, MenuRounded } from '@mui/icons-material'
import { Avatar, Box, IconButton } from '@mui/material'
import { NavLink } from 'react-router-dom'

export const SideBarMenu = ({ handleDrawerOpen, handleOpenCloseMenu, children, hide }) => {
    return (
        <>
            <Box
                className={'bg-color-light'}
                width={80}
                sx={{
                    display: { xs: 'none', sm: 'flex', md: 'flex', flexDirection: 'column' },
                    borderRight: '1px solid #ccc',
                    alignItems: 'center',
                    justifyContent: 'start',
                    overflow: 'auto',
                    height: '100vh',
                    pt: 1,

                    scrollbarWidth: "thin",
                    "&::-webkit-scrollbar": {
                        width: "5px",
                    },
                    "&::-webkit-scrollbar-track": {
                        background: "#f1f1f1",
                        borderRadius: "10px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: "#888",
                        borderRadius: "10px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                        background: "#555",
                    }
                }}
            >
                <IconButton component={NavLink} to={'/'}>
                    <Box sx={{ width: 40, height: 40, }} >
                        <Avatar alt="Logo" src="/logoMinistere.png" sx={{ width: 40, height: 40 }} />
                    </Box>
                </IconButton>
                {children}
            </Box>

        </>
    )
}
