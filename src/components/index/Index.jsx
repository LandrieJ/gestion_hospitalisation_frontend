import { useState, useEffect, useContext } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Avatar,
    Paper,
    Chip,
    LinearProgress,
    IconButton,
    Button,
    Divider,
    Alert,
    Badge,
    useTheme,
    alpha,
    Stack,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    AppBar,
    Toolbar,
    Container,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    InputAdornment
} from '@mui/material';
import {
    LocalHospital as HospitalIcon,
    People as PeopleIcon,
    Inventory as InventoryIcon,
    Assignment as AssignmentIcon,
    TrendingUp as TrendingUpIcon,
    Notifications as NotificationsIcon,
    Warning as WarningIcon,
    Schedule as ScheduleIcon,
    MonitorHeart as MonitorHeartIcon,
    PersonAdd as PersonAddIcon,
    Bed as BedIcon,
    Add as AddIcon,
    Refresh as RefreshIcon,
    Visibility as VisibilityIcon,
    Phone as PhoneIcon,
    LocationOn as LocationOnIcon,
    AccessTime as AccessTimeIcon,
    Speed as SpeedIcon,
    Analytics as AnalyticsIcon,
    CalendarToday as CalendarTodayIcon,
    Group as GroupIcon,
    ShoppingCartRounded,
    AssignmentRounded,
    PersonAddRounded,
    DoNotDisturb,
    CalendarMonth,
    MedicalServices as MedicalServicesIcon
} from '@mui/icons-material';
import { UserContext } from '../../utils/UserContext';
import { apiTogetAll, apiToPost } from '../../utils/ApiServices';
import { NavLink } from 'react-router-dom';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import fr from 'date-fns/locale/fr';

export const Index = () => {
    const theme = useTheme();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [refreshing, setRefreshing] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [eventData, setEventData] = useState({
        time: null,
        event: '',
        type: '',
        service: '',
    });

    const { user } = useContext(UserContext);
    const [patientData, setPatientData] = useState([]);
    const [personnelData, setPersonnelData] = useState([]);
    const [demandes, setDemandes] = useState([]);
    const [dossierData, setDossierData] = useState([]);
    const [articleData, setArticleData] = useState([]);
    const [evenementData, setEvenementData] = useState([]);
    const [servicesData, setServicesData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [patientResponse, personnelResponse, demandeResponse, dossierResponse, articleResponse, evenementResponse, servicesResponse] = await Promise.all([
                    apiTogetAll('patient/'),
                    apiTogetAll('comptes/users/?is_active=true'),
                    apiTogetAll('comptes/users/?is_active=false'),
                    apiTogetAll('traumatologie/traumatologie-dossiers/'),
                    apiTogetAll('logistique/articles/'),
                    apiTogetAll('evenement/'),
                    apiTogetAll('services/lists/'),
                ]);

                setPatientData(patientResponse);
                setPersonnelData(personnelResponse);
                setDemandes(demandeResponse);
                setEvenementData(evenementResponse.results);
                setDossierData(dossierResponse.results);
                setArticleData(articleResponse.results);
                setServicesData(servicesResponse.results);
            } catch (err) {
                setError('Erreur lors du chargement des données');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const isToday = date => {
        if (!date) return false;
        const d = new Date(date);
        const now = new Date();
        return d.toDateString() === now.toDateString();
    };

    const hospitalServices = servicesData.filter(service => service.hospital === user?.hospital?.id);

    const patients = {
        filteredPatients: patientData.filter(patient => patient.hospitals.includes(user?.hospital?.id)),
        recentPatients: patientData.filter(patient => patient.hospitals.includes(user?.hospital?.id)).sort((a, b) => new Date(b.date_joined) - new Date(a.date_joined)).slice(0, 3),
        newPatientsToday: patientData.filter(p => isToday(p.date_registered))
    };

    const personnels = {
        filteredPersonnels: personnelData.filter(personnel => personnel.hospital?.id === user?.hospital?.id),
        recentPersonnels: personnelData.filter(personnel => personnel.hospital?.id === user?.hospital?.id).sort((a, b) => new Date(b.date_joined) - new Date(a.date_joined)).slice(0, 3),
        newPersonnelsToday: personnelData.filter(p => isToday(p.date_joined))
    };

    const demandesPersonnels = {
        filteredDemandes: demandes.filter(demande => demande.hospital?.id === user?.hospital?.id),
        recentDemandes: demandes.filter(demande => demande.hospital?.id === user?.hospital?.id).sort((a, b) => new Date(b.date_joined) - new Date(a.date_joined)).slice(0, 3),
        newDemandesToday: demandes.filter(d => isToday(d.date_joined))
    };

    const allBeds = hospitalServices.flatMap(s => s.beds || []);
    const occupiedBedsCount = allBeds.filter(b => b.is_occupied).length;
    const totalBeds = hospitalServices.reduce((acc, s) => acc + (s.nombre_chambre * s.nombre_lits_par_chambre), 0);

    const hospitalBeds = {
        allBeds: totalBeds,
        occupiedBeds: occupiedBedsCount,
        freeBeds: totalBeds - occupiedBedsCount,
    };

    const dossiers = {
        allDossiers: dossierData,
        recentDossiers: dossierData.sort((a, b) => new Date(b.date_creation) - new Date(a.date_creation)).slice(0, 3),
        openDossiers: dossierData.filter(dossier => dossier.statut === 'ouvert'),
        closedDossiers: dossierData.filter(dossier => dossier.statut === 'ferme'),
    };

    const today = new Date();

    const hospitalData = {
        hospitalInfo: {
            name: user?.hospital?.name || "Centre Hospitalier Universitaire",
            code: user?.hospital?.code || "Code non disponible",
            address: user?.hospital?.address || "Adresse non disponible",
            phone: user?.hospital?.phone_number || "Téléphone non disponible",
            totalServices: hospitalServices.length
        },
        stats: {
            trend: Math.round((patients.newPatientsToday.length / patients.filteredPatients.length) * 100) || 0.5,
            totalPatients: patients.filteredPatients.length,
            newPatientsToday: patients.newPatientsToday.length,
            activePersonnel: personnels.filteredPersonnels.length,
            pendingRequests: demandesPersonnels.filteredDemandes.length,
            occupiedBeds: hospitalBeds.occupiedBeds,
            totalBeds: hospitalBeds.allBeds,
            criticalStock: articleData.filter(article => article.quantite_stock <= article.seuil_critique).length,
            dossiersOuverts: dossiers.openDossiers.length,
            dossiersTraites: dossierData.filter(d => isToday(d.date_creation)).length,
            urgencesEnCours: dossierData.filter(d => d.suite_procedure === 'hospitalisation').length,
            transferts: dossierData.filter(d => d.suite_procedure === 'transfert').length,
            dossiersArchives: dossierData.filter(d => d.statut === 'ferme').length,
            newDossiersToday: dossiers.recentDossiers.length,
            trendDossier: Math.round((dossiers.recentDossiers.length / dossiers.allDossiers.length) * 100) || 0,
            tauxOccupation: hospitalBeds.allBeds ? Math.round((hospitalBeds.occupiedBeds / hospitalBeds.allBeds) * 100) : 0
        },
        recentDossiers: dossiers.recentDossiers.map(dossier => ({
            id: dossier.id,
            patient_id: dossier.patient_id,
            firstName: dossier.patient_nom.split(' ')[0],
            lastName: dossier.patient_nom.split(' ').slice(1).join(' '),
            age: patientData.find(p => p.id === dossier.patient_id)?.age || 0,
            genre: patientData.find(p => p.id === dossier.patient_id)?.genre || 'Inconnu',
            status: dossier.suite_procedure === 'hospitalisation' ? 'En traitement' :
                dossier.suite_procedure === 'deces' ? 'Décédé(e)' :
                    dossier.suite_procedure === 'domicile' ? 'Sortie' : 'Admission',
            time: `Il y a ${Math.round((new Date() - new Date(dossier.date_creation)) / (1000 * 60 * 60))}h`,
            severity: dossier.suite_procedure.includes('hospitalisation') ? 'urgent' : dossier.suite_procedure.includes('domicile') ? 'stable' : 'deces',
            dossierNumber: dossier.numero_dossier,
            service: 'Traumatologie',
            motif: dossier.motif_consultation || 'Non spécifié',
            dateAdmission: dossier.date_admission
        })),
        personnelRequests: demandesPersonnels.recentDemandes.map(demande => ({
            id: demande.id,
            firstName: demande.first_name,
            lastName: demande.last_name,
            userType: demande.user_type,
            status: demande.status || 'new',
            dateRegistered: demande.date_joined,
            fonction: demande.fonction || 'Non spécifié'
        })),
        stockAlerts: articleData
            .map(article => {
                let type = "normal";
                let alerteMessage = null;
                if (article.quantite_stock <= article.seuil_critique) {
                    type = "critique";
                    alerteMessage = "Stock critique";
                } else if (article.quantite_stock <= article.seuil_alerte) {
                    type = "bas";
                    alerteMessage = "Stock bas";
                }
                let expirationSoon = false;
                let expirationDepassee = false;
                if (article.date_expiration) {
                    const expDate = new Date(article.date_expiration);
                    const daysToExpiration = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

                    if (daysToExpiration < 0) {
                        expirationDepassee = true;
                        alerteMessage = "Date d'expiration dépassée";
                    } else if (daysToExpiration <= 30) {
                        expirationSoon = true;
                        alerteMessage = "Date d'expiration proche";
                    }
                }

                return {
                    name: article.nom,
                    quantiteStock: article.quantite_stock,
                    seuilCritique: article.seuil_critique,
                    seuilAlerte: article.seuil_alerte,
                    type,
                    alerteMessage,
                    expirationSoon,
                    expirationDepassee,
                    dateExpiration: article.date_expiration,
                    typeArticle: article.type_article.nom
                };
            })
            .filter(a => a.type !== "normal" || a.expirationSoon || a.expirationDepassee)
            .sort((a, b) => {
                const priority = { critique: 1, bas: 2, expirationDepassee: 3, expirationProche: 4, normal: 5 };

                const getPriority = (item) => {
                    if (item.type === "critique") return priority.critique;
                    if (item.type === "bas") return priority.bas;
                    if (item.expirationDepassee) return priority.expirationDepassee;
                    if (item.expirationSoon) return priority.expirationProche;
                    return priority.normal;
                };

                return getPriority(a) - getPriority(b);
            }),
        services: hospitalServices.map(s => ({
            name: s.name.charAt(0).toUpperCase() + s.name.slice(1),
            patients: patientData.filter(p => p.hospital_nom === user?.hospital?.name).length,
            personnel: personnels.filteredPersonnels.filter(p => p.service?.name === s.name).length,
            status: (s.beds.filter(b => b.is_occupied).length / (s.nombre_chambre * s.nombre_lits_par_chambre)) > 0.8 ? 'busy' : 'active',
            litsOccupes: s.beds.filter(b => b.is_occupied).length,
            litsTotal: s.nombre_chambre * s.nombre_lits_par_chambre
        })),
        schedule: evenementData.filter(event => {
            const eventTime = new Date(event.time);
            const now = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(now.getDate() + 1);
            return eventTime >= now && eventTime < tomorrow;
        })
    };


    const TypeChoix = {
        'reunions': 'Réunions',
        'conferences': 'Conférences',
        'ateliers': 'Ateliers',
        'inspections': 'Inspections',
        'formations': 'Formations'
    };
    const ServiceChoix = {
        'traumatologie': 'Traumatologie',
        'logistique': 'Logistique',
        'cardiologie': 'Cardiologie',
        'pediatrie': 'Pédiatrie'
    };

    /** Fonction pour la création d'événements */
    const handleCreateEvenement = async () => {
        try {
            await apiToPost("/evenement/", eventData);
            // Rafraîchir les données des événements après création
            const evenementResponse = await apiTogetAll('evenement/');
            setEvenementData(evenementResponse.results);
            // Réinitialiser le formulaire
            setEventData({
                time: null,
                event: '',
                type: '',
                service: '',
            });
        } catch (error) {
            console.error("Erreur lors de la création de l'événement :", error);
            setError('Erreur lors de la création de l\'événement');
        }
        setOpenDialog(false);
    };

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 2000);
    };

    const getDossierOwner = (dossier) => {
        const patient = patientData.find(patient => patient.id === dossier.patient_id);
        return patient || { first_name: 'Inconnu', last_name: 'Inconnu', age: 0, genre: 'Inconnu' };
    };

    const getSeverityConfig = (severity) => {
        switch (severity) {
            case 'urgent':
                return {
                    color: theme.palette.warning.main,
                    bgColor: alpha(theme.palette.warning.main, 0.1),
                    label: 'Urgent'
                };
            case 'stable':
                return {
                    color: theme.palette.success.main,
                    bgColor: alpha(theme.palette.success.main, 0.1),
                    label: 'Stable'
                };
            default:
                return {
                    color: theme.palette.grey[500],
                    bgColor: alpha(theme.palette.grey[500], 0.1),
                    label: <DoNotDisturb />
                };
        }
    };

    const getAlertSeverity = (type) => {
        switch (type) {
            case 'critique': return 'error';
            case 'bas': return 'warning';
            case 'info': return 'info';
            default: return 'info';
        }
    };

    const occupancyPercentage = totalBeds ? (occupiedBedsCount / totalBeds) * 100 : 0;

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    const StatCard = ({ title, value, subValue, icon: Icon, color, trend, onClick, description }) => (
        <Card
            elevation={4}
            onClick={onClick}
            sx={{
                height: '100%',
                background: 'white',
                border: `2px solid ${alpha(color, 0.1)}`,
                borderRadius: 4,
                cursor: 'pointer',
                '&:hover': {
                    borderColor: alpha(color, 0.3),
                    boxShadow: `0 8px 24px ${alpha(color, 0.2)}`
                },
                position: 'relative',
                overflow: 'visible',
                transition: 'all 0.3s ease'
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
                    <Avatar
                        sx={{
                            bgcolor: color,
                            width: 64,
                            height: 64,
                            boxShadow: `0 8px 24px ${alpha(color, 0.3)}`
                        }}
                    >
                        <Icon sx={{ fontSize: 28 }} />
                    </Avatar>
                    {trend && (
                        <Chip
                            size="small"
                            label={`+${trend}%`}
                            color="success"
                            variant="outlined"
                            icon={<TrendingUpIcon />}
                            sx={{
                                position: 'absolute',
                                top: -8,
                                right: 16,
                                bgcolor: 'background.paper',
                                boxShadow: 2
                            }}
                        />
                    )}
                </Box>

                <Typography
                    variant="h3"
                    fontWeight="800"
                    color={color}
                    gutterBottom
                    sx={{
                        background: `linear-gradient(45deg, ${color} 30%, ${alpha(color, 0.7)} 90%)`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    {value}
                </Typography>

                <Typography variant="h6" color="text.primary" fontWeight="600" gutterBottom>
                    {title}
                </Typography>

                {subValue && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {subValue}
                    </Typography>
                )}

                {description && (
                    <Typography variant="caption" color="text.secondary">
                        {description}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{
            minHeight: '100vh',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
            pb: 4
        }}>

            {/* Header moderne */}
            <AppBar
                position="static"
                elevation={0}
                sx={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    color: 'text.primary',
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                }}
            >
                <Toolbar sx={{ py: 2 }}>
                    <Box display="flex" alignItems="center" gap={2} flexGrow={1}>
                        <Avatar sx={{
                            bgcolor: theme.palette.primary.main,
                            width: 48,
                            height: 48,
                            boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`
                        }}>
                            <HospitalIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" fontWeight="800" color="primary.main">
                                {hospitalData.hospitalInfo.name}
                            </Typography>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
                                    <LocationOnIcon fontSize="small" />
                                    {hospitalData.hospitalInfo.address}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
                                    <PhoneIcon fontSize="small" />
                                    {hospitalData.hospitalInfo.phone}
                                </Typography>
                            </Stack>
                        </Box>
                    </Box>

                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="body1" color="text.secondary" display="flex" alignItems="center" gap={1}>
                            <AccessTimeIcon fontSize="small" />
                            {currentTime.toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long'
                            })} - {currentTime.toLocaleTimeString('fr-FR')}
                        </Typography>

                        <IconButton
                            onClick={handleRefresh}
                            disabled={refreshing}
                            sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                            }}
                        >
                            {refreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
                        </IconButton>

                        <Badge badgeContent={hospitalData.stats.pendingRequests} color="error">
                            <IconButton sx={{
                                bgcolor: alpha(theme.palette.error.main, 0.1),
                                '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) }
                            }}>
                                <NotificationsIcon />
                            </IconButton>
                        </Badge>
                    </Stack>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ mt: 4 }}>

                {/* Alertes critiques */}
                {hospitalData.stockAlerts.length > 0 && (
                    <Box mb={4}>
                        {hospitalData.stockAlerts.map((alert, index) => (
                            <Alert
                                key={index}
                                severity={getAlertSeverity(alert.type, alert.expirationSoon, alert.expirationDepassee)}
                                sx={{
                                    mb: 2,
                                    borderRadius: 3,
                                    '& .MuiAlert-icon': { fontSize: 28 }
                                }}
                                action={
                                    <NavLink to={`service/logistique/article`}>
                                        <Button color="inherit" size="small" endIcon={<VisibilityIcon />}>
                                            Voir Stock
                                        </Button>
                                    </NavLink>
                                }
                            >
                                <Typography variant="body1" fontWeight="600">
                                    {alert.alerteMessage}: {alert.name}
                                    {alert.quantiteStock !== undefined && ` (${alert.quantiteStock} unités restantes)`}
                                    {alert.dateExpiration && ` — Exp: ${new Date(alert.dateExpiration).toLocaleDateString('fr-FR')}`}
                                </Typography>
                            </Alert>
                        ))}
                    </Box>
                )}

                {/* Statistiques principales */}
                <Grid container spacing={4} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            title="Patients Actuels"
                            value={hospitalData.stats.totalPatients}
                            subValue={`+${hospitalData.stats.newPatientsToday} nouveaux aujourd'hui`}
                            icon={MonitorHeartIcon}
                            color={theme.palette.primary.main}
                            trend={hospitalData.stats.trend}
                            description="Total des patients pris en charge"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            title="Personnel Actif"
                            value={hospitalData.stats.activePersonnel}
                            subValue={`${hospitalData.stats.pendingRequests} demandes en attente`}
                            icon={PeopleIcon}
                            color={theme.palette.success.main}
                            description="Équipe médicale et administrative"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            title="Occupation Lits"
                            value={`${hospitalData.stats.occupiedBeds}/${hospitalData.stats.totalBeds}`}
                            subValue={`${Math.round(occupancyPercentage)}% d'occupation`}
                            icon={BedIcon}
                            color={theme.palette.warning.main}
                            description="Gestion des capacités d'hébergement"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            title="Dossiers Ouverts"
                            value={hospitalData.stats.dossiersOuverts}
                            subValue={`${hospitalData.stats.newDossiersToday} traités aujourd'hui`}
                            icon={AssignmentIcon}
                            color={theme.palette.info.main}
                            trend={hospitalData.stats.trendDossier}
                            description="Dossiers médicaux en cours"
                        />
                    </Grid>
                </Grid>

                {/* Section principale avec graphiques */}
                <Grid container spacing={4} sx={{ mb: 4 }}>

                    {/* Occupation des lits détaillée */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card elevation={4} sx={{ borderRadius: 4, height: '100%' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 40, height: 40 }}>
                                            <BedIcon />
                                        </Avatar>
                                        <Typography variant="h5" fontWeight="700">
                                            Occupation par Service
                                        </Typography>
                                    </Box>
                                    <IconButton size="small">
                                        <AnalyticsIcon />
                                    </IconButton>
                                </Box>

                                <Stack spacing={3}>
                                    {hospitalData.services.map((service, index) => {
                                        const occupationRate = (service.litsOccupes / service.litsTotal) * 100 || 0;
                                        return (
                                            <Box key={index} sx={{ borderRadius: 2, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), border: `1px solid ${alpha(theme.palette.divider, 0.5)}` }}>
                                                <Box display="flex" alignItems="center" gap={2} mb={2}>
                                                    <Avatar sx={{ bgcolor: 'info.main' }}>
                                                        <MedicalServicesIcon />
                                                    </Avatar>
                                                    <Typography variant="h6" fontWeight="600">{service.name}</Typography>
                                                </Box>
                                                <Typography variant="body2" color="text.secondary" mb={1}>
                                                    Occupation: {service.litsOccupes} / {service.litsTotal} lits ({Math.round(occupationRate)}%)
                                                </Typography>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={occupationRate}
                                                    sx={{
                                                        height: 8,
                                                        borderRadius: 4,
                                                        bgcolor: 'grey.200',
                                                        '& .MuiLinearProgress-bar': {
                                                            bgcolor: occupationRate > 80 ? 'error.main' : occupationRate > 50 ? 'warning.main' : 'success.main'
                                                        }
                                                    }}
                                                />
                                                <Box display="flex" justifyContent="space-between" mt={2}>
                                                    <Typography variant="caption">Patients: {service.patients}</Typography>
                                                    <Typography variant="caption">Personnel: {service.personnel}</Typography>
                                                    <Chip
                                                        size="small"
                                                        label={service.status === 'busy' ? 'Occupé' : 'Actif'}
                                                        color={service.status === 'busy' ? 'error' : 'success'}
                                                    />
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                    {hospitalData.services.length === 0 && (
                                        <Typography variant="body2" color="text.secondary" textAlign="center">
                                            Aucun service disponible
                                        </Typography>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Section Dossiers Récents */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card elevation={4} sx={{ borderRadius: 4 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Avatar sx={{ bgcolor: theme.palette.info.main, width: 40, height: 40 }}>
                                            <AssignmentIcon />
                                        </Avatar>
                                        <Typography variant="h5" fontWeight="700">
                                            Dossiers Récents
                                        </Typography>
                                    </Box>
                                    <NavLink to={'service/traumatologie/dossier'}>
                                        <Button variant="outlined" size="small" endIcon={<VisibilityIcon />}>
                                            Voir tous
                                        </Button>
                                    </NavLink>
                                </Box>

                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                                                <TableCell>Patient</TableCell>
                                                <TableCell>Dossier</TableCell>
                                                <TableCell>Service</TableCell>
                                                <TableCell>Statut</TableCell>
                                                <TableCell>Priorité</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {hospitalData.recentDossiers.length > 0 ? (
                                                hospitalData.recentDossiers.map((dossier) => {
                                                    const severity = getSeverityConfig(dossier.severity);
                                                    const dossierOwner = getDossierOwner(dossier);
                                                    return (
                                                        <TableRow
                                                            key={dossier.id}
                                                            hover
                                                            sx={{
                                                                '&:hover': {
                                                                    bgcolor: alpha(theme.palette.primary.main, 0.04)
                                                                }
                                                            }}
                                                        >
                                                            <TableCell>
                                                                <Box display="flex" alignItems="center" gap={2}>
                                                                    <Avatar
                                                                        sx={{
                                                                            bgcolor: severity.color,
                                                                            width: 40,
                                                                            height: 40,
                                                                            fontSize: '1rem',
                                                                            fontWeight: 'bold'
                                                                        }}
                                                                    >
                                                                        {dossierOwner.first_name && dossierOwner.last_name
                                                                            ? `${dossierOwner.first_name[0] || ''}${dossierOwner.last_name[0] || ''}`
                                                                            : 'N/A'}
                                                                    </Avatar>
                                                                    <Box>
                                                                        <Typography variant="body1" fontWeight="600">
                                                                            {dossierOwner.first_name} {dossierOwner.last_name}
                                                                        </Typography>
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            {dossier.age} ans • {dossier.genre} • {new Date(dossier.dateAdmission).toLocaleDateString('fr-FR')}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </TableCell>

                                                            <TableCell>
                                                                <Box>
                                                                    <Typography variant="body2" fontWeight="600">
                                                                        {dossier.dossierNumber}
                                                                    </Typography>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {new Date(dossier.dateAdmission).toLocaleDateString('fr-FR')}
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box>
                                                                    <Typography variant="body2" fontWeight="600">
                                                                        {dossier.service}
                                                                    </Typography>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {dossier.motif}
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell>

                                                            <TableCell>
                                                                <Chip
                                                                    label={dossier.status}
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: dossier.status === 'En traitement'
                                                                            ? alpha(theme.palette.warning.main, 0.1)
                                                                            : dossier.status === 'Sortie'
                                                                                ? alpha(theme.palette.success.main, 0.1)
                                                                                : alpha(theme.palette.grey[500]),
                                                                        color: dossier.status === 'En traitement'
                                                                            ? theme.palette.warning.main
                                                                            : dossier.status === 'Sortie'
                                                                                ? theme.palette.success.main
                                                                                : theme.palette.grey[500],
                                                                        fontWeight: 'bold'
                                                                    }}
                                                                />
                                                            </TableCell>

                                                            <TableCell>
                                                                <Chip
                                                                    label={severity.label}
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: severity.bgColor,
                                                                        color: severity.color,
                                                                        fontWeight: 'bold'
                                                                    }}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={6} align="center">
                                                        <Typography variant="body2" color="text.secondary">
                                                            Aucun dossier récent disponible
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Section latérale droite - Agenda et Demandes Personnel */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={4}>
                            {/* Planning du jour */}
                            <Card elevation={4} sx={{ borderRadius: 4 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                                        <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 40, height: 40 }}>
                                            <CalendarTodayIcon />
                                        </Avatar>
                                        <Typography variant="h5" fontWeight="700">
                                            Planning du Jour
                                        </Typography>
                                    </Box>

                                    <Stack spacing={2}>
                                        {hospitalData.schedule.length > 0 ? (
                                            hospitalData.schedule.map((event, index) => (
                                                <Box key={index} sx={{
                                                    p: 2,
                                                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                                                    borderRadius: 2,
                                                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`
                                                    }
                                                }}>
                                                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                                                        <Avatar sx={{
                                                            bgcolor: theme.palette.primary.main,
                                                            width: 24,
                                                            height: 24,
                                                            fontSize: '0.75rem'
                                                        }}>
                                                            <ScheduleIcon sx={{ fontSize: 14 }} />
                                                        </Avatar>
                                                        <Typography variant="body2" fontWeight="600">
                                                            {/* Afficher jour, date, année et heure de l'événement e.g. 2025-08-21T09:24:00Z */}
                                                            {new Date(event.time).toLocaleString('fr-FR', { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                        </Typography>
                                                        <Chip
                                                            size="small"
                                                            label={TypeChoix[event.type] || event.type}
                                                            sx={{ fontSize: '0.7rem' }}
                                                            color={
                                                                event.type === 'reunions' ? 'primary' :
                                                                    event.type === 'formations' ? 'success' :
                                                                        event.type === 'inspections' ? 'warning' : 'default'
                                                            }
                                                        />
                                                    </Box>
                                                    <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
                                                        {event.event}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Service: {ServiceChoix[event.service] || event.service}
                                                    </Typography>
                                                </Box>
                                            ))) : (
                                            <Alert severity="info" sx={{ borderRadius: 2 }}>
                                                Aucun événement prévu pour aujourd'hui
                                            </Alert>
                                        )}
                                    </Stack>

                                    {user.user_type === "simple_user" ? null : (
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            sx={{ mt: 3, borderRadius: 2 }}
                                            startIcon={<AddIcon />}
                                            onClick={() => setOpenDialog(true)}
                                        >
                                            Ajouter un Événement
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>
                    {user.user_type === "simple_user" ? null : (
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Stack spacing={4}>

                                {/* Demandes de Personnel en Attente */}
                                <Card elevation={4} sx={{ borderRadius: 4 }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box display="flex" alignItems="center" gap={2} mb={3}>
                                            <Badge badgeContent={hospitalData.personnelRequests.length} color="error">
                                                <Avatar sx={{ bgcolor: theme.palette.warning.main, width: 40, height: 40 }}>
                                                    <GroupIcon />
                                                </Avatar>
                                            </Badge>
                                            <Typography variant="h5" fontWeight="700">
                                                Demandes Personnel
                                            </Typography>
                                        </Box>
                                        <Stack spacing={2}>
                                            {hospitalData.personnelRequests.length > 0 ? (
                                                hospitalData.personnelRequests.map((request, index) => (
                                                    <Paper
                                                        key={index}
                                                        elevation={2}
                                                        sx={{
                                                            p: 2,
                                                            borderRadius: 3,
                                                            transition: 'all 0.2s',
                                                            '&:hover': {
                                                                boxShadow: 4,
                                                                transform: 'translateY(-2px)'
                                                            }
                                                        }}
                                                    >
                                                        <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
                                                            <Box display="flex" alignItems="center" gap={2}>
                                                                <Avatar sx={{
                                                                    bgcolor: request.userType === 'admin'
                                                                        ? theme.palette.error.main
                                                                        : theme.palette.info.main,
                                                                    width: 40,
                                                                    height: 40
                                                                }}>
                                                                    {request.firstName[0]}{request.lastName[0]}
                                                                </Avatar>
                                                                <Box>
                                                                    <Typography variant="body1" fontWeight="600">
                                                                        {request.firstName} {request.lastName}
                                                                    </Typography>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {request.fonction} • {request.serviceDepartement}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                            <Chip
                                                                label="Nouveau"
                                                                size="small"
                                                                color="warning"
                                                                sx={{ fontWeight: 'bold' }}
                                                            />
                                                        </Box>

                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                            Inscrit le: {new Date(request.dateRegistered).toLocaleDateString('fr-FR', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </Typography>
                                                    </Paper>
                                                ))) : (
                                                <Alert severity="info" sx={{ borderRadius: 2 }}>
                                                    Aucun demande en attente
                                                </Alert>
                                            )}
                                        </Stack>
                                        <NavLink to={'utilisateur/demande'}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                sx={{ mt: 3, borderRadius: 2 }}
                                                startIcon={<PersonAddRounded />}
                                                color="warning"
                                            >
                                                Gérer les demandes
                                            </Button>
                                        </NavLink>
                                    </CardContent>
                                </Card>
                            </Stack>
                        </Grid>
                    )}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={4}>

                            {/* Alertes Stock */}
                            <Card elevation={4} sx={{ borderRadius: 4 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                                        <Avatar sx={{ bgcolor: theme.palette.warning.main, width: 40, height: 40 }}>
                                            <WarningIcon />
                                        </Avatar>
                                        <Typography variant="h5" fontWeight="700">
                                            Alertes Stock
                                        </Typography>
                                    </Box>

                                    {hospitalData.stockAlerts.length > 0 ? (
                                        <Stack spacing={2}>
                                            {hospitalData.stockAlerts.map((alert, index) => (
                                                <Alert
                                                    key={index}
                                                    severity={getAlertSeverity(alert.type, alert.expirationSoon, alert.expirationDepassee)}
                                                    sx={{
                                                        borderRadius: 2,
                                                        '& .MuiAlert-message': { fontWeight: 500 }
                                                    }}
                                                >
                                                    <Typography variant="body2" fontWeight="600">
                                                        {alert.alerteMessage}: {alert.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {alert.quantiteStock !== undefined && `Stock: ${alert.quantiteStock}`}
                                                        {alert.seuilCritique && ` • Seuil critique: ${alert.seuilCritique}`}
                                                        {alert.seuilAlerte && ` • Seuil alerte: ${alert.seuilAlerte}`}
                                                        {alert.dateExpiration && ` • Exp: ${new Date(alert.dateExpiration).toLocaleDateString('fr-FR')}`}
                                                    </Typography>
                                                </Alert>
                                            ))}
                                        </Stack>
                                    ) : (
                                        <Alert severity="success" sx={{ borderRadius: 2 }}>
                                            Aucun problème de stock détecté
                                        </Alert>
                                    )}

                                    <NavLink to={'service/logistique/article'}>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            sx={{ mt: 3, borderRadius: 2 }}
                                            startIcon={<InventoryIcon />}
                                            color="warning"
                                        >
                                            Gérer le Stock
                                        </Button>
                                    </NavLink>
                                </CardContent>
                            </Card>

                        </Stack>
                    </Grid>
                </Grid>
            </Container>
            {/** Dialog pour la création d'événements */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Typography variant="h4" fontWeight="700">
                        Créer un Événement
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {/** Contenu du formulaire de création de l'événement */}
                    <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                            <DateTimePicker
                                label="Choisir une date et heure"
                                value={eventData.time}
                                onChange={(newValue) =>
                                    setEventData((prev) => ({ ...prev, time: newValue }))
                                }
                                slotProps={{
                                    textField: {
                                        size: "small",
                                        fullWidth: true,
                                        InputProps: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CalendarMonth fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        },
                                    },
                                }}
                            />
                        </LocalizationProvider>

                        <TextField
                            fullWidth
                            label="Titre de l'Événement"
                            variant="outlined"
                            value={eventData.event}
                            onChange={(e) => setEventData(prev => ({ ...prev, event: e.target.value }))}
                            sx={{ mt: 2, mb: 2 }}
                        />
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Type d'Événement</InputLabel>
                            <Select
                                value={eventData.type}
                                label="Type d'Événement"
                                onChange={(e) => setEventData(prev => ({ ...prev, type: e.target.value }))}
                            >
                                {Object.entries(TypeChoix).map(([key, value]) => (
                                    <MenuItem key={key} value={key}>{value}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Service</InputLabel>
                            <Select
                                value={eventData.service}
                                label="Service"
                                onChange={(e) => setEventData(prev => ({ ...prev, service: e.target.value }))}
                            >
                                {Object.entries(ServiceChoix).map(([key, value]) => (
                                    <MenuItem key={key} value={key}>{value}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={handleCreateEvenement} variant="contained" color="primary">
                        Créer
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};