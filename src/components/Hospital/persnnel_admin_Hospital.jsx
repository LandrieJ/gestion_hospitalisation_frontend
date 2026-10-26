import { Add, Bed, Delete, Edit, LocalHospital, LocationOn, MedicalServices, MeetingRoom, OpenInNewRounded, Phone, Tag } from '@mui/icons-material'
import { Avatar, Box, Button, Card, CardContent, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import { apiTogetAll, apiToPatch, apiToPost, apiToDelete } from '../../utils/ApiServices';
import { display } from '@mui/system';

export const PaHospital = ({ user }) => {
    const [hospitals, setHospitals] = useState(null);
    const [services, setServices] = useState(null);
    const [tableLoading, setTableLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [serviceToDelete, setServiceToDelete] = useState(null)
    const [openServiceDialog, setOpenServiceDialog] = useState(false)
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
    const [selectedService, setSelectedService] = useState(null)
    const [isEditService, setIsEditService] = useState(false)
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });
    const fetchHospital = async () => {
        setTableLoading(true);
        try {
            const [hospitalsData, servicesData] = await Promise.all([
                apiTogetAll('hospitals/'),
                apiTogetAll('services/lists/'),
            ])
            setHospitals(hospitalsData.results[0] || null);
            setServices(servicesData.results || null);
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Erreur lors du chargement",
                severity: "error"
            });
        } finally {
            setTableLoading(false);
        }
    };

    useEffect(() => {
        fetchHospital();
    }, []);

    const [form, setForm] = useState({
        name: "",
        code: "",
        address: "",
        phone_number: ""
    });

    const [serviceForm, setServiceForm] = useState({
        name: "",
        nombre_chambre: "",
        nombre_lits_par_chambre: "",
        hospital: user.hospital
    });

    const serviceOptions = {
        "urgences": "Urgences",
        "traumatologie": "Traumatologie",
        "cardiologie": "Cardiologie",
        "neurologie": "Neurologie",
        "pediatrie": "Pédiatrie",
        "chirurgie": "Chirurgie",
        "gynecologie": "Gynécologie & Obstétrique",
        "oncologie": "Oncologie",
        "reanimation": "Réanimation",
        "imagerie": "Imagerie médicale",
        "laboratoire": "Laboratoire",
        "logistique": "Logistique",
        "administration": "Administration",
    }

    const handleOpenDeleteDialog = (service) => {
        setOpenDelete(true)
        setServiceToDelete(service)
    }
    const handleCloseDeleteDialog = () => {
        setOpenDelete(false)
        setServiceToDelete(null)
    }
    const handleOpenDialog = (hospital) => {
        setOpenDialog(true);
        if (hospital) {
            setForm({
                id: hospital.id,
                name: hospital.name,
                code: hospital.code,
                address: hospital.address,
                phone_number: hospital.phone_number || ''
            });
        }
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setForm({ id: null, name: "", code: "", address: "", phone_number: "" });
    };
    const handleChange = (e) => {
        const value = e.target.name === 'nombre_chambre' || e.target.name === 'nombre_lits_par_chambre' ? parseInt(e.target.value) || '' : e.target.value;
        setForm({ ...form, [e.target.name]: value });
    };
    const handleSaveHospital = async (formData) => {
        setLoading(true);
        try {
            await apiToPatch('hospitals/', formData.id, formData);
            setSnackbar({
                open: true,
                message: "Hôpital mis à jour avec succès !",
                severity: "success"
            });
            fetchHospital();
            handleCloseDialog();
        } catch (err) {
            setSnackbar({
                open: true,
                message: "Échec de la mise à jour. Veuillez réessayer.",
                severity: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenServiceDialog = (service = null) => {
        setOpenServiceDialog(true);
        if (service) {
            setIsEditService(true);
            setServiceForm({
                id: service.id,
                name: service.name,
                nombre_chambre: service.nombre_chambre,
                nombre_lits_par_chambre: service.nombre_lits_par_chambre,
                hospital: hospitals.id
            });
        } else {
            setIsEditService(false);
            setServiceForm({
                id: null,
                name: "",
                nombre_chambre: "",
                nombre_lits_par_chambre: "",
                hospital: hospitals.id
            });
        }
    };

    const handleCloseServiceDialog = () => {
        setOpenServiceDialog(false);
        setServiceForm({ id: null, name: "", nombre_chambre: "", nombre_lits_par_chambre: "", hospital: null });
    };

    const handleServiceChange = (e) => {
        const value = e.target.name === 'nombre_chambre' || e.target.name === 'nombre_lits_par_chambre' ? parseInt(e.target.value) || '' : e.target.value;
        setServiceForm({ ...serviceForm, [e.target.name]: value });
    };

    const handleSaveService = async (formData) => {
        setLoading(true);
        try {
            if (isEditService) {
                await apiToPatch('services/lists/', formData.id, formData);
                setSnackbar({
                    open: true,
                    message: "Service mis à jour avec succès !",
                    severity: "success"
                });
            } else {
                await apiToPost('services/lists/', formData);
                setSnackbar({
                    open: true,
                    message: "Service créé avec succès !",
                    severity: "success"
                });
            }
            fetchHospital();
            handleCloseServiceDialog();
        } catch (err) {
            setSnackbar({
                open: true,
                message: "Échec de l'opération. Veuillez réessayer.",
                severity: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteService = async (service) => {
        setLoading(true);
        try {
            await apiToDelete('services/lists/', service.id);
            setSnackbar({
                open: true,
                message: "Service supprimé avec succès !",
                severity: "success"
            });
            fetchHospital();
        } catch (err) {
            setSnackbar({
                open: true,
                message: "Échec de la suppression. Veuillez réessayer.",
                severity: "error"
            });
        } finally {
            setLoading(false);
            setOpenDelete(false)
        }
    };

    const handleOpenDetailsDialog = (service) => {
        setSelectedService(service);
        setOpenDetailsDialog(true);
    };

    const handleCloseDetailsDialog = () => {
        setOpenDetailsDialog(false);
        setSelectedService(null);
    };

    const calculateAvailableBeds = (beds) => {
        return beds ? beds.filter(b => !b.is_occupied).length : 0;
    };

    const calculateTotalBeds = (service) => {
        return service.nombre_chambre * service.nombre_lits_par_chambre;
    };

    return (
        <Box sx={{ p: 3 }}>
            {hospitals ? (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LocalHospital sx={{ mr: 2, fontSize: 30 }} color="primary" />
                                <Typography variant="h6" component="h6" fontWeight="bold">
                                    {hospitals.name}
                                </Typography>
                            </Box>
                            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                                Mon hôpital
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {user.user_type !== "simple_user" && (
                                <>
                                    <Button
                                        variant="contained"
                                        startIcon={<Edit />}
                                        onClick={() => handleOpenDialog(hospitals)}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        Modifier les informations
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Box>
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid size={ user.user_type !== "simple_user" ? { xs: 12, sm: 6, md: 3 } : { xs: 12, sm: 12, md: 4 }}>
                            <Card>
                                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                        <Tag />
                                    </Avatar>
                                    <Box>
                                        <Typography color="textSecondary" variant="body2">
                                            Code
                                        </Typography>
                                        <Typography variant="h5" fontWeight="bold">
                                            {hospitals.code}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={ user.user_type !== "simple_user" ? { xs: 12, sm: 6, md: 3 } : { xs: 12, sm: 12, md: 4 }}>
                            <Card>
                                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                                        <LocationOn />
                                    </Avatar>
                                    <Box>
                                        <Typography color="textSecondary" variant="body2">
                                            Adresse
                                        </Typography>
                                        <Typography variant="h5" fontWeight="bold">
                                            {hospitals.address}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={ user.user_type !== "simple_user" ? { xs: 12, sm: 6, md: 3 } : { xs: 12, sm: 12, md: 4 }}>
                            <Card>
                                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                                        <Phone />
                                    </Avatar>
                                    <Box>
                                        <Typography color="textSecondary" variant="body2">
                                            Téléphone
                                        </Typography>
                                        <Typography variant="h5" fontWeight="bold">
                                            {hospitals.phone_number}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        {user.user_type !== "simple_user" && (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Card>
                                    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                                            <MedicalServices />
                                        </Avatar>
                                        <Box>
                                            <Typography color="textSecondary" variant="body2">
                                                {services.length > 1 ? 'Total Services' : 'Total Service'}
                                            </Typography>
                                            <Typography variant="h5" fontWeight="bold">
                                                {services.length}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}
                    </Grid>
                    <Box>
                        <Box sx={{ pt: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <MedicalServices sx={{ color: 'text.secondary', textTransform: 'capitalize' }} />
                                    {user.user_type === "simple_user" ? `Service de ${services[0].name}` : 'Liste des Services'}
                                </Typography>
                                {user.user_type !== "simple_user" && (
                                    <Button
                                        variant="contained"
                                        startIcon={<Add />}
                                        onClick={() => handleOpenServiceDialog()}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        Ajouter un service
                                    </Button>
                                )}
                            </Box>
                            {user.user_type !== "simple_user" && services && services.length > 0 ? (
                                services.map((service, index) => (
                                    <Card key={index} sx={{ mb: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
                                        <CardContent>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid size={{ xs: 12, md: 4 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <MedicalServices sx={{ color: 'primary.main', fontSize: 20 }} />
                                                        <Box>
                                                            <Typography variant="body1" fontWeight="bold" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{service.name} ({service.code})</Typography>
                                                            <Typography variant="body2" color="text.secondary">Service</Typography>
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 2 }}>
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary">Chambres</Typography>
                                                        <Typography variant="body1">{service.nombre_chambre}</Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 2 }}>
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary">Lits par chambre</Typography>
                                                        <Typography variant="body1">{service.nombre_lits_par_chambre}</Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 2 }}>
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary">Lits disponibles / Total</Typography>
                                                        <Typography variant="body1">{calculateAvailableBeds(service.beds)} / {calculateTotalBeds(service)}</Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 2 }}>
                                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                            <Tooltip title="Voir détails">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleOpenDetailsDialog(service)}
                                                                    color="primary"
                                                                >
                                                                    <OpenInNewRounded fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            {user.user_type !== "simple_user" && (
                                                                <>
                                                                    <Tooltip title="Modifier">
                                                                        <IconButton size="small" color="default" onClick={() => handleOpenServiceDialog(service)}>
                                                                            <Edit fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title="Supprimer">
                                                                        <IconButton
                                                                            size="small"
                                                                            color="error"
                                                                            onClick={() => handleOpenDeleteDialog(service)}
                                                                        >
                                                                            <Delete fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : user.user_type === "simple_user" ? (
                                <>
                                    {services && services.length > 0 ? (
                                        services.map((service, index) => (
                                            <Card key={index} sx={{ mb: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
                                                <CardContent>
                                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                                                        {service.name} ({service.code})
                                                    </Typography>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} md={4}>
                                                            <Typography variant="body2" color="text.secondary">Chambres</Typography>
                                                            <Typography variant="body1">{service.nombre_chambre}</Typography>
                                                        </Grid>
                                                        <Grid item xs={12} md={4}>
                                                            <Typography variant="body2" color="text.secondary">Lits par chambre</Typography>
                                                            <Typography variant="body1">{service.nombre_lits_par_chambre}</Typography>
                                                        </Grid>
                                                        <Grid item xs={12} md={4}>
                                                            <Typography variant="body2" color="text.secondary">Lits disponibles / Total</Typography>
                                                            <Typography variant="body1">
                                                                {calculateAvailableBeds(service.beds)} / {calculateTotalBeds(service)}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>

                                                    <Divider sx={{ my: 2 }} />

                                                    <Typography variant="subtitle1" gutterBottom>
                                                        Liste des lits
                                                    </Typography>
                                                    {service.beds && service.beds.length > 0 ? (
                                                        <Grid container spacing={2}>
                                                            {service.beds.map((bed) => (
                                                                <Grid item xs={12} md={4} key={bed.id}>
                                                                    <Card sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 2 }}>
                                                                        <CardContent>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                                <Bed sx={{ color: bed.is_occupied ? 'error.main' : 'success.main' }} />
                                                                                <Typography variant="body1" fontWeight="bold">
                                                                                    {bed.code}
                                                                                </Typography>
                                                                            </Box>
                                                                            <Typography
                                                                                variant="body2"
                                                                                color={bed.is_occupied ? 'error.main' : 'success.main'}
                                                                            >
                                                                                {bed.is_occupied ? 'Occupé' : 'Disponible'}
                                                                            </Typography>
                                                                        </CardContent>
                                                                    </Card>
                                                                </Grid>
                                                            ))}
                                                        </Grid>
                                                    ) : (
                                                        <Paper sx={{ p: 2, bgcolor: 'grey.50', textAlign: 'center', borderRadius: 2 }}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Aucun lit disponible.
                                                            </Typography>
                                                        </Paper>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))
                                    ) : (
                                        <Paper sx={{ p: 2, bgcolor: 'grey.50', textAlign: 'center', borderRadius: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Aucun service disponible.
                                            </Typography>
                                        </Paper>
                                    )}
                                </>
                            )

                                : (
                                    <Paper sx={{ p: 2, bgcolor: 'grey.50', textAlign: 'center', borderRadius: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Aucun service disponible.
                                        </Typography>
                                    </Paper>
                                )}
                        </Box>
                    </Box>
                </>
            ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                        Aucune information disponible.
                    </Typography>
                </Box>
            )}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Modification des informations
                </DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2 }}>
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                required
                                label="Nom de l'hôpital"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                variant="outlined"
                                placeholder="CHU BEFELATANANA"
                                InputProps={{
                                    startAdornment: (
                                        <LocalHospital sx={{ mr: 1, color: 'text.secondary' }} />
                                    )
                                }}
                            />
                            <TextField
                                fullWidth
                                required
                                label="Code"
                                name="code"
                                value={form.code}
                                onChange={handleChange}
                                variant="outlined"
                                placeholder="BEF"
                            />
                            <TextField
                                fullWidth
                                required
                                label="Adresse"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                variant="outlined"
                                placeholder="Mahamasina, Antananarivo"
                                InputProps={{
                                    startAdornment: (
                                        <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                                    )
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Numéro de téléphone"
                                name="phone_number"
                                value={form.phone_number}
                                onChange={handleChange}
                                variant="outlined"
                                placeholder="032 52 470 99"
                                InputProps={{
                                    startAdornment: (
                                        <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                                    )
                                }}
                            />
                        </Stack>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Annuler
                    </Button>
                    <Button
                        onClick={() => handleSaveHospital(form)}
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                        disabled={loading || !form.name || !form.code || !form.address}
                    >
                        {loading ? 'Mise à jour...' : 'Mettre à jour'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openServiceDialog}
                onClose={handleCloseServiceDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {isEditService ? 'Modifier le service' : 'Créer un service'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2 }}>
                        <Stack spacing={3}>
                            <FormControl fullWidth required>
                                <InputLabel id="service-name-label">Nom du service</InputLabel>
                                <Select
                                    labelId="service-name-label"
                                    name="name"
                                    value={serviceForm.name}
                                    label="Nom du service"
                                    onChange={handleServiceChange}
                                >
                                    {Object.entries(serviceOptions).map(([key, value]) => (
                                        <MenuItem key={key} value={key}>
                                            {value}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Nombre de chambres"
                                name="nombre_chambre"
                                value={serviceForm.nombre_chambre}
                                onChange={handleServiceChange}
                                variant="outlined"
                                placeholder="3"
                                InputProps={{
                                    startAdornment: (
                                        <MeetingRoom sx={{ mr: 1, color: 'text.secondary' }} />
                                    )
                                }}
                            />
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Nombre de lits par chambre"
                                name="nombre_lits_par_chambre"
                                value={serviceForm.nombre_lits_par_chambre}
                                onChange={handleServiceChange}
                                variant="outlined"
                                placeholder="3"
                                InputProps={{
                                    startAdornment: (
                                        <Bed sx={{ mr: 1, color: 'text.secondary' }} />
                                    )
                                }}
                            />
                        </Stack>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseServiceDialog} color="primary">
                        Annuler
                    </Button>
                    <Button
                        onClick={() => handleSaveService(serviceForm)}
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                        disabled={loading || !serviceForm.name || !serviceForm.nombre_chambre || !serviceForm.nombre_lits_par_chambre}
                    >
                        {loading ? (isEditService ? 'Mise à jour...' : 'Création...') : (isEditService ? 'Mettre à jour' : 'Créer')}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openDetailsDialog}
                onClose={handleCloseDetailsDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Détails du service: {selectedService?.name} ({selectedService?.code})
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Bed sx={{ color: 'text.secondary' }} />
                            Liste des Lits
                        </Typography>
                        {selectedService?.beds && selectedService.beds.length > 0 ? (
                            selectedService.beds.map((bed, index) => (
                                <Card key={index} sx={{ mb: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
                                    <CardContent>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Bed sx={{ color: bed.is_occupied ? 'error.main' : 'success.main', fontSize: 20 }} />
                                                    <Box>
                                                        <Typography variant="body1" fontWeight="bold">{bed.code}</Typography>
                                                        <Typography variant="body2" color="text.secondary">Code du lit</Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Checkbox
                                                        checked={bed.is_occupied}
                                                        disabled
                                                        sx={{
                                                            color: bed.is_occupied ? 'error.main' : 'success.main',
                                                            '&.Mui-checked': { color: 'error.main' },
                                                        }}
                                                    />
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary">Statut</Typography>
                                                        <Typography variant="body1" color={bed.is_occupied ? 'error.main' : 'success.main'}>
                                                            {bed.is_occupied ? 'Occupé' : 'Disponible'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Paper sx={{ p: 2, bgcolor: 'grey.50', textAlign: 'center', borderRadius: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Aucun lit disponible.
                                </Typography>
                            </Paper>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDetailsDialog} color="primary">
                        Fermer
                    </Button>
                </DialogActions>
            </Dialog>
            {serviceToDelete && (
                <Dialog
                    open={openDelete}
                    onClose={handleCloseDeleteDialog}
                >
                    <DialogTitle>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Delete color="error" />
                            Confirmer la suppression
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="body1" gutterBottom>
                            Êtes-vous sûr de vouloir supprimer le Service
                            <strong> {serviceToDelete.name} </strong>?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleCloseDeleteDialog()} color="primary">
                            Annuler
                        </Button>
                        <Button
                            onClick={() => handleDeleteService(serviceToDelete)}
                            color="error"
                            variant="contained"
                            startIcon={<Delete />}>
                            Supprimer
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    )
}