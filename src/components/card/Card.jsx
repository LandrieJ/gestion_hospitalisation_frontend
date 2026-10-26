import { useState } from 'react';
import { Delete, Edit, OpenInNewRounded } from '@mui/icons-material';
import { Avatar, IconButton, Paper, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid';

export const Card = ({ photo, nom, prenom, role, email }) => {
    const [hovered, setHovered] = useState(null);

    return (
        <Paper
            sx={{
                p: 2,
                cursor: 'pointer',
                boxShadow: 3,
                mb: 2,
                width: '100%',
                display: 'flex',
                borderRadius: 3,
                alignItems: 'center',
                height: 80,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { boxShadow: 6, transform: 'scale(1.02)' },
            }}
        >
            {/* Avatar */}
            <Avatar sx={{ width: 55, height: 55, mr: 2 }} alt="User Photo" src={photo || "/Profile.jpg"} />

            {/* Informations utilisateur */}
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" noWrap>
                    {nom} {prenom}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                    {role}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                    {email}
                </Typography>
            </Box>

            {/* Icônes d'actions */}
            <Grid container spacing={1} justifyContent="flex-end">
                {[
                    { Component: Edit, hoverColor: 'black' },
                    { Component: Delete, hoverColor: 'red' },
                    { Component: OpenInNewRounded, hoverColor: 'blue' }
                ].map(({ Component, hoverColor }, index) => (
                    <Grid key={index}>
                        <IconButton
                            onMouseEnter={() => setHovered(index)}
                            onMouseLeave={() => setHovered(null)}
                            sx={{
                                color: hovered === index ? hoverColor : 'gray',
                                transition: 'color 0.2s',
                            }}
                        >
                            <Component />
                        </IconButton>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};
