import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Box,
    Button,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Alert,
    Typography,
    CardContent,
    CircularProgress,
    Paper,
    Container,
    useTheme,
    alpha
} from '@mui/material';
import { VisibilityRounded, VisibilityOffRounded, LockOutlined, EmailOutlined, ArrowForward } from '@mui/icons-material';
import { apiToPost } from '../../utils/ApiServices';

export const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const theme = useTheme();

    const handleClickShowPassword = () => setShowPassword((prev) => !prev);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        if (!email || !password) {
            setError("L'email et le mot de passe sont requis.");
            return;
        }

        setLoading(true);
        try {
            // await login(email, password);
            await apiToPost("comptes/login/", { email, password });
            window.location.reload();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={10}
                    sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                        position: 'relative'
                    }}
                >
                    <Box
                        sx={{
                            // height: 8,
                            width: '100%',
                            backgroundColor: theme.palette.primary.main
                        }}
                    />
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ mb: 2, textAlign: 'center' }}>
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    p: 2,
                                    borderRadius: '50%',
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    mb: 2
                                }}
                            >
                                <img
                                    src="/logoMinistere.png"
                                    alt="Logo"
                                    style={{
                                        width: 80,
                                        height: 80,
                                        objectFit: 'contain'
                                    }}
                                />
                            </Box>
                            <Typography
                                variant="h5"
                                component="h1"
                                fontWeight="bold"
                                color="primary.main"
                                gutterBottom
                            >
                                Bienvenue
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Connectez-vous pour accéder à votre espace
                            </Typography>
                        </Box>
                        <Box component={'form'} onSubmit={handleLogin} >

                            <FormControl fullWidth margin="normal" variant="outlined" sx={{ mb: 2.5 }}>
                                <InputLabel htmlFor="email">Email</InputLabel>
                                <OutlinedInput
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <EmailOutlined color="action" />
                                        </InputAdornment>
                                    }
                                    label="Email"
                                    sx={{ borderRadius: 2 }}
                                />
                            </FormControl>

                            <FormControl fullWidth margin="normal" variant="outlined" sx={{ mb: 1 }}>
                                <InputLabel htmlFor="password">Mot de passe</InputLabel>
                                <OutlinedInput
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <LockOutlined color="action" />
                                        </InputAdornment>
                                    }
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Mot de passe"
                                    sx={{ borderRadius: 2 }}
                                />
                            </FormControl>
                            {error && (
                                <Alert
                                    severity="error"
                                    sx={{
                                        my: 1,
                                        borderRadius: 2,
                                        '& .MuiAlert-icon': { alignItems: 'center' }
                                    }}
                                >
                                    {error}
                                </Alert>
                            )}
                            <Box sx={{ display: 'flex', justifyContent: 'end', mb: 3 }}>
                                <NavLink
                                    to="/reset"
                                    style={{
                                        textDecoration: 'none',
                                        color: theme.palette.primary.main,
                                        fontWeight: 500
                                    }}
                                >
                                    Mot de passe oublié ?
                                </NavLink>
                            </Box>

                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type='submit'
                                disabled={loading}
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Se connecter'}
                            </Button>
                        </Box>
                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <NavLink
                                to="/register"
                                style={{
                                    textDecoration: 'none',
                                    color: theme.palette.primary.main,
                                    fontWeight: 500,
                                    display: 'inline-flex',
                                    alignItems: 'center'
                                }}
                            >
                                Demande d'inscription
                                <ArrowForward sx={{ fontSize: 18, mr: 0.5 }} />
                            </NavLink>
                        </Box>
                    </CardContent>
                </Paper>
            </Container>
        </Box>
    );
};