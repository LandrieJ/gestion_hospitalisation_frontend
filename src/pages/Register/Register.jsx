import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    TextField, Button, IconButton, FormControl, InputLabel, OutlinedInput,
    InputAdornment, MenuItem, Alert, Typography, CardContent,
    Box, Container, Paper, useTheme, alpha, CircularProgress,
    Grid
} from "@mui/material";
import {
    VisibilityRounded, VisibilityOffRounded, BadgeOutlined,
    EmailOutlined, LockOutlined, LocalHospitalOutlined,
    WorkOutlined, AccountCircleOutlined, PhoneOutlined,
} from "@mui/icons-material";

import { apiTogetAll, apiToPost } from "../../utils/ApiServices";

export const Register = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [hospitals, setHospitals] = useState([]);
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]); // Nouveau state pour les services filtrés
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        passwordConfirm: "",
        user_type: "simple_user",
        is_active: false,
        hospital: "",
        service: "",
        phone_number: "",
        fonction: "",
        matricule_professionnel: "",
    });

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const togglePasswordConfirmVisibility = () => setShowPasswordConfirm((prev) => !prev);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updatedFormData = { ...prev, [name]: value };
            // Si l'hôpital change, réinitialiser le service
            if (name === "hospital") {
                updatedFormData.service = "";
            }
            return updatedFormData;
        });
    };

    const requiredFields = {
        last_name: "Nom",
        first_name: "Prénom",
        email: "Email",
        phone_number: "Téléphone",
        matricule_professionnel: "Numéro matricule",
        fonction: "Fonction",
        hospital: "Hôpital",
        service: "Service",
        password: "Mot de passe",
        passwordConfirm: "Confirmer le mot de passe"
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Vérifier si tous les champs sont remplis
        for (const key in requiredFields) {
            if (!formData[key]) {
                setError(`Le champ ${requiredFields[key]} est requis.`);
                return;
            }
        }

        // Vérifier l'email
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        if (!emailRegex.test(formData.email)) {
            setError("L'email n'est pas valide.");
            return;
        }

        // Vérifier la longueur du mot de passe
        if (formData.password.length < 8) {
            setError("Le mot de passe doit contenir au moins 8 caractères.");
            return;
        }

        // Vérifier si les mots de passe correspondent
        if (formData.password !== formData.passwordConfirm) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        // Préparer les données à envoyer
        const { passwordConfirm, hospital, service, ...cleanFormData } = formData;
        const dataToSend = { ...cleanFormData, hospital_id: hospital, service_id: service };

        // Envoyer les données
        setLoading(true);
        try {
            await apiToPost("comptes/users/", dataToSend);
            setError(null);
            setSuccess("Votre demande d'inscription a été enregistrée avec succès.");
            setFormData({
                first_name: "",
                last_name: "",
                email: "",
                password: "",
                passwordConfirm: "",
                user_type: "simple_user",
                is_active: false,
                hospital: "",
                service: "",
                phone_number: "",
                fonction: "",
                matricule_professionnel: "",
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const [hospitalData, serviceData] = await Promise.all([
                    apiTogetAll('hospitals/'),
                    apiTogetAll('services/lists/'),
                ]);
                setHospitals(hospitalData.results);
                setServices(serviceData.results);
            } catch {
                setError("Erreur lors du chargement des données.");
            }
        };
        fetchHospitals();
    }, []);

    // Filtrer les services lorsque l'hôpital change
    useEffect(() => {
        if (formData.hospital) {
            const filtered = services.filter((service) => service.hospital === formData.hospital);
            setFilteredServices(filtered);
        } else {
            setFilteredServices([]);
        }
    }, [formData.hospital, services]);

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
            <Container maxWidth="md">
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
                    <Grid container component={CardContent} spacing={2} sx={{ p: 4 }}>
                        <Grid container size={{ xs: 12, sm: 12, md: 4 }} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Grid size={12} textAlign={'center'}>
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
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                    Complétez le formulaire pour créer votre compte
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid container size={{ xs: 12, sm: 12, md: 8 }} component="form" onSubmit={handleSubmit} sx={{ mt: 0 }}>
                            <Grid size={12} textAlign={'center'}>
                                <Typography
                                    mb={3}
                                    variant="h5"
                                    component="h1"
                                    fontWeight="bold"
                                    color="primary.main"
                                    gutterBottom>
                                    Demande d'inscription
                                </Typography>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Nom"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AccountCircleOutlined color="action" />
                                                </InputAdornment>
                                            )
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Prénom"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AccountCircleOutlined color="action" />
                                                </InputAdornment>
                                            )
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailOutlined color="action" />
                                                </InputAdornment>
                                            )
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Téléphone"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PhoneOutlined color="action" />
                                                </InputAdornment>
                                            )
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Numéro matricule"
                                        name="matricule_professionnel"
                                        value={formData.matricule_professionnel}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <BadgeOutlined color="action" />
                                                </InputAdornment>
                                            )
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Fonction"
                                        name="fonction"
                                        value={formData.fonction}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <WorkOutlined color="action" />
                                                </InputAdornment>
                                            )
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Hôpital"
                                        name="hospital"
                                        value={formData.hospital}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LocalHospitalOutlined color="action" />
                                                </InputAdornment>
                                            )
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    >
                                        {hospitals.map((hospital) => (
                                            <MenuItem key={hospital.id} value={hospital.id}>
                                                {hospital.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Service"
                                        name="service"
                                        value={formData.service}
                                        onChange={handleChange}
                                        disabled={!formData.hospital} // Désactiver si aucun hôpital n'est sélectionné
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LocalHospitalOutlined color="action" />
                                                </InputAdornment>
                                            )
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    >
                                        {filteredServices.length > 0 ? (
                                            filteredServices.map((service) => (
                                                <MenuItem key={service.id} value={service.id}>
                                                    {service.name}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem disabled value="">
                                                {formData.hospital ? "Aucun service disponible" : "Veuillez sélectionner un hôpital"}
                                            </MenuItem>
                                        )}
                                    </TextField>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Mot de passe *</InputLabel>
                                        <OutlinedInput
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={handleChange}
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <LockOutlined color="action" />
                                                </InputAdornment>
                                            }
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton onClick={togglePasswordVisibility} edge="end">
                                                        {showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Mot de passe"
                                            sx={{ borderRadius: 2 }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Confirmer le mot de passe *</InputLabel>
                                        <OutlinedInput
                                            name="passwordConfirm"
                                            type={showPasswordConfirm ? "text" : "password"}
                                            value={formData.passwordConfirm}
                                            onChange={handleChange}
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <LockOutlined color="action" />
                                                </InputAdornment>
                                            }
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton onClick={togglePasswordConfirmVisibility} edge="end">
                                                        {showPasswordConfirm ? <VisibilityOffRounded /> : <VisibilityRounded />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Confirmer le mot de passe"
                                            sx={{ borderRadius: 2 }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid size={12}>
                                    {error && (
                                        <Alert
                                            severity="error"
                                            sx={{
                                                borderRadius: 2,
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
                                                '& .MuiAlert-icon': { alignItems: 'center' }
                                            }}
                                        >
                                            {success}
                                        </Alert>
                                    )}
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', mb: 2 }}>
                                        <NavLink
                                            to="/login"
                                            style={{
                                                textDecoration: 'none',
                                                color: theme.palette.primary.main,
                                                fontWeight: 500
                                            }}
                                        >
                                            Vous avez déjà un compte ?
                                        </NavLink>
                                    </Box>

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
                                        {loading ? <CircularProgress size={24} color="inherit" /> : "Enregistrer la demande"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
};









// import { useState, useEffect } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import {
//     TextField, Button, IconButton, FormControl, InputLabel, OutlinedInput,
//     InputAdornment, MenuItem, Snackbar, Alert, Typography, CardContent,
//     Box, Container, Paper, useTheme, alpha, CircularProgress,
//     Grid
// } from "@mui/material";
// import {
//     VisibilityRounded, VisibilityOffRounded, BadgeOutlined,
//     EmailOutlined, LockOutlined, LocalHospitalOutlined,
//     WorkOutlined, AccountCircleOutlined, PhoneOutlined,
// } from "@mui/icons-material";

// import { apiTogetAll, apiToPost } from "../../utils/ApiServices";

// export const Register = () => {
//     const navigate = useNavigate();
//     const theme = useTheme();
//     const [showPassword, setShowPassword] = useState(false);
//     const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(null);
//     const [hospitals, setHospitals] = useState([]);
//     const [services, setServices] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [formData, setFormData] = useState({
//         first_name: "",
//         last_name: "",
//         email: "",
//         password: "",
//         passwordConfirm: "",
//         user_type: "simple_user",
//         is_active: false,
//         hospital: "",
//         service: "",
//         phone_number: "",
//         fonction: "",
//         matricule_professionnel: "",
//     });

//     const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
//     const togglePasswordConfirmVisibility = () => setShowPasswordConfirm((prev) => !prev);

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };
//     const requiredFields = {
//         "last_name": "Nom",
//         "first_name": "Prénom",
//         "email": "Email",
//         "phone_number": "Téléphone",
//         "matricule_professionnel": "Numéro matricule",
//         "fonction": "Fonction",
//         "hospital": "Hôpital",
//         "Service": "Hôpital",
//         "password": "Mot de passe",
//         "passwordConfirm": "Confirmer le mot de passe"
//     };
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(null)
//         setSuccess(null);

//         // Vérifier si tous les champs sont remplis
//         for (const key in requiredFields) {
//             if (!formData[key]) {
//                 setError(`Le champ ${requiredFields[key]} est requis.`);
//                 return;
//             }
//         }

//         // Vérifier l'email
//         const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
//         if (!emailRegex.test(formData.email)) {
//             setError("L'email n'est pas valide.");
//             return;
//         }

//         // Vérifier la longueur du mot de passe
//         if (formData.password.length < 8) {
//             setError("Le mot de passe doit contenir au moins 8 caractères.");
//             return;
//         }

//         // Vérifier si les mots de passe correspondent
//         if (formData.password !== formData.passwordConfirm) {
//             setError("Les mots de passe ne correspondent pas.");
//             return;
//         }

//         // Préparer les données à envoyer
//         const { passwordConfirm, hospital, service, ...cleanFormData } = formData;
//         const dataToSend = { ...cleanFormData, hospital_id: hospital, service_id: service };
        

//         // Envoyer les données
//         setLoading(true);
//         try {
//             // await createUser(dataToSend);
//             await apiToPost("comptes/users/", dataToSend);
//             setError(null);
//             setSuccess("Votre demande d'inscription a été enregistrée avec succès.");
//             setFormData({
//                 first_name: "",
//                 last_name: "",
//                 email: "",
//                 password: "",
//                 passwordConfirm: "",
//                 user_type: "simple_user",
//                 is_active: false,
//                 hospital: "",
//                 service: "",
//                 phone_number: "",
//                 fonction: "",
//                 matricule_professionnel: "",
//             });
//         } catch (error) {
//             setError(error.message);
//         } finally {
//             setLoading(false);
//         }

//     };


//     useEffect(() => {
//         const fetchHospitals = async () => {
//             try {
//                 const [hospitalData, serviceData] =  await Promise.all([
//                     apiTogetAll('hospitals/'),
//                     apiTogetAll('services/'),
//                 ])
//                 console.log(hospitalData.results)
//                 console.log(serviceData.results)
//                 setHospitals(hospitalData.results);
//                 setServices(serviceData.results)
//             } catch {
//                 setError("Erreur lors du chargement des données.");
//             }
//         };
//         fetchHospitals();
//     }, []);

//     return (
//         <Box
//             sx={{
//                 minHeight: '100vh',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 backgroundColor: alpha(theme.palette.primary.light, 0.1),
//                 py: 4
//             }}
//         >
//             <Container maxWidth="md">
//                 <Paper
//                     elevation={10}
//                     sx={{
//                         borderRadius: 3,
//                         overflow: 'hidden',
//                         position: 'relative'
//                     }}
//                 >
//                     <Box
//                         sx={{
//                             // height: 8,
//                             width: '100%',
//                             backgroundColor: theme.palette.primary.main
//                         }}
//                     />

//                     <Grid container component={CardContent} spacing={2} size={{ md: 8 }} sx={{ p: 4 }}>
//                         <Grid container size={{ xs: 12, sm: 12, md: 4 }} sx={{ display: 'flex', alignItems: 'center' }}>
//                             <Grid size={12} textAlign={'center'} >
//                                 <Box
//                                     sx={{
//                                         display: 'inline-flex',
//                                         p: 2,
//                                         borderRadius: '50%',
//                                         backgroundColor: alpha(theme.palette.primary.main, 0.1),
//                                         mb: 2
//                                     }}
//                                 >
//                                     <img
//                                         src="/logoMinistere.png"
//                                         alt="Logo"
//                                         style={{
//                                             width: 80,
//                                             height: 80,
//                                             objectFit: 'contain'
//                                         }}
//                                     />
//                                 </Box>
//                                 <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
//                                     Complétez le formulaire pour créer votre compte
//                                 </Typography>
//                             </Grid>
//                         </Grid>

//                         <Grid container size={{ xs: 12, sm: 12, md: 8 }} component="form" onSubmit={handleSubmit} sx={{ mt: 0 }}>
//                             <Grid size={12} textAlign={'center'}>
//                                 <Typography
//                                     mb={3}
//                                     variant="h5"
//                                     component="h1"
//                                     fontWeight="bold"
//                                     color="primary.main"
//                                     gutterBottom>
//                                     Demande d'inscription
//                                 </Typography>
//                             </Grid>
//                             <Grid container spacing={3}>
//                                 <Grid size={{ xs: 12, md: 6 }}>
//                                     <TextField
//                                         fullWidth
//                                         variant="outlined"
//                                         label="Nom"
//                                         name="last_name"
//                                         value={formData.last_name}
//                                         onChange={handleChange}

//                                         InputProps={{
//                                             startAdornment: (
//                                                 <InputAdornment position="start">
//                                                     <AccountCircleOutlined color="action" />
//                                                 </InputAdornment>
//                                             )
//                                         }}
//                                         sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                                     />
//                                 </Grid>

//                                 <Grid size={{ xs: 12, md: 6 }}>
//                                     <TextField
//                                         fullWidth
//                                         variant="outlined"
//                                         label="Prénom"
//                                         name="first_name"
//                                         value={formData.first_name}
//                                         onChange={handleChange}

//                                         InputProps={{
//                                             startAdornment: (
//                                                 <InputAdornment position="start">
//                                                     <AccountCircleOutlined color="action" />
//                                                 </InputAdornment>
//                                             )
//                                         }}
//                                         sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                                     />
//                                 </Grid>

//                                 <Grid size={{ xs: 12, md: 6 }}>
//                                     <TextField
//                                         fullWidth
//                                         variant="outlined"
//                                         label="Email"
//                                         name="email"
//                                         type="email"
//                                         value={formData.email}
//                                         onChange={handleChange}

//                                         InputProps={{
//                                             startAdornment: (
//                                                 <InputAdornment position="start">
//                                                     <EmailOutlined color="action" />
//                                                 </InputAdornment>
//                                             )
//                                         }}
//                                         sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                                     />
//                                 </Grid>

//                                 <Grid size={{ xs: 12, md: 6 }}>
//                                     <TextField
//                                         fullWidth
//                                         variant="outlined"
//                                         label="Téléphone"
//                                         name="phone_number"
//                                         value={formData.phone_number}
//                                         onChange={handleChange}
//                                         InputProps={{
//                                             startAdornment: (
//                                                 <InputAdornment position="start">
//                                                     <PhoneOutlined color="action" />
//                                                 </InputAdornment>
//                                             )
//                                         }}
//                                         sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                                     />
//                                 </Grid>

//                                 <Grid size={{ xs: 12, md: 6 }}>
//                                     <TextField
//                                         fullWidth
//                                         variant="outlined"
//                                         label="Numéro matricule"
//                                         name="matricule_professionnel"
//                                         value={formData.matricule_professionnel}
//                                         onChange={handleChange}

//                                         InputProps={{
//                                             startAdornment: (
//                                                 <InputAdornment position="start">
//                                                     <BadgeOutlined color="action" />
//                                                 </InputAdornment>
//                                             )
//                                         }}
//                                         sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                                     />
//                                 </Grid>

//                                 <Grid size={{ xs: 12, md: 6 }}>
//                                     <TextField
//                                         fullWidth
//                                         variant="outlined"
//                                         label="Fonction"
//                                         name="fonction"
//                                         value={formData.fonction}
//                                         onChange={handleChange}

//                                         InputProps={{
//                                             startAdornment: (
//                                                 <InputAdornment position="start">
//                                                     <WorkOutlined color="action" />
//                                                 </InputAdornment>
//                                             )
//                                         }}
//                                         sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                                     />
//                                 </Grid>

//                                 <Grid size={{ xs: 12, md:6 }}>
//                                     <TextField
//                                         fullWidth
//                                         select
//                                         label="Hôpital"
//                                         name="hospital"
//                                         value={formData.hospital}
//                                         onChange={handleChange}

//                                         InputProps={{
//                                             startAdornment: (
//                                                 <InputAdornment position="start">
//                                                     <LocalHospitalOutlined color="action" />
//                                                 </InputAdornment>
//                                             )
//                                         }}
//                                         sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                                     >
//                                         {hospitals.map((hospital) => (
//                                             <MenuItem key={hospital.id} value={hospital.id}>
//                                                 {hospital.name}
//                                             </MenuItem>
//                                         ))}
//                                     </TextField>
//                                 </Grid>
//                                 <Grid size={{ xs: 12, md:6 }}>
//                                     <TextField
//                                         fullWidth
//                                         select
//                                         label="Service"
//                                         name="service"
//                                         value={formData.service}
//                                         onChange={handleChange}

//                                         InputProps={{
//                                             startAdornment: (
//                                                 <InputAdornment position="start">
//                                                     <LocalHospitalOutlined color="action" />
//                                                 </InputAdornment>
//                                             )
//                                         }}
//                                         sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                                     >
//                                         {services.map((service) => (
//                                             <MenuItem key={service.id} value={service.id}>
//                                                 {service.name}
//                                             </MenuItem>
//                                         ))}
//                                     </TextField>
//                                 </Grid>

//                                 <Grid size={{ xs: 12, md: 6 }}>
//                                     <FormControl fullWidth variant="outlined">
//                                         <InputLabel>Mot de passe *</InputLabel>
//                                         <OutlinedInput
//                                             name="password"
//                                             type={showPassword ? "text" : "password"}
//                                             value={formData.password}
//                                             onChange={handleChange}

//                                             startAdornment={
//                                                 <InputAdornment position="start">
//                                                     <LockOutlined color="action" />
//                                                 </InputAdornment>
//                                             }
//                                             endAdornment={
//                                                 <InputAdornment position="end">
//                                                     <IconButton onClick={togglePasswordVisibility} edge="end">
//                                                         {showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
//                                                     </IconButton>
//                                                 </InputAdornment>
//                                             }
//                                             label="Mot de passe"
//                                             sx={{ borderRadius: 2 }}
//                                         />
//                                     </FormControl>
//                                 </Grid>

//                                 <Grid size={{ xs: 12, md: 6 }}>
//                                     <FormControl fullWidth variant="outlined">
//                                         <InputLabel>Confirmer le mot de passe *</InputLabel>
//                                         <OutlinedInput
//                                             name="passwordConfirm"
//                                             type={showPasswordConfirm ? "text" : "password"}
//                                             value={formData.passwordConfirm}
//                                             onChange={handleChange}

//                                             startAdornment={
//                                                 <InputAdornment position="start">
//                                                     <LockOutlined color="action" />
//                                                 </InputAdornment>
//                                             }
//                                             endAdornment={
//                                                 <InputAdornment position="end">
//                                                     <IconButton onClick={togglePasswordConfirmVisibility} edge="end">
//                                                         {showPasswordConfirm ? <VisibilityOffRounded /> : <VisibilityRounded />}
//                                                     </IconButton>
//                                                 </InputAdornment>
//                                             }
//                                             label="Confirmer le mot de passe"
//                                             sx={{ borderRadius: 2 }}
//                                         />
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid size={12}>
//                                     {error && (
//                                         <Alert
//                                             severity="error"
//                                             sx={{
//                                                 borderRadius: 2,
//                                                 '& .MuiAlert-icon': { alignItems: 'center' }
//                                             }}
//                                         >
//                                             {error}
//                                         </Alert>
//                                     )}
//                                     {success && (
//                                         <Alert
//                                             severity="success"
//                                             sx={{
//                                                 borderRadius: 2,
//                                                 '& .MuiAlert-icon': { alignItems: 'center' }
//                                             }}
//                                         >
//                                             {success}
//                                         </Alert>
//                                     )}
//                                 </Grid>
//                                 <Grid size={{ xs: 12 }}>
//                                     <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', mb: 2 }}>
//                                         <NavLink
//                                             to="/login"
//                                             style={{
//                                                 textDecoration: 'none',
//                                                 color: theme.palette.primary.main,
//                                                 fontWeight: 500
//                                             }}
//                                         >
//                                             Vous avez déjà un compte ?
//                                         </NavLink>
//                                     </Box>

//                                     <Button
//                                         type="submit"
//                                         variant="contained"
//                                         color="primary"
//                                         fullWidth
//                                         disabled={loading}
//                                         sx={{
//                                             py: 1.5,
//                                             borderRadius: 2,
//                                             textTransform: 'none',
//                                             fontSize: '1rem',
//                                             fontWeight: 'bold'
//                                         }}
//                                     >
//                                         {loading ? <CircularProgress size={24} color="inherit" /> : "Enregistrer la demande"}
//                                     </Button>
//                                 </Grid>
//                             </Grid>
//                         </Grid>
//                     </Grid>
//                 </Paper>
//             </Container>
//         </Box>
//     );
// };