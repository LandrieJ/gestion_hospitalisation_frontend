import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TablePagination, IconButton, Grid, Card, CardContent, Avatar, alpha, useTheme, TableSortLabel,
    TextField, Stack, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Snackbar,
    CircularProgress, Divider, FormControl, InputLabel, Select, MenuItem, Tooltip, LinearProgress
} from '@mui/material';
import {
    Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, LocalHospital as LocalHospitalIcon,
    LocationOn as LocationOnIcon, Phone as PhoneIcon, Search as SearchIcon, MedicalServices as MedicalServicesIcon,
    OpenInNewRounded, Visibility
} from '@mui/icons-material';
import MuiAlert from '@mui/material/Alert';
import { apiToDelete, apiTogetAll, apiToPatch, apiToPost } from '../../utils/ApiServices';
import { theme } from '../../utils/themecolor';

export const SaHospital = () => {
    const theme = useTheme();
    const [hospitals, setHospitals] = useState([]);
    const [services, setServices] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState('');
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [tableLoading, setTableLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });
    const [openDetailDialog, setOpenDetailDialog] = useState(false);
    const [openServiceDialog, setOpenServiceDialog] = useState(false);
    const [serviceDialogMode, setServiceDialogMode] = useState('');
    const [selectedService, setSelectedService] = useState(null);
    const [serviceSearchTerm, setServiceSearchTerm] = useState('');

    const [form, setForm] = useState({
        id: null,
        name: "",
        code: "",
        address: "",
        phone_number: ""
    });

    const [serviceForm, setServiceForm] = useState({
        id: null,
        name: "",
        nombre_chambre: "",
        nombre_lits_par_chambre: "",
        hospital: null
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

    const handleSort = (field) => {
        const isAsc = sortBy === field && sortOrder === 'asc';
        setSortOrder(isAsc ? 'desc' : 'asc');
        setSortBy(field);
    };

    const handleOpenDialog = (mode, hospital) => {
        setSelectedHospital(hospital);
        setDialogMode(mode);
        setOpenDialog(true);
        if (mode === 'edit' && hospital) {
            setForm({
                id: hospital.id,
                name: hospital.name,
                code: hospital.code,
                address: hospital.address,
                phone_number: hospital.phone_number || ''
            });
        } else if (mode === 'create') {
            setForm({ id: null, name: "", code: "", address: "", phone_number: "" });
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedHospital(null);
        setDialogMode('');
        setForm({ id: null, name: "", code: "", address: "", phone_number: "" });
    };

    const handleOpenServiceDialog = (mode, service = null) => {
        setServiceDialogMode(mode);
        setOpenServiceDialog(true);
        if (mode === 'edit' && service) {
            setSelectedService(service);
            setServiceForm({
                id: service.id,
                name: service.name,
                nombre_chambre: service.nombre_chambre,
                nombre_lits_par_chambre: service.nombre_lits_par_chambre,
                hospital: selectedHospital.id
            });
        } else {
            setSelectedService(null);
            setServiceForm({
                id: null,
                name: "",
                nombre_chambre: "",
                nombre_lits_par_chambre: "",
                hospital: selectedHospital.id
            });
        }
    };

    const handleCloseServiceDialog = () => {
        setOpenServiceDialog(false);
        setServiceDialogMode('');
        setSelectedService(null);
        setServiceForm({ id: null, name: "", nombre_chambre: "", nombre_lits_par_chambre: "", hospital: null });
    };

    const handleOpenDetail = (hospital) => {
        setSelectedHospital(hospital);
        setOpenDetailDialog(true);
        setServiceSearchTerm('');
    };

    const handleCloseDetail = () => {
        setOpenDetailDialog(false);
        setSelectedHospital(null);
        setServiceSearchTerm('');
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setForm({ ...form, [e.target.name]: value });
    };

    const handleServiceChange = (e) => {
        const value = e.target.name === 'nombre_chambre' || e.target.name === 'nombre_lits_par_chambre' ? parseInt(e.target.value) || '' : e.target.value;
        setServiceForm({ ...serviceForm, [e.target.name]: value });
    };

    const handleSaveHospital = async (formData) => {
        setLoading(true);
        try {
            if (dialogMode === 'create') {
                await apiToPost('hospitals/', formData);
                setSnackbar({
                    open: true,
                    message: "Hôpital créé avec succès !",
                    severity: "success"
                });
            } else if (dialogMode === 'edit' && selectedHospital) {
                await apiToPatch('hospitals/', selectedHospital.id, formData);
                setSnackbar({
                    open: true,
                    message: "Hôpital mis à jour avec succès !",
                    severity: "success"
                });
            }
            fetchHospitals();
            handleCloseDialog();
        } catch (err) {
            setSnackbar({
                open: true,
                message: dialogMode === 'edit'
                    ? "Échec de la mise à jour. Veuillez réessayer."
                    : "Échec de la création. Veuillez réessayer.",
                severity: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveService = async (formData) => {
        setLoading(true);
        try {
            if (serviceDialogMode === 'edit') {
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
            fetchHospitals();
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

    const handleDeleteHospital = async () => {
        if (selectedHospital) {
            try {
                await apiToDelete('hospitals/', selectedHospital.id);
                setSnackbar({
                    open: true,
                    message: "Hôpital supprimé avec succès",
                    severity: "success"
                });
                fetchHospitals();
            } catch (error) {
                setSnackbar({
                    open: true,
                    message: "Erreur lors de la suppression",
                    severity: "error"
                });
            } finally {
                handleCloseDialog();
            }
        }
    };

    const handleDeleteService = async (serviceId) => {
        try {
            await apiToDelete('services/lists/', serviceId);
            setSnackbar({
                open: true,
                message: "Service supprimé avec succès",
                severity: "success"
            });
            fetchHospitals();
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Erreur lors de la suppression du service",
                severity: "error"
            });
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const fetchHospitals = async () => {
        setTableLoading(true);
        try {
            const [hospitalsData, servicesData] = await Promise.all([
                apiTogetAll('hospitals/'),
                apiTogetAll('services/lists/'),
            ]);
            setHospitals(hospitalsData.results || []);
            setServices(servicesData.results || []);
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Erreur lors du chargement des hôpitaux",
                severity: "error"
            });
        } finally {
            setTableLoading(false);
        }
    };

    useEffect(() => {
        fetchHospitals();
    }, []);

    const filteredHospitals = hospitals.filter(hospital =>
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.address.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];
        if (sortOrder === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
    });

    const filteredServices = services.filter(s =>
        s.hospital === selectedHospital?.id &&
        (s.name.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
            s.code.toLowerCase().includes(serviceSearchTerm.toLowerCase()))
    );

    const calculateAvailableBeds = (beds) => {
        return beds ? beds.filter(b => !b.is_occupied).length : 0;
    };

    const calculateTotalBeds = (service) => {
        return service.nombre_chambre * service.nombre_lits_par_chambre;
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    return (
        <Box sx={{ p: 4, bgcolor: 'background.default' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <LocalHospitalIcon sx={{ fontSize: 36, color: 'primary.main' }} />
                        <Typography variant="h5" fontWeight="bold">
                            Gestion des Hôpitaux
                        </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                        Administration des établissements hospitaliers
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog('create')}
                    sx={{ borderRadius: 2, px: 3, py: 1.5 }}
                >
                    Nouvel Hôpital
                </Button>
            </Box>

            {/* Quick Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px RGBA(0, 0, 0, 0.08)' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 48, height: 48 }}>
                                <LocalHospitalIcon />
                            </Avatar>
                            <Box>
                                <Typography color="text.secondary" variant="body2">Total Hôpitaux</Typography>
                                <Typography variant="h5" fontWeight="bold">{hospitals.length}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px RGBA(0, 0, 0, 0.08)' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: 'success.main', mr: 2, width: 48, height: 48 }}>
                                <MedicalServicesIcon />
                            </Avatar>
                            <Box>
                                <Typography color="text.secondary" variant="body2">Total Services</Typography>
                                <Typography variant="h5" fontWeight="bold">{services.length}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px RGBA(0, 0, 0, 0.08)' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: 'secondary.main', mr: 2, width: 48, height: 48 }}>
                                <PhoneIcon />
                            </Avatar>
                            <Box>
                                <Typography color="text.secondary" variant="body2">Nombre des Chambres</Typography>
                                <Typography variant="h5" fontWeight="bold">
                                    {services.reduce((acc, s) => acc + (s.nombre_chambre), 0)}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px RGBA(0, 0, 0, 0.08)' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: 'info.main', mr: 2, width: 48, height: 48 }}>
                                <MedicalServicesIcon />
                            </Avatar>
                            <Box>
                                <Typography color="text.secondary" variant="body2">Total Lits / Disponibles</Typography>
                                <Typography variant="h5" fontWeight="bold">
                                    {services.reduce((acc, s) => acc + (s.nombre_chambre * s.nombre_lits_par_chambre), 0)} /
                                    {services.reduce((acc, s) => acc + calculateAvailableBeds(s.beds), 0)}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Search */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: '0 4px 20px RGBA(0, 0, 0, 0.08)' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            placeholder="Rechercher un hôpital..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                                sx: { borderRadius: 2 }
                            }}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Hospitals Table */}
            <Paper sx={{ borderRadius: 3, boxShadow: '0 4px 20px RGBA(0, 0, 0, 0.08)' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortBy === 'name'}
                                        direction={sortOrder}
                                        onClick={() => handleSort('name')}
                                    >
                                        <Typography variant="subtitle2" fontWeight="bold">Nom</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortBy === 'code'}
                                        direction={sortOrder}
                                        onClick={() => handleSort('code')}
                                    >
                                        <Typography variant="subtitle2" fontWeight="bold">Code</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight="bold">Services</Typography>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortBy === 'address'}
                                        direction={sortOrder}
                                        onClick={() => handleSort('address')}
                                    >
                                        <Typography variant="subtitle2" fontWeight="bold">Adresse</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortBy === 'phone_number'}
                                        direction={sortOrder}
                                        onClick={() => handleSort('phone_number')}
                                    >
                                        <Typography variant="subtitle2" fontWeight="bold">Téléphone</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight="bold">Actions</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                        <CircularProgress sx={{ color: alpha(theme.palette.primary.main, 0.8) }} />
                                        <Typography variant="body2" sx={{ mt: 2 }}>
                                            Chargement des hôpitaux...
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : filteredHospitals.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body2">
                                            Aucun hôpital enregistré
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredHospitals
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((hospital) => (
                                        <TableRow
                                            key={hospital.id}
                                            hover
                                            sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) } }}
                                        >
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                                                        <LocalHospitalIcon fontSize="small" />
                                                    </Avatar>
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {hospital.name}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{hospital.code}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {services.filter(s => s.hospital === hospital.id).length}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{hospital.address || '-'}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{hospital.phone_number || '-'}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Tooltip title="Voir détails">
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() => handleOpenDetail(hospital)}
                                                        >
                                                            <OpenInNewRounded fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Modifier">
                                                        <IconButton
                                                            size="small"
                                                            color="default"
                                                            onClick={() => handleOpenDialog('edit', hospital)}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Supprimer">
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleOpenDialog('delete', hospital)}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredHospitals.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Lignes par page:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
                    sx={{ "& p": { mb: 0 } }}
                />
            </Paper>

            {/* Dialog for create/edit hospital */}
            <Dialog
                open={openDialog && dialogMode !== 'delete'}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {dialogMode === 'create' ? 'Nouvel Hôpital' : 'Modifier Hôpital'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>Informations de l'hôpital</Typography>
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
                                        <LocalHospitalIcon sx={{ mr: 1, color: 'text.secondary' }} />
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
                                        <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
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
                                        <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    )
                                }}
                            />
                        </Stack>
                        {dialogMode === 'edit' && (
                            <>
                                <Divider sx={{ my: 3 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" gutterBottom>Gestion des Services</Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => handleOpenServiceDialog('create')}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        Ajouter un service
                                    </Button>
                                </Box>
                                <Box sx={{ mb: 3 }}>
                                    <TextField
                                        fullWidth
                                        placeholder="Rechercher un service..."
                                        value={serviceSearchTerm}
                                        onChange={(e) => setServiceSearchTerm(e.target.value)}
                                        InputProps={{
                                            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                                            sx: { borderRadius: 2 }
                                        }}
                                    />
                                </Box>
                                {filteredServices.length > 0 ? (
                                    filteredServices.map((service, index) => (
                                        <Card
                                            key={index}
                                            sx={{
                                                mb: 2,
                                                borderRadius: 2,
                                                boxShadow: '0 4px 12px RGBA(0, 0, 0, 0.08)',
                                                '&:hover': { boxShadow: '0 6px 16px RGBA(0, 0, 0, 0.12)' }
                                            }}
                                        >
                                            <CardContent>
                                                <Grid container spacing={2} alignItems="center">
                                                    <Grid size={{ xs: 12, md: 4 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                                                                <MedicalServicesIcon />
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="body1" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                                                                    {service.name} ({service.code})
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">Service</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                    <Grid size={{ xs: 12, md: 2 }}>
                                                        <Typography variant="body2" color="text.secondary">Chambres</Typography>
                                                        <Typography variant="body1">{service.nombre_chambre}</Typography>
                                                    </Grid>
                                                    <Grid size={{ xs: 12, md: 2 }}>
                                                        <Typography variant="body2" color="text.secondary">Lits par chambre</Typography>
                                                        <Typography variant="body1">{service.nombre_lits_par_chambre}</Typography>
                                                    </Grid>
                                                    <Grid size={{ xs: 12, md: 2 }}>
                                                        <Typography variant="body2" color="text.secondary">Lits disponibles / Total</Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Typography variant="body1" color={calculateAvailableBeds(service.beds) > 0 ? 'success.main' : 'error.main'}>
                                                                {calculateAvailableBeds(service.beds)} / {calculateTotalBeds(service)}
                                                            </Typography>
                                                            <Box sx={{ width: 80 }}>
                                                                <LinearProgress
                                                                    variant="determinate"
                                                                    value={(calculateAvailableBeds(service.beds) / calculateTotalBeds(service)) * 100}
                                                                    sx={{
                                                                        height: 6,
                                                                        borderRadius: 3,
                                                                        bgcolor: 'grey.200',
                                                                        '& .MuiLinearProgress-bar': {
                                                                            bgcolor: calculateAvailableBeds(service.beds) > 0 ? 'success.main' : 'error.main'
                                                                        }
                                                                    }}
                                                                />
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                    <Grid size={{ xs: 12, md: 2 }}>
                                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                            <Tooltip title="Modifier le service">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleOpenServiceDialog('edit', service)}
                                                                >
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Supprimer le service">
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={() => handleDeleteService(service.id)}
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: 'grey.50' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Aucun service disponible.
                                        </Typography>
                                    </Paper>
                                )}
                            </>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleCloseDialog} size="large" color="primary">
                        Annuler
                    </Button>
                    <Button
                        onClick={() => handleSaveHospital(form)}
                        variant="contained"
                        size="large"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                        disabled={loading || !form.name || !form.code || !form.address}
                        sx={{ borderRadius: 2 }}
                    >
                        {loading ? (dialogMode === 'edit' ? 'Mise à jour...' : 'Création...') : (dialogMode === 'edit' ? 'Mettre à jour' : 'Créer')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for delete hospital */}
            {selectedHospital && (
                <Dialog
                    open={openDialog && dialogMode === 'delete'}
                    onClose={handleCloseDialog}
                >
                    <DialogTitle>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DeleteIcon color="error" />
                            Confirmer la suppression
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Êtes-vous sûr de vouloir supprimer l'hôpital <strong>{selectedHospital.name}</strong> ?
                            Cette action est irréversible.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                            Annuler
                        </Button>
                        <Button
                            onClick={handleDeleteHospital}
                            color="error"
                            variant="contained"
                            startIcon={<DeleteIcon />}
                        >
                            Supprimer
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* Dialog for service create/edit */}
            <Dialog
                open={openServiceDialog}
                onClose={handleCloseServiceDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {serviceDialogMode === 'edit' ? 'Modifier Service' : 'Nouveau Service'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Stack spacing={3}>
                            <FormControl fullWidth required>
                                <InputLabel id="service-name-label">Nom du service</InputLabel>
                                <Select
                                    labelId="service-name-label"
                                    name="name"
                                    value={serviceForm.name}
                                    label="Nom du service"
                                    onChange={handleServiceChange}
                                    sx={{ borderRadius: 2 }}
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
                                        <MedicalServicesIcon sx={{ mr: 1, color: 'text.secondary' }} />
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
                                        <MedicalServicesIcon sx={{ mr: 1, color: 'text.secondary' }} />
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
                        sx={{ borderRadius: 2 }}
                    >
                        {loading ? (serviceDialogMode === 'edit' ? 'Mise à jour...' : 'Création...') : (serviceDialogMode === 'edit' ? 'Mettre à jour' : 'Créer')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for hospital details */}
            {selectedHospital && (
                <Dialog
                    open={openDetailDialog}
                    onClose={handleCloseDetail}
                    maxWidth="lg"
                    fullWidth
                >
                    <DialogTitle>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <LocalHospitalIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                            Détails de l'hôpital: {selectedHospital.name}
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 3 }}>
                            <Grid container spacing={4}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="h6" gutterBottom>Informations générales</Typography>
                                    <Stack spacing={3}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <LocalHospitalIcon sx={{ color: 'text.secondary' }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">Code</Typography>
                                                <Typography variant="body1" fontWeight="bold">{selectedHospital.code}</Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <LocationOnIcon sx={{ color: 'text.secondary' }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">Adresse</Typography>
                                                <Typography variant="body1">{selectedHospital.address}</Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <PhoneIcon sx={{ color: 'text.secondary' }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">Téléphone</Typography>
                                                <Typography variant="body1">{selectedHospital.phone_number || '-'}</Typography>
                                            </Box>
                                        </Box>
                                    </Stack>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="h6" gutterBottom>Services</Typography>
                                    <Box sx={{ mb: 3 }}>
                                        <TextField
                                            fullWidth
                                            placeholder="Rechercher un service..."
                                            value={serviceSearchTerm}
                                            onChange={(e) => setServiceSearchTerm(e.target.value)}
                                            InputProps={{
                                                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                                                sx: { borderRadius: 2 }
                                            }}
                                        />
                                    </Box>
                                    {filteredServices.length > 0 ? (
                                        filteredServices.map((service, index) => (
                                            <Card
                                                key={index}
                                                sx={{
                                                    mb: 2,
                                                    borderRadius: 2,
                                                    boxShadow: '0 4px 12px RGBA(0, 0, 0, 0.08)',
                                                    '&:hover': { boxShadow: '0 6px 16px RGBA(0, 0, 0, 0.12)' }
                                                }}
                                            >
                                                <CardContent>
                                                    <Grid container spacing={2} alignItems="center">
                                                        <Grid size={{ xs: 12, md: 4 }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                                                                    <MedicalServicesIcon />
                                                                </Avatar>
                                                                <Box>
                                                                    <Typography variant="body1" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                                                                        {service.name} ({service.code})
                                                                    </Typography>
                                                                    <Typography variant="body2" color="text.secondary">Service</Typography>
                                                                </Box>
                                                            </Box>
                                                        </Grid>
                                                        <Grid size={{ xs: 12, md: 2 }}>
                                                            <Typography variant="body2" color="text.secondary">Chambres</Typography>
                                                            <Typography variant="body1">{service.nombre_chambre}</Typography>
                                                        </Grid>
                                                        <Grid size={{ xs: 12, md: 2 }}>
                                                            <Typography variant="body2" color="text.secondary">Lits par chambre</Typography>
                                                            <Typography variant="body1">{service.nombre_lits_par_chambre}</Typography>
                                                        </Grid>
                                                        <Grid size={{ xs: 12, md: 4 }}>
                                                            <Typography variant="body2" color="text.secondary">Lits disponibles / Total</Typography>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Typography variant="body1" color={calculateAvailableBeds(service.beds) > 0 ? 'success.main' : 'error.main'}>
                                                                    {calculateAvailableBeds(service.beds)} / {calculateTotalBeds(service)}
                                                                </Typography>
                                                                <Box sx={{ width: 100 }}>
                                                                    <LinearProgress
                                                                        variant="determinate"
                                                                        value={(calculateAvailableBeds(service.beds) / calculateTotalBeds(service)) * 100}
                                                                        sx={{
                                                                            height: 6,
                                                                            borderRadius: 3,
                                                                            bgcolor: 'grey.200',
                                                                            '& .MuiLinearProgress-bar': {
                                                                                bgcolor: calculateAvailableBeds(service.beds) > 0 ? 'success.main' : 'error.main'
                                                                            }
                                                                        }}
                                                                    />
                                                                </Box>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        ))
                                    ) : (
                                        <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: 'grey.50' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Aucun service disponible.
                                            </Typography>
                                        </Paper>
                                    )}
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={handleCloseDetail} size="large" color="primary" sx={{ borderRadius: 2 }}>
                            Fermer
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};









// import React, { useState, useEffect } from 'react';
// import {
//     Box,
//     Paper,
//     Typography,
//     Button,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     TablePagination,
//     IconButton,
//     Grid,
//     Card,
//     CardContent,
//     Avatar,
//     alpha,
//     useTheme,
//     TableSortLabel,
//     TextField,
//     Stack,
//     Dialog,
//     DialogTitle,
//     Tooltip,
//     DialogActions,
//     DialogContent,
//     DialogContentText,
//     Snackbar,
//     CircularProgress,
//     Checkbox,
//     Divider,
// } from '@mui/material';
// import {
//     Add as AddIcon,
//     Edit as EditIcon,
//     Delete as DeleteIcon,
//     LocalHospital as LocalHospitalIcon,
//     LocationOn as LocationOnIcon,
//     Phone as PhoneIcon,
//     Refresh as RefreshIcon,
//     Search as SearchIcon,
//     Bed as BedIcon,
//     MeetingRoom as ChambreIcon,
//     Visibility,
//     OpenInNewRounded
// } from '@mui/icons-material';
// import MuiAlert from '@mui/material/Alert';
// import { apiToDelete, apiTogetAll, apiToPatch, apiToPost } from '../../utils/ApiServices';
// import { theme } from '../../utils/themecolor';

// export const SaHospital = () => {
//     const theme = useTheme();
//     const [hospitals, setHospitals] = useState([]);
//     const [services, setServices] = useState([]);
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(10);
//     const [openDialog, setOpenDialog] = useState(false);
//     const [dialogMode, setDialogMode] = useState('');
//     const [selectedHospital, setSelectedHospital] = useState(null);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [sortBy, setSortBy] = useState('name');
//     const [sortOrder, setSortOrder] = useState('asc');
//     const [tableLoading, setTableLoading] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [snackbar, setSnackbar] = useState({
//         open: false,
//         message: "",
//         severity: "success"
//     });
//     const [openDetailDialog, setOpenDetailDialog] = useState(false);

//     const [form, setForm] = useState({
//         id: null,
//         name: "",
//         code: "",
//         nombre_chambre: "",
//         nombre_lits_par_chambre: "",
//         address: "",
//         phone_number: ""
//     });

//     const handleSort = (field) => {
//         const isAsc = sortBy === field && sortOrder === 'asc';
//         setSortOrder(isAsc ? 'desc' : 'asc');
//         setSortBy(field);
//     };

//     const handleOpenDialog = (mode, hospital) => {
//         setSelectedHospital(hospital);
//         setDialogMode(mode);
//         setOpenDialog(true);
//         if (mode === 'edit' && hospital) {
//             setForm({
//                 id: hospital.id,
//                 name: hospital.name,
//                 code: hospital.code,
//                 nombre_chambre: hospital.nombre_chambre,
//                 nombre_lits_par_chambre: hospital.nombre_lits_par_chambre,
//                 address: hospital.address,
//                 phone_number: hospital.phone_number || ''
//             });
//         } else if (mode === 'create') {
//             setForm({ id: null, name: "", code: "", nombre_chambre: "", nombre_lits_par_chambre: "", address: "", phone_number: "" });
//         }
//     };

//     const handleCloseDialog = () => {
//         setOpenDialog(false);
//         setSelectedHospital(null);
//         setDialogMode('');
//         setForm({ id: null, name: "", code: "", nombre_chambre: "", nombre_lits_par_chambre: "", address: "", phone_number: "" });
//     };

//     const handleOpenDetail = (hospital) => {
//         setSelectedHospital(hospital);
//         setOpenDetailDialog(true);
//     };

//     const handleCloseDetail = () => {
//         setOpenDetailDialog(false);
//         setSelectedHospital(null);
//     };

//     const handleChange = (e) => {
//         const value = e.target.name === 'nombre_chambre' || e.target.name === 'nombre_lits_par_chambre' ? parseInt(e.target.value) || '' : e.target.value;
//         setForm({ ...form, [e.target.name]: value });
//     };

//     const handleSaveHospital = async (formData) => {
//         setLoading(true);
//         try {
//             if (dialogMode === 'create') {
//                 await apiToPost('hospitals/', formData);
//                 setSnackbar({
//                     open: true,
//                     message: "Hôpital créé avec succès !",
//                     severity: "success"
//                 });
//             } else if (dialogMode === 'edit' && selectedHospital) {
//                 await apiToPatch('hospitals/', selectedHospital.id, formData);
//                 setSnackbar({
//                     open: true,
//                     message: "Hôpital mis à jour avec succès !",
//                     severity: "success"
//                 });
//             }
//             fetchHospitals();
//             handleCloseDialog();
//         } catch (err) {
//             setSnackbar({
//                 open: true,
//                 message: dialogMode === 'edit'
//                     ? "Échec de la mise à jour. Veuillez réessayer."
//                     : "Échec de la création. Veuillez réessayer.",
//                 severity: "error"
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDeleteHospital = async () => {
//         if (selectedHospital) {
//             try {
//                 await apiToDelete('comptes/hospitals/', selectedHospital.id);
//                 setSnackbar({
//                     open: true,
//                     message: "Hôpital supprimé avec succès",
//                     severity: "success"
//                 });
//                 fetchHospitals();
//             } catch (error) {
//                 setSnackbar({
//                     open: true,
//                     message: "Erreur lors de la suppression",
//                     severity: "error"
//                 });
//             } finally {
//                 handleCloseDialog();
//             }
//         }
//     };

//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//     };

//     const fetchHospitals = async () => {
//         setTableLoading(true);
//         try {
//             const [hospitalsData, servicesData] = await Promise.all([
//                 apiTogetAll('hospitals/'),
//                 apiTogetAll('services/lists'),
//             ])
//             setHospitals(hospitalsData.results || []);
//             setServices(servicesData.results || []);
//         } catch (error) {
//             setSnackbar({
//                 open: true,
//                 message: "Erreur lors du chargement des hôpitaux",
//                 severity: "error"
//             });
//         } finally {
//             setTableLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchHospitals();
//     }, []);

//     const filteredHospitals = hospitals.filter(hospital =>
//         hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         hospital.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         hospital.address.toLowerCase().includes(searchTerm.toLowerCase())
//     ).sort((a, b) => {
//         let aValue = a[sortBy];
//         let bValue = b[sortBy];
//         if (sortOrder === 'asc') {
//             return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
//         } else {
//             return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
//         }
//     });

//     const totalBeds = hospitals.reduce((acc, h) => acc + (h.nombre_chambre * h.nombre_lits_par_chambre), 0);
//     const totalOccupied = hospitals.reduce((acc, h) => acc + (h.beds ? h.beds.filter(b => b.is_occupied).length : 0), 0);

//     const handleCloseSnackbar = () => {
//         setSnackbar({ ...snackbar, open: false });
//     };

//     const Alert = React.forwardRef(function Alert(props, ref) {
//         return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
//     });

//     return (
//         <Box sx={{ p: 3 }}>
//             {/* Header */}
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//                 <Box>
//                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                         <LocalHospitalIcon sx={{ mr: 2, fontSize: 30 }} color="primary" />
//                         <Typography variant="h6" component="h6" fontWeight="bold">
//                             Gestion des Hôpitaux
//                         </Typography>
//                     </Box>
//                     <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
//                         Gestion des établissements hospitaliers
//                     </Typography>
//                 </Box>
//                 <Button
//                     variant="contained"
//                     startIcon={<AddIcon />}
//                     onClick={() => handleOpenDialog('create')}
//                     sx={{ borderRadius: 2 }}
//                 >
//                     Nouvel Hôpital
//                 </Button>
//             </Box>

//             {/* Quick Stats */}
//             <Grid container spacing={3} sx={{ mb: 3 }}>
//                 <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//                     <Card>
//                         <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
//                             <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
//                                 <LocalHospitalIcon />
//                             </Avatar>
//                             <Box>
//                                 <Typography color="textSecondary" variant="body2">
//                                     Total Hôpitaux
//                                 </Typography>
//                                 <Typography variant="h5" fontWeight="bold">
//                                     {hospitals.length}
//                                 </Typography>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//                     <Card>
//                         <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
//                             <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
//                                 <LocationOnIcon />
//                             </Avatar>
//                             <Box>
//                                 <Typography color="textSecondary" variant="body2">
//                                     Total Services
//                                 </Typography>
//                                 <Typography variant="h5" fontWeight="bold">
//                                     {services.length}
//                                 </Typography>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//                     <Card>
//                         <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
//                             <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
//                                 <PhoneIcon />
//                             </Avatar>
//                             <Box>
//                                 <Typography color="textSecondary" variant="body2">
//                                     Avec Téléphone
//                                 </Typography>
//                                 <Typography variant="h5" fontWeight="bold">
//                                     {hospitals.filter(h => h.phone_number).length}
//                                 </Typography>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//                     <Card>
//                         <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
//                             <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
//                                 <BedIcon />
//                             </Avatar>
//                             <Box>
//                                 <Typography color="textSecondary" variant="body2">
//                                     Total Lits / Occupés
//                                 </Typography>
//                                 <Typography variant="h5" fontWeight="bold">
//                                     {totalBeds} / {totalOccupied}
//                                 </Typography>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>
//             </Grid>

//             {/* Search */}
//             <Paper sx={{ p: 2, mb: 3 }}>
//                 <Grid container spacing={2} alignItems="center">
//                     <Grid size={{ xs: 12, md: 4 }}>
//                         <TextField
//                             fullWidth
//                             placeholder="Rechercher un hôpital..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             InputProps={{
//                                 startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
//                             }}
//                         />
//                     </Grid>
//                 </Grid>
//             </Paper>

//             {/* Hospitals Table */}
//             <Paper>
//                 <TableContainer>
//                     <Table>
//                         <TableHead>
//                             <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
//                                 <TableCell>
//                                     <TableSortLabel
//                                         active={sortBy === 'name'}
//                                         direction={sortOrder}
//                                         onClick={() => handleSort('name')}
//                                     >
//                                         <Typography variant="subtitle2" fontWeight="bold">Nom</Typography>
//                                     </TableSortLabel>
//                                 </TableCell>
//                                 <TableCell>
//                                     <TableSortLabel
//                                         active={sortBy === 'code'}
//                                         direction={sortOrder}
//                                         onClick={() => handleSort('code')}
//                                     >
//                                         <Typography variant="subtitle2" fontWeight="bold">Code</Typography>
//                                     </TableSortLabel>
//                                 </TableCell>
//                                 <TableCell>
//                                     <TableSortLabel
//                                         active={sortBy === 'nombre_chambre'}
//                                         direction={sortOrder}
//                                         onClick={() => handleSort('nombre_chambre')}
//                                     >
//                                         <Typography variant="subtitle2" fontWeight="bold">Chambres</Typography>
//                                     </TableSortLabel>
//                                 </TableCell>
//                                 <TableCell>
//                                     <TableSortLabel
//                                         active={sortBy === 'nombre_lits_par_chambre'}
//                                         direction={sortOrder}
//                                         onClick={() => handleSort('nombre_lits_par_chambre')}
//                                     >
//                                         <Typography variant="subtitle2" fontWeight="bold">Lits/Chambre</Typography>
//                                     </TableSortLabel>
//                                 </TableCell>
//                                 <TableCell>
//                                     <TableSortLabel
//                                         active={sortBy === 'address'}
//                                         direction={sortOrder}
//                                         onClick={() => handleSort('address')}
//                                     >
//                                         <Typography variant="subtitle2" fontWeight="bold">Adresse</Typography>
//                                     </TableSortLabel>
//                                 </TableCell>
//                                 <TableCell>
//                                     <TableSortLabel
//                                         active={sortBy === 'phone_number'}
//                                         direction={sortOrder}
//                                         onClick={() => handleSort('phone_number')}
//                                     >
//                                         <Typography variant="subtitle2" fontWeight="bold">Téléphone</Typography>
//                                     </TableSortLabel>
//                                 </TableCell>
//                                 <TableCell>
//                                     <Typography variant="subtitle2" fontWeight="bold">Actions</Typography>
//                                 </TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {tableLoading ? (
//                                 <TableRow>
//                                     <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
//                                         <CircularProgress sx={{ color: alpha(theme.palette.primary.main, 0.8) }} />
//                                         <Typography variant="body2" sx={{ mt: 1 }}>
//                                             Chargement des hôpitaux...
//                                         </Typography>
//                                     </TableCell>
//                                 </TableRow>
//                             ) : filteredHospitals.length === 0 ? (
//                                 <TableRow>
//                                     <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
//                                         <Typography variant="body2">
//                                             Aucun hôpital enregistré
//                                         </Typography>
//                                     </TableCell>
//                                 </TableRow>
//                             ) : (
//                                 filteredHospitals
//                                     .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                                     .map((hospital) => (
//                                         <TableRow key={hospital.id} hover>
//                                             <TableCell>
//                                                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                                     <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, mr: 2 }}>
//                                                         <LocalHospitalIcon />
//                                                     </Avatar>
//                                                     <Typography variant="body2" fontWeight="medium">
//                                                         {hospital.name}
//                                                     </Typography>
//                                                 </Box>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <Typography variant="body2">{hospital.code}</Typography>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <Typography variant="body2">{hospital.nombre_chambre}</Typography>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <Typography variant="body2">{hospital.nombre_lits_par_chambre}</Typography>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <Typography variant="body2">{hospital.address || '-'}</Typography>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <Typography variant="body2">{hospital.phone_number || '-'}</Typography>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <Box sx={{ display: 'flex', gap: 0.5 }}>
//                                                     <Tooltip title="Voir détails">
//                                                         <IconButton
//                                                             size="small"
//                                                             color="primary"
//                                                             onClick={() => handleOpenDetail(hospital)}
//                                                         >
//                                                             <OpenInNewRounded fontSize="small" />
//                                                         </IconButton>
//                                                     </Tooltip>
//                                                     <Tooltip title="Modifier">
//                                                         <IconButton
//                                                             size="small"
//                                                             color="default"
//                                                             onClick={() => handleOpenDialog('edit', hospital)}
//                                                         >
//                                                             <EditIcon fontSize="small" />
//                                                         </IconButton>
//                                                     </Tooltip>
//                                                     <Tooltip title="Supprimer">
//                                                         <IconButton
//                                                             size="small"
//                                                             color="error"
//                                                             onClick={() => handleOpenDialog('delete', hospital)}
//                                                         >
//                                                             <DeleteIcon fontSize="small" />
//                                                         </IconButton>
//                                                     </Tooltip>
//                                                 </Box>
//                                             </TableCell>
//                                         </TableRow>
//                                     ))
//                             )}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//                 <TablePagination
//                     rowsPerPageOptions={[5, 10, 25]}
//                     component="div"
//                     count={filteredHospitals.length}
//                     rowsPerPage={rowsPerPage}
//                     page={page}
//                     onPageChange={handleChangePage}
//                     onRowsPerPageChange={handleChangeRowsPerPage}
//                     labelRowsPerPage="Lignes par page:"
//                     labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
//                     sx={{ "& p": { mb: 0 } }}
//                 />
//             </Paper>

//             {/* Dialog for create/edit */}
//             <Dialog
//                 open={openDialog && dialogMode !== 'delete'}
//                 onClose={handleCloseDialog}
//                 maxWidth="sm"
//                 fullWidth
//             >
//                 <DialogTitle>
//                     {dialogMode === 'create' ? 'Nouvel Hôpital' : 'Modifier Hôpital'}
//                 </DialogTitle>
//                 <DialogContent>
//                     <Box component="form" sx={{ mt: 2 }}>
//                         <Stack spacing={3}>
//                             <TextField
//                                 fullWidth
//                                 required
//                                 label="Nom de l'hôpital"
//                                 name="name"
//                                 value={form.name}
//                                 onChange={handleChange}
//                                 variant="outlined"
//                                 placeholder="CHU BEFELATANANA"
//                                 InputProps={{
//                                     startAdornment: (
//                                         <LocalHospitalIcon sx={{ mr: 1, color: 'text.secondary' }} />
//                                     )
//                                 }}
//                             />
//                             <TextField
//                                 fullWidth
//                                 required
//                                 label="Code"
//                                 name="code"
//                                 value={form.code}
//                                 onChange={handleChange}
//                                 variant="outlined"
//                                 placeholder="BEF"
//                             />
//                             <TextField
//                                 fullWidth
//                                 required
//                                 type="number"
//                                 label="Nombre de chambres"
//                                 name="nombre_chambre"
//                                 value={form.nombre_chambre}
//                                 onChange={handleChange}
//                                 variant="outlined"
//                                 placeholder="4"
//                                 InputProps={{
//                                     startAdornment: (
//                                         <ChambreIcon sx={{ mr: 1, color: 'text.secondary' }} />
//                                     )
//                                 }}
//                             />
//                             <TextField
//                                 fullWidth
//                                 required
//                                 type="number"
//                                 label="Nombre de lits par chambre"
//                                 name="nombre_lits_par_chambre"
//                                 value={form.nombre_lits_par_chambre}
//                                 onChange={handleChange}
//                                 variant="outlined"
//                                 placeholder="4"
//                                 InputProps={{
//                                     startAdornment: (
//                                         <BedIcon sx={{ mr: 1, color: 'text.secondary' }} />
//                                     )
//                                 }}
//                             />
//                             <TextField
//                                 fullWidth
//                                 required
//                                 label="Adresse"
//                                 name="address"
//                                 value={form.address}
//                                 onChange={handleChange}
//                                 variant="outlined"
//                                 placeholder="Mahamasina, Antananarivo"
//                                 InputProps={{
//                                     startAdornment: (
//                                         <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
//                                     )
//                                 }}
//                             />
//                             <TextField
//                                 fullWidth
//                                 label="Numéro de téléphone"
//                                 name="phone_number"
//                                 value={form.phone_number}
//                                 onChange={handleChange}
//                                 variant="outlined"
//                                 placeholder="032 52 470 99"
//                                 InputProps={{
//                                     startAdornment: (
//                                         <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
//                                     )
//                                 }}
//                             />
//                         </Stack>
//                     </Box>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleCloseDialog} color="primary">
//                         Annuler
//                     </Button>
//                     <Button
//                         onClick={() => handleSaveHospital(form)}
//                         variant="contained"
//                         startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
//                         disabled={loading || !form.code || !form.nombre_chambre || !form.nombre_lits_par_chambre}
//                     >
//                         {loading ? (dialogMode === 'edit' ? 'Mise à jour...' : 'Création...') : (dialogMode === 'edit' ? 'Mettre à jour' : 'Créer')}
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Dialog for delete */}
//             {selectedHospital && (
//                 <Dialog
//                     open={openDialog && dialogMode === 'delete'}
//                     onClose={handleCloseDialog}
//                 >
//                     <DialogTitle>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <DeleteIcon color="error" />
//                             Confirmer la suppression
//                         </Box>
//                     </DialogTitle>
//                     <DialogContent>
//                         <DialogContentText>
//                             Êtes-vous sûr de vouloir supprimer l'hôpital <strong>{selectedHospital.name}</strong> ?
//                             Cette action est irréversible.
//                         </DialogContentText>
//                     </DialogContent>
//                     <DialogActions>
//                         <Button onClick={handleCloseDialog} color="primary">
//                             Annuler
//                         </Button>
//                         <Button
//                             onClick={handleDeleteHospital}
//                             color="error"
//                             variant="contained"
//                             startIcon={<DeleteIcon />}
//                         >
//                             Supprimer
//                         </Button>
//                     </DialogActions>
//                 </Dialog>
//             )}

//             {/* Dialog for details */}
//             {selectedHospital && (
//                 <Dialog
//                     open={openDetailDialog}
//                     onClose={handleCloseDetail}
//                     maxWidth="md"
//                     fullWidth
//                 >
//                     <DialogTitle>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <LocalHospitalIcon sx={{ fontSize: 28, color: 'primary.main' }} />
//                             Détails de l'hôpital: {selectedHospital.name}
//                         </Box>
//                     </DialogTitle>
//                     <DialogContent>
//                         <Box sx={{ pt: 2 }}>
//                             <Grid container spacing={3}>
//                                 <Grid size={{ xs: 12, md: 6 }}>
//                                     <Typography variant="h6" gutterBottom>Informations générales</Typography>
//                                     <Stack spacing={2}>
//                                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                             <LocalHospitalIcon sx={{ mr: 1, color: 'text.secondary' }} />
//                                             <Box>
//                                                 <Typography variant="body2" color="text.secondary">Code</Typography>
//                                                 <Typography variant="body1" fontWeight="bold">{selectedHospital.code}</Typography>
//                                             </Box>
//                                         </Box>
//                                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                             <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
//                                             <Box>
//                                                 <Typography variant="body2" color="text.secondary">Adresse</Typography>
//                                                 <Typography variant="body1">{selectedHospital.address}</Typography>
//                                             </Box>
//                                         </Box>
//                                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                             <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
//                                             <Box>
//                                                 <Typography variant="body2" color="text.secondary">Téléphone</Typography>
//                                                 <Typography variant="body1">{selectedHospital.phone_number || '-'}</Typography>
//                                             </Box>
//                                         </Box>
//                                     </Stack>
//                                 </Grid>
//                                 <Grid size={{ xs: 12, md: 6 }}>
//                                     <Typography variant="h6" gutterBottom>Capacité</Typography>
//                                     <Stack spacing={2}>
//                                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                             <ChambreIcon sx={{ mr: 1, color: 'text.secondary' }} />
//                                             <Box>
//                                                 <Typography variant="body2" color="text.secondary">Nombre de chambres</Typography>
//                                                 <Typography variant="body1" fontWeight="bold">{selectedHospital.nombre_chambre}</Typography>
//                                             </Box>
//                                         </Box>
//                                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                             <BedIcon sx={{ mr: 1, color: 'text.secondary' }} />
//                                             <Box>
//                                                 <Typography variant="body2" color="text.secondary">Lits par chambre</Typography>
//                                                 <Typography variant="body1" fontWeight="bold">{selectedHospital.nombre_lits_par_chambre}</Typography>
//                                             </Box>
//                                         </Box>
//                                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                             <BedIcon sx={{ mr: 1, color: 'text.secondary' }} />
//                                             <Box>
//                                                 <Typography variant="body2" color="text.secondary">Total lits / Occupés</Typography>
//                                                 <Typography variant="body1" fontWeight="bold">
//                                                     {selectedHospital.nombre_chambre * selectedHospital.nombre_lits_par_chambre} / {selectedHospital.beds?.filter(b => b.is_occupied).length || 0}
//                                                 </Typography>
//                                             </Box>
//                                         </Box>
//                                     </Stack>
//                                 </Grid>
//                             </Grid>

//                             <Divider sx={{ my: 3 }} />

//                             <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                 <BedIcon sx={{ color: 'text.secondary' }} />
//                                 Liste des Lits
//                             </Typography>
//                             {selectedHospital.beds && selectedHospital.beds.length > 0 ? (
//                                 selectedHospital.beds.map((bed, index) => (
//                                     <Card key={index} sx={{ mb: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
//                                         <CardContent>
//                                             <Grid container spacing={2} alignItems="center">
//                                                 <Grid size={{ xs: 12, md: 6 }}>
//                                                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                                         <BedIcon sx={{ color: bed.is_occupied ? 'error.main' : 'success.main', fontSize: 20 }} />
//                                                         <Box>
//                                                             <Typography variant="body1" fontWeight="bold">{bed.code}</Typography>
//                                                             <Typography variant="body2" color="text.secondary">Code du lit</Typography>
//                                                         </Box>
//                                                     </Box>
//                                                 </Grid>
//                                                 <Grid size={{ xs: 12, md: 6 }}>
//                                                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                                         <Checkbox
//                                                             checked={bed.is_occupied}
//                                                             disabled
//                                                             sx={{
//                                                                 color: bed.is_occupied ? 'error.main' : 'success.main',
//                                                                 '&.Mui-checked': { color: 'error.main' },
//                                                             }}
//                                                         />
//                                                         <Box>
//                                                             <Typography variant="body2" color="text.secondary">Statut</Typography>
//                                                             <Typography variant="body1" color={bed.is_occupied ? 'error.main' : 'success.main'}>
//                                                                 {bed.is_occupied ? 'Occupé' : 'Disponible'}
//                                                             </Typography>
//                                                         </Box>
//                                                     </Box>
//                                                 </Grid>
//                                             </Grid>
//                                         </CardContent>
//                                     </Card>
//                                 ))
//                             ) : (
//                                 <Paper sx={{ p: 2, bgcolor: 'grey.50', textAlign: 'center', borderRadius: 2 }}>
//                                     <Typography variant="body2" color="text.secondary">
//                                         Aucun lit disponible.
//                                     </Typography>
//                                 </Paper>
//                             )}
//                         </Box>
//                     </DialogContent>
//                     <DialogActions sx={{ p: 3 }}>
//                         <Button onClick={handleCloseDetail} size="large" color="primary">
//                             Fermer
//                         </Button>
//                     </DialogActions>
//                 </Dialog>
//             )}

//             {/* Snackbar for notifications */}
//             <Snackbar
//                 open={snackbar.open}
//                 autoHideDuration={6000}
//                 onClose={handleCloseSnackbar}
//                 anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//             >
//                 <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
//                     {snackbar.message}
//                 </Alert>
//             </Snackbar>
//         </Box>
//     );
// };