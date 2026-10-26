import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    TextField, Button, CardContent, Typography, Alert,
    Box, Container, Paper, useTheme, alpha, CircularProgress,
    InputAdornment
} from "@mui/material";
import { EmailOutlined, ArrowBackOutlined } from "@mui/icons-material";
import { apiToPost } from "../../utils/ApiServices";

export const Reset = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const theme = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Vérification de l'email
        if (!email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
            setError("Veuillez entrer une adresse email valide.");
            return;
        }

        setLoading(true);
        try {
            const response = await apiToPost("comptes/password-reset/", { email });
            setSuccess(response?.message || "Un email de réinitialisation a été envoyé.");
        } catch (err) {
            setError(err.response?.data?.detail || "Erreur lors de la demande de réinitialisation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: alpha(theme.palette.primary.light, 0.1),
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
                            width: '100%',
                            backgroundColor: theme.palette.primary.main
                        }}
                    />

                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ mb: 4, textAlign: 'center' }}>
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
                                Mot de passe oublié
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ mb: 2, maxWidth: '80%', mx: 'auto' }}
                            >
                                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                            </Typography>
                        </Box>

                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailOutlined color="action" />
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
                                    }
                                }}
                            />
                            {error && (
                                <Alert
                                    severity="error"
                                    sx={{
                                        borderRadius: 2,
                                        mb: 2,
                                        '& .MuiAlert-icon': { alignItems: 'center' }
                                    }}
                                >
                                    {error}
                                </Alert>
                            )}
                            {success && (
                                <Alert
                                    severity="success"
                                    sx={{
                                        borderRadius: 2,
                                        mb: 2,
                                        '& .MuiAlert-icon': { alignItems: 'center' }
                                    }}
                                >
                                    {success}
                                </Alert>
                            )}
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={loading}
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : "Envoyer le lien de réinitialisation"}
                            </Button>

                            <Box sx={{ mt: 3, textAlign: 'center' }}>
                                <NavLink
                                    to="/login"
                                    style={{
                                        textDecoration: 'none',
                                        color: theme.palette.primary.main,
                                        fontWeight: 500,
                                        display: 'inline-flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    <ArrowBackOutlined sx={{ fontSize: 18, mr: 0.5 }} />
                                    Retour à la connexion
                                </NavLink>
                            </Box>
                        </Box>
                    </CardContent>
                </Paper>
            </Container>
        </Box>
    );
};
