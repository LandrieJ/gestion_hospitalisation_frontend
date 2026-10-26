import { 
    alpha, 
    Box, 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    Typography, 
    useTheme,
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    useMediaQuery
} from '@mui/material'
import React, { useEffect, useRef } from 'react'
import {
    Print as PrintIcon,
    Close as CloseIcon,
    Assignment as AssignmentIcon
} from '@mui/icons-material'
import { apiTogetById } from '../../../../../utils/ApiServices';

export const DetailDialog = ({ open, onClose, selectedDossier }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const printRef = useRef();
    const [patientDetails, setPatientDetails] = React.useState(null);
    
    useEffect(() => {
        const fetchPatientById = async (id) => {
            try {
                const response = await apiTogetById(`traumatologie/traumatologie-dossiers/`, id);
                setPatientDetails(response);
            } catch (error) {
                console.error('Erreur lors de la récupération du patient:', error);
            }
        };
        if (selectedDossier?.id) {
            fetchPatientById(selectedDossier.id);
        }
    }, [selectedDossier?.id]);

    const handlePrint = () => {
        const printContent = printRef.current;
        const originalContent = document.body.innerHTML;
        
        // Styles pour l'impression
        const printStyles = `
            <style>
                @media print {
                    @page {
                        margin: 1.5cm;
                        size: A4;
                    }
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 12px;
                        line-height: 1.4;
                        color: #000;
                        background: white;
                    }
                    .print-header {
                        text-align: center;
                        border-bottom: 2px solid #000;
                        padding-bottom: 10px;
                        margin-bottom: 20px;
                    }
                    .print-section {
                        margin-bottom: 15px;
                        page-break-inside: avoid;
                    }
                    .print-section-title {
                        font-weight: bold;
                        font-size: 14px;
                        background-color: #f0f0f0;
                        padding: 5px;
                        border: 1px solid #000;
                        margin-bottom: 5px;
                    }
                    .print-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 10px;
                    }
                    .print-table td {
                        border: 1px solid #000;
                        padding: 4px;
                        vertical-align: top;
                    }
                    .print-table .label {
                        font-weight: bold;
                        background-color: #f8f8f8;
                        width: 40%;
                    }
                    .vital-signs-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 10px;
                    }
                    .signature-box {
                        border: 1px solid #000;
                        height: 60px;
                        margin-top: 20px;
                        position: relative;
                    }
                    .signature-label {
                        position: absolute;
                        bottom: 5px;
                        left: 5px;
                        font-size: 10px;
                    }
                }
            </style>
        `;
        
        document.body.innerHTML = printStyles + printContent.innerHTML;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload();
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'critique':
                return theme.palette.error.main;
            case 'en cours':
            case 'ouvert':
                return theme.palette.warning.main;
            case 'stable':
                return theme.palette.success.main;
            case 'terminé':
            case 'fermé':
                return theme.palette.grey[500];
            default:
                return theme.palette.info.main;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Non défini';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'Non défini';
        return timeString.substring(0, 5);
    };

    // Helper functions pour accéder aux données avec la nouvelle structure
    const getNestedValue = (obj, path, defaultValue = 'Non renseigné') => {
        const keys = path.split('.');
        let current = obj;
        
        for (const key of keys) {
            if (current && current[key] !== undefined && current[key] !== null) {
                current = current[key];
            } else {
                return defaultValue;
            }
        }
        
        return current || defaultValue;
    };

    const formatBooleanValue = (value) => {
        if (value === true) return 'Oui';
        if (value === false) return 'Non';
        return 'Non renseigné';
    };

    const MedicalSection = ({ title, children, noBorder = false }) => (
        <Box className="print-section" sx={{ mb: 3 }}>
            <Typography 
                className="print-section-title"
                variant="h6" 
                sx={{ 
                    fontWeight: 'bold', 
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    p: 1,
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                    mb: 1
                }}
            >
                {title}
            </Typography>
            <Box sx={{ 
                border: noBorder ? 'none' : `1px solid ${alpha(theme.palette.grey[400], 0.3)}`,
                borderRadius: noBorder ? 0 : 1,
                p: noBorder ? 0 : 2,
                backgroundColor: noBorder ? 'transparent' : alpha(theme.palette.grey[50], 0.5)
            }}>
                {children}
            </Box>
        </Box>
    );

    const DataTable = ({ data }) => (
        <TableContainer component={Paper} className="print-table" elevation={0} sx={{ border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}` }}>
            <Table size="small">
                <TableBody>
                    {data.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell 
                                className="label"
                                sx={{ 
                                    fontWeight: 'bold', 
                                    backgroundColor: alpha(theme.palette.grey[100], 0.8),
                                    width: '40%',
                                    border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`
                                }}
                            >
                                {row.label}
                            </TableCell>
                            <TableCell sx={{ border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}` }}>
                                {row.value || 'Non renseigné'}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    if (!patientDetails) {
        return (
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
                <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                    <Typography>Chargement du dossier médical...</Typography>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xl"
            PaperProps={{
                sx: {
                    height: '95vh',
                    maxHeight: '95vh'
                }
            }}
        >
            <DialogTitle
            className={'bg-color-primary'}
            sx={{ 
                color: 'white', 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 2
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AssignmentIcon sx={{ mr: 2, fontSize: 32 }} />
                    <Box>
                        <Typography  variant="h5" sx={{ fontWeight: 'bold'}}>
                            DOSSIER MÉDICAL
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Service des Urgences - {patientDetails.hospital}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                        variant="contained"
                        startIcon={<PrintIcon />}
                        onClick={handlePrint}
                        sx={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
                        }}
                    >
                        Imprimer
                    </Button>
                    <IconButton 
                        onClick={onClose} 
                        sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 0, overflowY: 'auto' }}>
                <Box ref={printRef} sx={{ p: 3, backgroundColor: 'white' }}>
                    {/* En-tête du dossier médical */}
                    <Box className="print-header" sx={{ textAlign: 'center', mb: 4, pb: 2, borderBottom: `2px solid ${theme.palette.primary.main}` }}>
                        <Typography className='text-color-primary' variant="h4" sx={{ fontWeight: 'bold' }}>
                            CHU {patientDetails.hospital}
                        </Typography>
                        <Typography variant="h6" sx={{ mt: 1 }}>
                            SERVICE DES URGENCES - TRAUMATOLOGIE
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, color: theme.palette.text.secondary }}>
                            Dossier N° {patientDetails.numero_dossier} - Imprimé le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        {/* Section 1: Identification du patient */}
                        <Grid size={{xs:12}}>
                            <MedicalSection title="I. IDENTIFICATION DU PATIENT">
                                <Grid container spacing={2}>
                                    <Grid size={{xs:12,md:6}}>
                                        <DataTable data={[
                                            { label: 'Nom et Prénom', value: patientDetails.patient },
                                            { label: 'N° de Dossier', value: patientDetails.numero_dossier },
                                            { label: 'Domicile', value: getNestedValue(patientDetails, 'information_variant_patient_data.domicile') },
                                            { label: 'Profession', value: getNestedValue(patientDetails, 'information_variant_patient_data.profession_specifique') }
                                        ]} />
                                    </Grid>
                                    <Grid size={{xs:12,md:6}}>
                                        <DataTable data={[
                                            { label: 'Date d\'admission', value: formatDate(patientDetails.date_admission) },
                                            { label: 'Mode d\'arrivée', value: getNestedValue(patientDetails, 'information_variant_patient_data.mode_arrivee') },
                                            { label: 'Enregistré par', value: patientDetails.enregistrator },
                                            { label: 'Statut actuel', value: patientDetails.statut?.toUpperCase() }
                                        ]} />
                                    </Grid>
                                </Grid>
                            </MedicalSection>
                        </Grid>

                        {/* Section 2: Motif de consultation */}
                        <Grid size={{xs:12}}>
                            <MedicalSection title="II. MOTIF DE CONSULTATION">
                                <Typography variant="body1" sx={{ p: 2, backgroundColor: alpha(theme.palette.info.main, 0.05), borderRadius: 1, border: `1px solid ${alpha(theme.palette.info.main, 0.2)}` }}>
                                    {patientDetails.motif_consultation || 'Non renseigné'}
                                </Typography>
                            </MedicalSection>
                        </Grid>

                        {/* Section 3: Constantes vitales */}
                        <Grid size={{xs:12,md:6}}>
                            <MedicalSection title="III. CONSTANTES VITALES">
                                <DataTable data={[
                                    { label: 'Fréquence Cardiaque', value: `${getNestedValue(patientDetails, 'signes_vitaux_data.frequence_cardiaque', '')} ${patientDetails.signes_vitaux_data?.frequence_cardiaque ? 'bpm' : ''}`.trim() || 'Non renseigné' },
                                    { label: 'Tension Artérielle', value: `${getNestedValue(patientDetails, 'signes_vitaux_data.pression_arterielle_systolique', '')}/${getNestedValue(patientDetails, 'signes_vitaux_data.pression_arterielle_diastolique', '')} ${patientDetails.signes_vitaux_data?.pression_arterielle_systolique ? 'mmHg' : ''}`.replace('/ mmHg', '').trim() || 'Non renseigné' },
                                    { label: 'Fréquence Respiratoire', value: `${getNestedValue(patientDetails, 'signes_vitaux_data.frequence_respiratoire', '')} ${patientDetails.signes_vitaux_data?.frequence_respiratoire ? 'rpm' : ''}`.trim() || 'Non renseigné' },
                                    { label: 'Saturation O2', value: `${getNestedValue(patientDetails, 'signes_vitaux_data.saturation_oxygene', '')}${patientDetails.signes_vitaux_data?.saturation_oxygene ? '%' : ''}`.trim() || 'Non renseigné' },
                                    { label: 'Oxygénothérapie', value: getNestedValue(patientDetails, 'signes_vitaux_data.administration_oxygene') },
                                    { label: 'Signes de vie', value: formatBooleanValue(patientDetails.signes_vitaux_data?.signes_de_vie) }
                                ]} />
                            </MedicalSection>
                        </Grid>

                        {/* Section 4: Évaluation neurologique */}
                        <Grid size={{xs:12,md:6}}>
                            <MedicalSection title="IV. ÉVALUATION NEUROLOGIQUE">
                                <DataTable data={[
                                    { label: 'Score de Glasgow Total', value: getNestedValue(patientDetails, 'evaluation_abcde_data.score_glasgow_total') },
                                    { label: 'Ouverture des yeux', value: `${getNestedValue(patientDetails, 'evaluation_abcde_data.score_glasgow_yeux', '')}/4`.replace('/4', '') || 'Non renseigné' },
                                    { label: 'Réponse verbale', value: `${getNestedValue(patientDetails, 'evaluation_abcde_data.score_glasgow_verbal', '')}/5`.replace('/5', '') || 'Non renseigné' },
                                    { label: 'Réponse motrice', value: `${getNestedValue(patientDetails, 'evaluation_abcde_data.score_glasgow_motricite', '')}/6`.replace('/6', '') || 'Non renseigné' },
                                    { label: 'Évaluation ABCDE', value: getNestedValue(patientDetails, 'evaluation_abcde_data.evda_initiale') },
                                    { label: 'Réaction pupillaire', value: getNestedValue(patientDetails, 'evaluation_abcde_data.nombre_reaction_pupillaire') }
                                ]} />
                            </MedicalSection>
                        </Grid>

                        {/* Section 5: Triage */}
                        <Grid size={{xs:12,md:6}}>
                            <MedicalSection title="V. TRIAGE">
                                <DataTable data={[
                                    { label: 'Outil de triage', value: getNestedValue(patientDetails, 'triage_data.outil_triage') },
                                    { label: 'Triage effectué', value: formatBooleanValue(patientDetails.triage_data?.triage_effectue) },
                                    { label: 'Autre outil', value: getNestedValue(patientDetails, 'triage_data.autre_outil_triage') },
                                    { label: 'Catégorie', value: getNestedValue(patientDetails, 'triage_data.autre_categorie_outil_triage') }
                                ]} />
                            </MedicalSection>
                        </Grid>

                        {/* Section 6: Historique de l'accident */}
                        <Grid size={{xs:12,md:6}}>
                            <MedicalSection title="VI. CIRCONSTANCES DE L'ACCIDENT">
                                <DataTable data={[
                                    { label: 'Date de l\'accident', value: formatDate(patientDetails.historique_maladie_actuelle_data?.date_accident) },
                                    { label: 'Lieu de l\'accident', value: getNestedValue(patientDetails, 'information_variant_patient_data.lieu_accident') },
                                    { label: 'Mécanisme', value: getNestedValue(patientDetails, 'historique_maladie_actuelle_data.mecanisme_accident') },
                                    { label: 'Activité', value: getNestedValue(patientDetails, 'historique_maladie_actuelle_data.activite_lors_accident') },
                                    { label: 'Intentionnel', value: formatBooleanValue(patientDetails.historique_maladie_actuelle_data?.intentionnel) },
                                    { label: 'Protection utilisée', value: getNestedValue(patientDetails, 'historique_maladie_actuelle_data.materiel_protection') }
                                ]} />
                            </MedicalSection>
                        </Grid>

                        {/* Section 7: Blessures */}
                        {patientDetails.blessures_data?.details?.length > 0 && (
                            <Grid size={{xs:12}}>
                                <MedicalSection title="VII. BLESSURES ET LÉSIONS">
                                    {patientDetails.blessures_data.details.map((blessure, index) => (
                                        <Box key={index} sx={{ mb: 2 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: theme.palette.error.main }}>
                                                Lésion #{index + 1}
                                            </Typography>
                                            <DataTable data={[
                                                { label: 'Localisation', value: blessure.localisation_nom || blessure.localisation || 'Non spécifiée' },
                                                { label: 'Conditions', value: Array.isArray(blessure.conditions_noms) ? blessure.conditions_noms.join(', ') : (blessure.conditions || 'Non spécifiées') },
                                            ]} />
                                        </Box>
                                    ))}
                                </MedicalSection>
                            </Grid>
                        )}

                        {/* Section 8: Examens et diagnostics */}
                        <Grid size={{xs:12}}>
                            <MedicalSection title="VIII. EXAMENS COMPLÉMENTAIRES ET DIAGNOSTICS">
                                <Grid container spacing={2}>
                                    <Grid size={{xs:12,md:4}}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                            Tests Diagnostiques:
                                        </Typography>
                                        {patientDetails.interventions_urgences_tests_diagnostiques_data?.tests_diagnostiques_types?.length > 0 ? (
                                            <ul style={{ margin: 0, paddingLeft: 20 }}>
                                                {patientDetails.interventions_urgences_tests_diagnostiques_data.tests_diagnostiques_types.map((test, index) => (
                                                    <li key={index}>
                                                        <Typography variant="body2">{test}</Typography>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                                Aucun test diagnostique enregistré
                                            </Typography>
                                        )}
                                    </Grid>
                                    <Grid size={{xs:12,md:4}}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                            Procédures:
                                        </Typography>
                                        {patientDetails.interventions_urgences_procedures_data?.procedures_types?.length > 0 ? (
                                            <ul style={{ margin: 0, paddingLeft: 20 }}>
                                                {patientDetails.interventions_urgences_procedures_data.procedures_types.map((procedure, index) => (
                                                    <li key={index}>
                                                        <Typography variant="body2">{procedure}</Typography>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                                Aucune procédure enregistrée
                                            </Typography>
                                        )}
                                    </Grid>
                                    <Grid size={{xs:12,md:4}}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                            Médicaments administrés:
                                        </Typography>
                                        {patientDetails.interventions_urgences_medicaments_liquide_data?.medicaments_liquide_types?.length > 0 ? (
                                            <ul style={{ margin: 0, paddingLeft: 20 }}>
                                                {patientDetails.interventions_urgences_medicaments_liquide_data.medicaments_liquide_types.map((medicament, index) => (
                                                    <li key={index}>
                                                        <Typography variant="body2">{medicament}</Typography>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                                Aucun médicament administré
                                            </Typography>
                                        )}
                                    </Grid>
                                </Grid>
                            </MedicalSection>
                        </Grid>

                        {/* Section 9: Antécédents et facteurs de risque */}
                        <Grid size={{xs:12}}>
                            <MedicalSection title="IX. ANTÉCÉDENTS ET FACTEURS DE RISQUE">
                                <DataTable data={[
                                    { label: 'Nombre de comorbidités', value: getNestedValue(patientDetails, 'historique_medical_data.nombre_comorbidites') },
                                    { label: 'Patiente enceinte', value: formatBooleanValue(patientDetails.historique_medical_data?.patiente_enceinte) },
                                    { label: 'Consommation d\'alcool', value: getNestedValue(patientDetails, 'historique_maladie_actuelle_data.consommation_alcool') },
                                    { label: 'Consommation de substances', value: getNestedValue(patientDetails, 'historique_maladie_actuelle_data.consommation_substance') },
                                    { label: 'Soins préhospitaliers', value: formatBooleanValue(patientDetails.historique_maladie_actuelle_data?.soins_prehospitaliers) }
                                ]} />
                            </MedicalSection>
                        </Grid>

                        {/* Section 10: Sortie et disposition */}
                        <Grid size={{xs:12}}>
                            <MedicalSection title="X. SORTIE ET DISPOSITION">
                                <DataTable data={[
                                    { label: 'Date de sortie prévue', value: formatDate(patientDetails.disposition_unite_urgence_data?.date_sortie_unite_urgence) },
                                    { label: 'Heure de sortie', value: formatTime(patientDetails.disposition_unite_urgence_data?.heure_sortie_unite_urgence) },
                                    { label: 'Destination', value: getNestedValue(patientDetails, 'disposition_unite_urgence_data.sortie_su') },
                                    { label: 'Durée de séjour', value: patientDetails.duree_sejour || 'Non calculée' },
                                ]} />
                            </MedicalSection>
                        </Grid>

                        {/* Section 11: Observations médicales */}
                        <Grid size={{xs:12}}>
                            <MedicalSection title="XI. OBSERVATIONS MÉDICALES">
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        Commentaires généraux:
                                    </Typography>
                                    <Box sx={{ 
                                        minHeight: 60,
                                        p: 2, 
                                        border: `1px solid ${alpha(theme.palette.grey[400], 0.5)}`,
                                        borderRadius: 1,
                                        backgroundColor: alpha(theme.palette.grey[50], 0.3)
                                    }}>
                                        <Typography variant="body2">
                                            {patientDetails.commentaires_generaux || 'Aucune observation particulière.'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </MedicalSection>
                        </Grid>

                        {/* Section signature */}
                        <Grid size={{xs:12}}>
                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                                <Box className="signature-box" sx={{ 
                                    width: '45%', 
                                    height: 80, 
                                    border: `1px solid ${theme.palette.grey[400]}`,
                                    position: 'relative',
                                    backgroundColor: alpha(theme.palette.grey[50], 0.3)
                                }}>
                                    <Typography className="signature-label" variant="caption" sx={{ 
                                        position: 'absolute', 
                                        bottom: 5, 
                                        left: 10,
                                        fontWeight: 'bold'
                                    }}>
                                        Signature du médecin
                                    </Typography>
                                </Box>
                                <Box className="signature-box" sx={{ 
                                    width: '45%', 
                                    height: 80, 
                                    border: `1px solid ${theme.palette.grey[400]}`,
                                    position: 'relative',
                                    backgroundColor: alpha(theme.palette.grey[50], 0.3)
                                }}>
                                    <Typography className="signature-label" variant="caption" sx={{ 
                                        position: 'absolute', 
                                        bottom: 5, 
                                        left: 10,
                                        fontWeight: 'bold'
                                    }}>
                                        Signature de l'infirmier(ère)
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>

            <DialogActions sx={{ 
                p: 2, 
                backgroundColor: alpha(theme.palette.grey[100], 0.8),
                borderTop: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`
            }}>
                <Button 
                    onClick={onClose} 
                    variant="outlined"
                    size="large"
                >
                    Fermer
                </Button>
            </DialogActions>
        </Dialog>
    );
};





















// import { 
//     alpha, 
//     Box, 
//     Button, 
//     Dialog, 
//     DialogActions, 
//     DialogContent, 
//     DialogTitle, 
//     Typography, 
//     useTheme,
//     Grid,
//     IconButton,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableRow,
//     Paper,
//     useMediaQuery
// } from '@mui/material'
// import React, { useEffect, useRef } from 'react'
// import {
//     Print as PrintIcon,
//     Close as CloseIcon,
//     Assignment as AssignmentIcon
// } from '@mui/icons-material'
// import { apiTogetById } from '../../../../../utils/ApiServices';

// export const DetailDialog = ({ open, onClose, selectedDossier }) => {
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//     const printRef = useRef();
//     const [patientDetails, setPatientDetails] = React.useState(null);
    
//     useEffect(() => {
//         const fetchPatientById = async (id) => {
//             try {
//                 const response = await apiTogetById(`traumatologie/traumatologie-dossiers/`, id);
//                 setPatientDetails(response);
//             } catch (error) {
//                 console.error('Erreur lors de la récupération du patient:', error);
//             }
//         };
//         if (selectedDossier?.id) {
//             fetchPatientById(selectedDossier.id);
//         }
//     }, [selectedDossier?.id]);

//     const handlePrint = () => {
//         const printContent = printRef.current;
//         const originalContent = document.body.innerHTML;
        
//         // Styles pour l'impression
//         const printStyles = `
//             <style>
//                 @media print {
//                     @page {
//                         margin: 1.5cm;
//                         size: A4;
//                     }
//                     body {
//                         font-family: Arial, sans-serif;
//                         font-size: 12px;
//                         line-height: 1.4;
//                         color: #000;
//                         background: white;
//                     }
//                     .print-header {
//                         text-align: center;
//                         border-bottom: 2px solid #000;
//                         padding-bottom: 10px;
//                         margin-bottom: 20px;
//                     }
//                     .print-section {
//                         margin-bottom: 15px;
//                         page-break-inside: avoid;
//                     }
//                     .print-section-title {
//                         font-weight: bold;
//                         font-size: 14px;
//                         background-color: #f0f0f0;
//                         padding: 5px;
//                         border: 1px solid #000;
//                         margin-bottom: 5px;
//                     }
//                     .print-table {
//                         width: 100%;
//                         border-collapse: collapse;
//                         margin-bottom: 10px;
//                     }
//                     .print-table td {
//                         border: 1px solid #000;
//                         padding: 4px;
//                         vertical-align: top;
//                     }
//                     .print-table .label {
//                         font-weight: bold;
//                         background-color: #f8f8f8;
//                         width: 40%;
//                     }
//                     .vital-signs-grid {
//                         display: grid;
//                         grid-template-columns: 1fr 1fr;
//                         gap: 10px;
//                     }
//                     .signature-box {
//                         border: 1px solid #000;
//                         height: 60px;
//                         margin-top: 20px;
//                         position: relative;
//                     }
//                     .signature-label {
//                         position: absolute;
//                         bottom: 5px;
//                         left: 5px;
//                         font-size: 10px;
//                     }
//                 }
//             </style>
//         `;
        
//         document.body.innerHTML = printStyles + printContent.innerHTML;
//         window.print();
//         document.body.innerHTML = originalContent;
//         window.location.reload();
//     };

//     const getStatusColor = (status) => {
//         switch (status?.toLowerCase()) {
//             case 'critique':
//                 return theme.palette.error.main;
//             case 'en cours':
//             case 'ouvert':
//                 return theme.palette.warning.main;
//             case 'stable':
//                 return theme.palette.success.main;
//             case 'terminé':
//             case 'fermé':
//                 return theme.palette.grey[500];
//             default:
//                 return theme.palette.info.main;
//         }
//     };

//     const formatDate = (dateString) => {
//         if (!dateString) return 'Non défini';
//         return new Date(dateString).toLocaleDateString('fr-FR', {
//             year: 'numeric',
//             month: '2-digit',
//             day: '2-digit',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     const formatTime = (timeString) => {
//         if (!timeString) return 'Non défini';
//         return timeString.substring(0, 5);
//     };

//     const MedicalSection = ({ title, children, noBorder = false }) => (
//         <Box className="print-section" sx={{ mb: 3 }}>
//             <Typography 
//                 className="print-section-title"
//                 variant="h6" 
//                 sx={{ 
//                     fontWeight: 'bold', 
//                     backgroundColor: alpha(theme.palette.primary.main, 0.1),
//                     p: 1,
//                     borderLeft: `4px solid ${theme.palette.primary.main}`,
//                     mb: 1
//                 }}
//             >
//                 {title}
//             </Typography>
//             <Box sx={{ 
//                 border: noBorder ? 'none' : `1px solid ${alpha(theme.palette.grey[400], 0.3)}`,
//                 borderRadius: noBorder ? 0 : 1,
//                 p: noBorder ? 0 : 2,
//                 backgroundColor: noBorder ? 'transparent' : alpha(theme.palette.grey[50], 0.5)
//             }}>
//                 {children}
//             </Box>
//         </Box>
//     );

//     const DataTable = ({ data }) => (
//         <TableContainer component={Paper} className="print-table" elevation={0} sx={{ border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}` }}>
//             <Table size="small">
//                 <TableBody>
//                     {data.map((row, index) => (
//                         <TableRow key={index}>
//                             <TableCell 
//                                 className="label"
//                                 sx={{ 
//                                     fontWeight: 'bold', 
//                                     backgroundColor: alpha(theme.palette.grey[100], 0.8),
//                                     width: '40%',
//                                     border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`
//                                 }}
//                             >
//                                 {row.label}
//                             </TableCell>
//                             <TableCell sx={{ border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}` }}>
//                                 {row.value || 'Non renseigné'}
//                             </TableCell>
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>
//         </TableContainer>
//     );

//     if (!patientDetails) {
//         return (
//             <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
//                 <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
//                     <Typography>Chargement du dossier médical...</Typography>
//                 </DialogContent>
//             </Dialog>
//         );
//     }

//     return (
//         <Dialog
//             open={open}
//             onClose={onClose}
//             fullWidth
//             maxWidth="xl"
//             PaperProps={{
//                 sx: {
//                     height: '95vh',
//                     maxHeight: '95vh'
//                 }
//             }}
//         >
//             <DialogTitle
//             className={'bg-color-primary'}
//             sx={{ 
//                 color: 'white', 
//                 display: 'flex', 
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 py: 2
//             }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                     <AssignmentIcon sx={{ mr: 2, fontSize: 32 }} />
//                     <Box>
//                         <Typography  variant="h5" sx={{ fontWeight: 'bold'}}>
//                             DOSSIER MÉDICAL
//                         </Typography>
//                         <Typography variant="body2" sx={{ opacity: 0.9 }}>
//                             Service des Urgences - {patientDetails.hospital}
//                         </Typography>
//                     </Box>
//                 </Box>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                     <Button
//                         variant="contained"
//                         startIcon={<PrintIcon />}
//                         onClick={handlePrint}
//                         sx={{
//                             backgroundColor: 'rgba(255,255,255,0.2)',
//                             '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
//                         }}
//                     >
//                         Imprimer
//                     </Button>
//                     <IconButton 
//                         onClick={onClose} 
//                         sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
//                     >
//                         <CloseIcon />
//                     </IconButton>
//                 </Box>
//             </DialogTitle>

//             <DialogContent sx={{ p: 0, overflowY: 'auto' }}>
//                 <Box ref={printRef} sx={{ p: 3, backgroundColor: 'white' }}>
//                     {/* En-tête du dossier médical */}
//                     <Box className="print-header" sx={{ textAlign: 'center', mb: 4, pb: 2, borderBottom: `2px solid ${theme.palette.primary.main}` }}>
//                         <Typography className='text-color-primary' variant="h4" sx={{ fontWeight: 'bold' }}>
//                             CHU {patientDetails.hospital}
//                         </Typography>
//                         <Typography variant="h6" sx={{ mt: 1 }}>
//                             SERVICE DES URGENCES - TRAUMATOLOGIE
//                         </Typography>
//                         <Typography variant="body2" sx={{ mt: 1, color: theme.palette.text.secondary }}>
//                             Dossier N° {patientDetails.numero_dossier} - Imprimé le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
//                         </Typography>
//                     </Box>

//                     <Grid container spacing={3}>
//                         {/* Section 1: Identification du patient */}
//                         <Grid size={{xs:12}}>
//                             <MedicalSection title="I. IDENTIFICATION DU PATIENT">
//                                 <Grid container spacing={2}>
//                                     <Grid size={{xs:12,md:6}}>
//                                         <DataTable data={[
//                                             { label: 'Nom et Prénom', value: patientDetails.patient },
//                                             { label: 'N° de Dossier', value: patientDetails.numero_dossier },
//                                             { label: 'Domicile', value: patientDetails.information_variant_patient?.domicile },
//                                             { label: 'Profession', value: patientDetails.information_variant_patient?.profession_specifique }
//                                         ]} />
//                                     </Grid>
//                                     <Grid size={{xs:12,md:6}}>
//                                         <DataTable data={[
//                                             { label: 'Date d\'admission', value: formatDate(patientDetails.date_admission) },
//                                             { label: 'Mode d\'arrivée', value: patientDetails.information_variant_patient?.mode_arrivee },
//                                             { label: 'Enregistré par', value: patientDetails.enregistrator },
//                                             { label: 'Statut actuel', value: patientDetails.statut?.toUpperCase() }
//                                         ]} />
//                                     </Grid>
//                                 </Grid>
//                             </MedicalSection>
//                         </Grid>

//                         {/* Section 2: Motif de consultation */}
//                         <Grid size={{xs:12}}>
//                             <MedicalSection title="II. MOTIF DE CONSULTATION">
//                                 <Typography variant="body1" sx={{ p: 2, backgroundColor: alpha(theme.palette.info.main, 0.05), borderRadius: 1, border: `1px solid ${alpha(theme.palette.info.main, 0.2)}` }}>
//                                     {patientDetails.motif_consultation}
//                                 </Typography>
//                             </MedicalSection>
//                         </Grid>

//                         {/* Section 3: Constantes vitales */}
//                         <Grid size={{xs:12,md:6}}>
//                             <MedicalSection title="III. CONSTANTES VITALES">
//                                 <DataTable data={[
//                                     { label: 'Fréquence Cardiaque', value: `${patientDetails.signes_vitaux?.frequence_cardiaque} bpm` },
//                                     { label: 'Tension Artérielle', value: `${patientDetails.signes_vitaux?.pression_arterielle_systolique}/${patientDetails.signes_vitaux?.pression_arterielle_diastolique} mmHg` },
//                                     { label: 'Fréquence Respiratoire', value: `${patientDetails.signes_vitaux?.frequence_respiratoire} rpm` },
//                                     { label: 'Saturation O2', value: `${patientDetails.signes_vitaux?.saturation_oxygene}%` },
//                                     { label: 'Oxygénothérapie', value: patientDetails.signes_vitaux?.administration_oxygene },
//                                     { label: 'Signes de vie', value: patientDetails.signes_vitaux?.signes_de_vie ? 'Présents' : 'Absents' }
//                                 ]} />
//                             </MedicalSection>
//                         </Grid>

//                         {/* Section 4: Évaluation neurologique */}
//                         <Grid size={{xs:12,md:6}}>
//                             <MedicalSection title="IV. ÉVALUATION NEUROLOGIQUE">
//                                 <DataTable data={[
//                                     { label: 'Score de Glasgow Total', value: patientDetails.evaluation_abcde?.score_glasgow_total },
//                                     { label: 'Ouverture des yeux', value: `${patientDetails.evaluation_abcde?.score_glasgow_yeux}/4` },
//                                     { label: 'Réponse verbale', value: `${patientDetails.evaluation_abcde?.score_glasgow_verbal}/5` },
//                                     { label: 'Réponse motrice', value: `${patientDetails.evaluation_abcde?.score_glasgow_motricite}/6` },
//                                     { label: 'Évaluation ABCDE', value: patientDetails.evaluation_abcde?.evda_initiale },
//                                     { label: 'Réaction pupillaire', value: patientDetails.evaluation_abcde?.nombre_reaction_pupillaire }
//                                 ]} />
//                             </MedicalSection>
//                         </Grid>

//                         {/* Section 5: Triage */}
//                         <Grid size={{xs:12,md:6}}>
//                             <MedicalSection title="V. TRIAGE">
//                                 <DataTable data={[
//                                     { label: 'Outil de triage', value: patientDetails.triage?.outil_triage },
//                                     { label: 'Triage effectué', value: patientDetails.triage?.triage_effectue ? 'Oui' : 'Non' },
//                                     { label: 'Autre outil', value: patientDetails.triage?.autre_outil_triage },
//                                     { label: 'Catégorie', value: patientDetails.triage?.autre_categorie_outil_triage }
//                                 ]} />
//                             </MedicalSection>
//                         </Grid>

//                         {/* Section 6: Historique de l'accident */}
//                         <Grid size={{xs:12,md:6}}>
//                             <MedicalSection title="VI. CIRCONSTANCES DE L'ACCIDENT">
//                                 <DataTable data={[
//                                     { label: 'Date de l\'accident', value: formatDate(patientDetails.historique_maladie_actuelle?.date_accident) },
//                                     { label: 'Lieu de l\'accident', value: patientDetails.information_variant_patient?.lieu_accident },
//                                     { label: 'Mécanisme', value: patientDetails.historique_maladie_actuelle?.mecanisme_accident },
//                                     { label: 'Activité', value: patientDetails.historique_maladie_actuelle?.activite_lors_accident },
//                                     { label: 'Intentionnel', value: patientDetails.historique_maladie_actuelle?.intentionnel ? 'Oui' : 'Non' },
//                                     { label: 'Protection utilisée', value: patientDetails.historique_maladie_actuelle?.materiel_protection }
//                                 ]} />
//                             </MedicalSection>
//                         </Grid>

//                         {/* Section 7: Blessures */}
//                         {patientDetails.blessures?.details && (
//                             <Grid size={{xs:12}}>
//                                 <MedicalSection title="VII. BLESSURES ET LÉSIONS">
//                                     {patientDetails.blessures.details.map((blessure, index) => (
//                                         <Box key={index} sx={{ mb: 2 }}>
//                                             <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: theme.palette.error.main }}>
//                                                 Lésion #{index + 1}
//                                             </Typography>
//                                             <DataTable data={[
//                                                 { label: 'Localisation', value: blessure.localisation_nom },
//                                                 { label: 'Conditions', value: blessure.conditions_noms?.join(', ') },
//                                             ]} />
//                                         </Box>
//                                     ))}
//                                 </MedicalSection>
//                             </Grid>
//                         )}

//                         {/* Section 8: Examens et diagnostics */}
//                         <Grid size={{xs:12}}>
//                             <MedicalSection title="VIII. EXAMENS COMPLÉMENTAIRES ET DIAGNOSTICS">
//                                 <Grid container spacing={2}>
//                                     <Grid size={{xs:12,md:4}}>
//                                         <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
//                                             Tests Diagnostiques:
//                                         </Typography>
//                                         <ul style={{ margin: 0, paddingLeft: 20 }}>
//                                             {patientDetails.interventions_tests_diagnostiques?.tests_diagnostiques_types_noms?.map((test, index) => (
//                                                 <li key={index}>
//                                                     <Typography variant="body2">{test}</Typography>
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     </Grid>
//                                     <Grid size={{xs:12,md:4}}>
//                                         <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
//                                             Procédures:
//                                         </Typography>
//                                         <ul style={{ margin: 0, paddingLeft: 20 }}>
//                                             {patientDetails.interventions_procedures?.procedures_types_noms?.map((procedure, index) => (
//                                                 <li key={index}>
//                                                     <Typography variant="body2">{procedure}</Typography>
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     </Grid>
//                                     <Grid size={{xs:12,md:4}}>
//                                         <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
//                                             Médicaments administrés:
//                                         </Typography>
//                                         <ul style={{ margin: 0, paddingLeft: 20 }}>
//                                             {patientDetails.interventions_medicaments_liquide?.medicaments_liquide_types_noms?.map((medicament, index) => (
//                                                 <li key={index}>
//                                                     <Typography variant="body2">{medicament}</Typography>
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     </Grid>
//                                 </Grid>
//                             </MedicalSection>
//                         </Grid>

//                         {/* Section 9: Antécédents et facteurs de risque */}
//                         <Grid size={{xs:12}}>
//                             <MedicalSection title="IX. ANTÉCÉDENTS ET FACTEURS DE RISQUE">
//                                 <DataTable data={[
//                                     { label: 'Nombre de comorbidités', value: patientDetails.historique_medical?.nombre_comorbidites },
//                                     { label: 'Patiente enceinte', value: patientDetails.historique_medical?.patiente_enceinte ? 'Oui' : 'Non' },
//                                     { label: 'Consommation d\'alcool', value: patientDetails.historique_maladie_actuelle?.consommation_alcool },
//                                     { label: 'Consommation de substances', value: patientDetails.historique_maladie_actuelle?.consommation_substance },
//                                     { label: 'Soins préhospitaliers', value: patientDetails.historique_maladie_actuelle?.soins_prehospitaliers ? 'Oui' : 'Non' }
//                                 ]} />
//                             </MedicalSection>
//                         </Grid>

//                         {/* Section 10: Sortie et disposition */}
//                         <Grid size={{xs:12}}>
//                             <MedicalSection title="X. SORTIE ET DISPOSITION">
//                                 <DataTable data={[
//                                     { label: 'Date de sortie prévue', value: formatDate(patientDetails.disposition_unite_urgence?.date_sortie_unite_urgence) },
//                                     { label: 'Heure de sortie', value: formatTime(patientDetails.disposition_unite_urgence?.heure_sortie_unite_urgence) },
//                                     { label: 'Destination', value: patientDetails.disposition_unite_urgence?.sortie_su },
//                                     { label: 'Durée de séjour', value: patientDetails.duree_sejour },
//                                 ]} />
//                             </MedicalSection>
//                         </Grid>

//                         {/* Section 11: Observations médicales */}
//                         <Grid size={{xs:12}}>
//                             <MedicalSection title="XI. OBSERVATIONS MÉDICALES">
//                                 <Box sx={{ mb: 2 }}>
//                                     <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
//                                         Commentaires généraux:
//                                     </Typography>
//                                     <Box sx={{ 
//                                         minHeight: 60,
//                                         p: 2, 
//                                         border: `1px solid ${alpha(theme.palette.grey[400], 0.5)}`,
//                                         borderRadius: 1,
//                                         backgroundColor: alpha(theme.palette.grey[50], 0.3)
//                                     }}>
//                                         <Typography variant="body2">
//                                             {patientDetails.commentaires_generaux || 'Aucune observation particulière.'}
//                                         </Typography>
//                                     </Box>
//                                 </Box>
//                             </MedicalSection>
//                         </Grid>

//                         {/* Section signature */}
//                         <Grid size={{xs:12}}>
//                             <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
//                                 <Box className="signature-box" sx={{ 
//                                     width: '45%', 
//                                     height: 80, 
//                                     border: `1px solid ${theme.palette.grey[400]}`,
//                                     position: 'relative',
//                                     backgroundColor: alpha(theme.palette.grey[50], 0.3)
//                                 }}>
//                                     <Typography className="signature-label" variant="caption" sx={{ 
//                                         position: 'absolute', 
//                                         bottom: 5, 
//                                         left: 10,
//                                         fontWeight: 'bold'
//                                     }}>
//                                         Signature du médecin
//                                     </Typography>
//                                 </Box>
//                                 <Box className="signature-box" sx={{ 
//                                     width: '45%', 
//                                     height: 80, 
//                                     border: `1px solid ${theme.palette.grey[400]}`,
//                                     position: 'relative',
//                                     backgroundColor: alpha(theme.palette.grey[50], 0.3)
//                                 }}>
//                                     <Typography className="signature-label" variant="caption" sx={{ 
//                                         position: 'absolute', 
//                                         bottom: 5, 
//                                         left: 10,
//                                         fontWeight: 'bold'
//                                     }}>
//                                         Signature de l'infirmier(ère)
//                                     </Typography>
//                                 </Box>
//                             </Box>
//                         </Grid>
//                     </Grid>
//                 </Box>
//             </DialogContent>

//             <DialogActions sx={{ 
//                 p: 2, 
//                 backgroundColor: alpha(theme.palette.grey[100], 0.8),
//                 borderTop: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`
//             }}>
//                 <Button 
//                     onClick={onClose} 
//                     variant="outlined"
//                     size="large"
//                 >
//                     Fermer
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };