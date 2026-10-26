import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Divider,
    Paper,
    Chip,
    Stack,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';

export const CommandeDetail = ({ mouvement, typeBeneficiaireColors, typeMouvementColors, onClose }) => {
    return (
        <>
            <DialogContent>
                <Box sx={{ pt: 2 }}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="h6" gutterBottom>Informations générales</Typography>
                            <Stack spacing={2}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Numéro de mouvement</Typography>
                                    <Typography variant="body1" fontWeight="bold">{mouvement?.numero_mouvement}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Bénéficiaire</Typography>
                                    <Typography variant="body1">{mouvement?.beneficiaire}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Contact</Typography>
                                    <Typography variant="body1">{mouvement?.contact}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Chip
                                        label={mouvement?.type_beneficiaire}
                                        color={typeBeneficiaireColors[mouvement?.type_beneficiaire]}
                                        variant="outlined"
                                    />
                                    <Chip
                                        label={mouvement?.type_mouvement?.replace('_', ' ')}
                                        color={typeMouvementColors[mouvement?.type_mouvement]}
                                        variant="filled"
                                    />
                                </Box>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="h6" gutterBottom>Détails du mouvement</Typography>
                            <Stack spacing={2}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Date et heure</Typography>
                                    <Typography variant="body1">
                                        {new Date(mouvement?.date_mouvement).toLocaleDateString('fr-FR', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Responsable</Typography>
                                    <Typography variant="body1">
                                        {mouvement?.utilisateur.first_name} {mouvement?.utilisateur.last_name}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Montant total</Typography>
                                    <Typography variant="h5" color="primary" fontWeight="bold">
                                        {mouvement?.montant_total.toLocaleString('fr-FR', { style: 'currency', currency: 'AMG' })}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" gutterBottom>Articles distribués</Typography>
                    {mouvement?.articles?.map((item, index) => (
                        <Card key={index} sx={{ mb: 2 }}>
                            <CardContent>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <Typography variant="body1" fontWeight="bold">
                                            {item.article.nom}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Unité: {item.article.unite}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 4, md: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Quantité
                                        </Typography>
                                        <Typography variant="h6" color="primary">
                                            {item.quantite}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 4, md: 3 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Prix unitaire
                                        </Typography>
                                        <Typography variant="body1">
                                            {item.prix_unitaire.toLocaleString('fr-FR', { style: 'currency', currency: 'AMG' })}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 4, md: 3 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Sous-total
                                        </Typography>
                                        <Typography variant="h6" fontWeight="bold">
                                            {(item.quantite * item.prix_unitaire).toLocaleString('fr-FR', { style: 'currency', currency: 'AMG' })}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    ))}

                    {mouvement?.commentaire && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6" gutterBottom>Commentaire</Typography>
                            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                                <Typography variant="body1">
                                    {mouvement?.commentaire}
                                </Typography>
                            </Paper>
                        </Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} size="large">
                    Fermer
                </Button>
            </DialogActions>
        </>
    );
};