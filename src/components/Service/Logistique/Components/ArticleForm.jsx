import { useState, useEffect, useContext } from 'react';
import {
    TextField, Button, Grid, Card, CardContent, CardHeader, CardActions,
    FormControl, InputLabel, Select, MenuItem, Box, Divider, Chip, InputAdornment,
    Alert
} from '@mui/material';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import fr from 'date-fns/locale/fr';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import NumbersIcon from '@mui/icons-material/Numbers';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import BarcodeIcon from '@mui/icons-material/QrCode2';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import BusinessIcon from '@mui/icons-material/Business';
import { apiToPatch, apiToPost } from '../../../../utils/ApiServices';
import { UserContext } from '../../../../utils/UserContext';

export const ArticleForm = ({ editing, selectedItem, typesArticle, fournisseurs, handleDiffSlide }) => {
    const { user } = useContext(UserContext);
    const [formData, setFormData] = useState({
        nom: '',
        hospital: user.hospital.id,
        type_article_id: '',
        description: '',
        quantite_stock: 0,
        unite: 'unité',
        seuil_alerte: 10,
        seuil_critique: 5,
        code_barre: '',
        numero_lot: '',
        date_expiration: null,
        prix_unitaire: '0.00',
        fournisseur_principal_id: '',
        emplacement: '',
    });

    const [expirationWarning, setExpirationWarning] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (newDate) => {
        const selectedDate = newDate ? newDate.toISOString().split("T")[0] : null;
        setFormData(prev => ({ ...prev, date_expiration: selectedDate }));

        if (selectedDate) {
            const currentDate = new Date();
            const expDate = new Date(selectedDate);
            const daysToExpiration = Math.ceil((expDate - currentDate) / (1000 * 60 * 60 * 24));
            setExpirationWarning(daysToExpiration < 30 && daysToExpiration >= 0);
        } else {
            setExpirationWarning(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing && selectedItem) {
                await apiToPatch(`logistique/articles/`, selectedItem.id, formData);

            }
            else {
                await apiToPost('logistique/articles/', formData);

                setFormData({
                    nom: '',
                    type_article_id: '',
                    description: '',
                    quantite_stock: 0,
                    unite: 'unité',
                    seuil_alerte: 10,
                    seuil_critique: 5,
                    code_barre: '',
                    numero_lot: '',
                    date_expiration: null,
                    prix_unitaire: '0.00',
                    fournisseur_principal_id: '',
                    emplacement: '',
                });
            }
        } catch (err) {
            console.log(`Erreur inattendue : ${err.message || err}`);
        }
    };

    useEffect(() => {
        if (editing && selectedItem) {
            setFormData({
                nom: selectedItem?.nom || '',
                type_article_id: selectedItem?.type_article.id || '',
                description: selectedItem?.description || '',
                quantite_stock: selectedItem?.quantite_stock || '',
                unite: selectedItem?.unite || '',
                seuil_alerte: selectedItem?.seuil_alerte || '',
                seuil_critique: selectedItem?.seuil_critique || '',
                code_barre: selectedItem?.code_barre || '',
                numero_lot: selectedItem?.numero_lot || '',
                date_expiration: selectedItem?.date_expiration || '',
                prix_unitaire: selectedItem?.prix_unitaire || '',
                fournisseur_principal_id: selectedItem?.fournisseur_principal.id || '',
                emplacement: selectedItem?.emplacement || '',
            });

            if (selectedItem?.date_expiration) {
                const currentDate = new Date();
                const expDate = new Date(selectedItem.date_expiration);
                const daysToExpiration = Math.ceil((expDate - currentDate) / (1000 * 60 * 60 * 24));
                setExpirationWarning(daysToExpiration < 30 && daysToExpiration >= 0);
            }
        }
    }, [editing, selectedItem]);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <Card sx={{ maxWidth: 800, width: '100%', borderRadius: 3, boxShadow: '0 4px 20px RGBA(0,0,0,0.08)' }}>
                    <CardHeader
                        title="Gestion d'Article"
                        subheader={editing ? 'Modifier un article' : 'Remplissez les informations pour ajouter un article'}
                        avatar={<InventoryIcon color="primary" />}
                        sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}
                    />
                    <form onSubmit={handleSubmit}>
                        <CardContent sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12 }}>
                                    <Divider><Chip label="Informations Générales" icon={<DescriptionIcon />} color="primary" variant="outlined" /></Divider>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        name="nom"
                                        label="Nom de l'article"
                                        value={formData.nom}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><InventoryIcon color="action" /></InputAdornment>
                                        }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <FormControl fullWidth required variant="outlined">
                                        <InputLabel id="type-article-label">Type d'article</InputLabel>
                                        <Select
                                            labelId="type-article-label"
                                            name="type_article_id"
                                            value={formData.type_article_id}
                                            onChange={handleChange}
                                            label="Type d'article"
                                            startAdornment={<InputAdornment position="start"><CategoryIcon color="action" /></InputAdornment>}
                                        >
                                            {typesArticle.map((type) => (
                                                <MenuItem key={type.id} value={type.id}>{type.nom}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        name="description"
                                        label="Description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        multiline
                                        rows={3}
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><DescriptionIcon color="action" /></InputAdornment>
                                        }}
                                    />
                                </Grid>

                                {/* --- Section Gestion du Stock --- */}
                                <Grid size={{ xs: 12 }}>
                                    <Divider sx={{ my: 2 }}><Chip label="Gestion du Stock" icon={<ProductionQuantityLimitsIcon />} color="primary" variant="outlined" /></Divider>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <TextField
                                        name="quantite_stock"
                                        label="Quantité en stock"
                                        type="number"
                                        value={formData.quantite_stock}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{ inputProps: { min: 0 } }}
                                        startAdornment={<InputAdornment position="start"><NumbersIcon color="action" /></InputAdornment>}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <TextField
                                        name="unite"
                                        label="Unité"
                                        value={formData.unite}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <TextField
                                        name="seuil_alerte"
                                        label="Seuil d'alerte"
                                        type="number"
                                        value={formData.seuil_alerte}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{ inputProps: { min: 0 } }}
                                        helperText="Déclenche une alerte"
                                        startAdornment={<InputAdornment position="start"><WarningAmberIcon color="warning" /></InputAdornment>}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <TextField
                                        name="seuil_critique"
                                        label="Seuil critique"
                                        type="number"
                                        value={formData.seuil_critique}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            inputProps: { min: 0 },
                                            startAdornment: <InputAdornment position="start"><WarningAmberIcon color="error" /></InputAdornment>
                                        }}
                                        helperText="Action immédiate requise"
                                    />
                                </Grid>

                                {/* --- Section Identification & Traçabilité --- */}
                                <Grid size={{ xs: 12 }}>
                                    <Divider sx={{ my: 2 }}><Chip label="Identification & Traçabilité" icon={<BarcodeIcon />} color="primary" variant="outlined" /></Divider>
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        name="numero_lot"
                                        label="Numéro de lot"
                                        value={formData.numero_lot}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><NumbersIcon color="action" /></InputAdornment>
                                        }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        name="code_barre"
                                        label="Code-barre"
                                        value={formData.code_barre}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><BarcodeIcon color="action" /></InputAdornment>
                                        }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <DatePicker
                                        label="Date d'expiration"
                                        value={formData.date_expiration ? new Date(formData.date_expiration) : null}
                                        onChange={handleDateChange}
                                        renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
                                    />
                                    {expirationWarning && (
                                        <Alert severity="warning" sx={{ mt: 1 }}>
                                            La date d'expiration est dans moins de 30 jours !
                                        </Alert>
                                    )}
                                </Grid>

                                {/* --- Section Achat & Localisation --- */}
                                <Grid size={{ xs: 12 }}>
                                    <Divider sx={{ my: 2 }}><Chip label="Achat & Localisation" icon={<EuroSymbolIcon />} color="primary" variant="outlined" /></Divider>
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        name="prix_unitaire"
                                        label="Prix unitaire"
                                        type="number"
                                        value={formData.prix_unitaire}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            inputProps: { min: 0, step: "0.01" },
                                            endAdornment: <InputAdornment position="end">Ar</InputAdornment>,
                                            startAdornment: <InputAdornment position="start"><EuroSymbolIcon color="action" /></InputAdornment>
                                        }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel id="fournisseur-label">Fournisseur principal</InputLabel>
                                        <Select
                                            labelId="fournisseur-label"
                                            name="fournisseur_principal_id"
                                            value={formData.fournisseur_principal_id}
                                            onChange={handleChange}
                                            label="Fournisseur principal"
                                            startAdornment={<InputAdornment position="start"><BusinessIcon color="action" /></InputAdornment>}
                                        >
                                            <MenuItem value=""><em>Aucun</em></MenuItem>
                                            {fournisseurs.map((f) => (
                                                <MenuItem key={f.id} value={f.id}>{f.nom}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        name="emplacement"
                                        label="Emplacement de stockage"
                                        value={formData.emplacement}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                        helperText="Ex: Rayon A, Étagère 3"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><LocationOnIcon color="action" /></InputAdornment>
                                        }}
                                    />
                                </Grid>

                            </Grid>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                            <Button variant="outlined" color="primary" onClick={() => handleDiffSlide('')} >Annuler</Button>
                            <Button type="submit" variant="contained" color="primary">
                                {editing ? 'Mettre à jour l\'Article' : 'Créer un Article'}
                            </Button>
                        </CardActions>
                    </form>
                </Card>
            </Box>
        </LocalizationProvider>
    );
}