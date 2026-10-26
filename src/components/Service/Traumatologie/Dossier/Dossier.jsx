import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import dayjs from 'dayjs';
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Typography,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Avatar,
  TablePagination,
  InputBase,
  Card,
  CardContent,
  useTheme,
  alpha,
  Tooltip,
  LinearProgress,
  Alert,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  Stack,
  Divider,
  Badge,
  Grid,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import RefreshIcon from '@mui/icons-material/Refresh';
import { HealingRounded, OpenInNewRounded, Person, Assignment, ChangeCircle } from '@mui/icons-material';

const InformationsPatient = lazy(() => import('./FormComponent/InformationsPatient').then(module => ({ default: module.InformationsPatient || module.default })));
const InformationsVariantesPatient = lazy(() => import('./FormComponent/InformationsVariantesPatient').then(module => ({ default: module.InformationsVariantesPatient || module.default })));
const SignesVitaux = lazy(() => import('./FormComponent/SignesVitaux').then(module => ({ default: module.SignesVitaux || module.default })));
const EvaluationABCDE = lazy(() => import('./FormComponent/EvaluationABCDE').then(module => ({ default: module.EvaluationABCDE || module.default })));
const Triage = lazy(() => import('./FormComponent/Triage').then(module => ({ default: module.Triage || module.default })));
const HistoriqueMedical = lazy(() => import('./FormComponent/HistoriqueMedical').then(module => ({ default: module.HistoriqueMedical || module.default })));
const HistoriqueMaladieActuelle = lazy(() => import('./FormComponent/HistoriqueMaladieActuelle').then(module => ({ default: module.HistoriqueMaladieActuelle || module.default })));
const Blessures = lazy(() => import('./FormComponent/Blessures').then(module => ({ default: module.Blessures || module.default })));
const MedicamentsLiquides = lazy(() => import('./FormComponent/MedicamentsLiquides').then(module => ({ default: module.MedicamentsLiquides || module.default })));
const Procedures = lazy(() => import('./FormComponent/Procedures').then(module => ({ default: module.Procedures || module.default })));
const TestsDiagnostiques = lazy(() => import('./FormComponent/TestsDiagnostiques').then(module => ({ default: module.TestsDiagnostiques || module.default })));
const DispositionUniteUrgence = lazy(() => import('./FormComponent/DispositionUniteUrgence').then(module => ({ default: module.DispositionUniteUrgence || module.default })));

import { apiToPost, apiTogetAll, apiToDelete, apiToPatch, apiTogetById } from '../../../../utils/ApiServices';
import { useMemo } from 'react';
import { DetailDialog } from './Dialogs/DetailDialog';
import api from '../../../../api/Api';
import { useLocation, useMatches } from 'react-router-dom';
import { useActiveService } from '../../../../utils/activeService';

export const Dossier = () => {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [dossierToDelete, setDossierToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [dossiers, setDossiers] = useState([]);
  const [editingDossier, setEditingDossier] = useState(null);
  const [error, setError] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);

  const activeService = useActiveService()


  // États pour les filtres
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filters, setFilters] = useState({
    statut: [],
    hospital: [],
    suite_procedure: [],
    motif_consultation: [],
    date_range: {
      start: null,
      end: null
    }
  });

  const memoizedSetError = useCallback((errorMessage) => {
    setError(errorMessage);
  }, []);

  const initialFormData = {
    patient: null,
    hospital: null,
    service: null,
    enregistrator: null,
    patient_id: null,
    hospital_id: null,
    service_id: null,
    enregistrator_id: null,
    motif_consultation: "",
    commentaires_generaux: "",
    information_variant_patient_data: {
      mode_arrivee: '',
      autre_mode_arrivee: '',
      nombre_frequentations_medicales: null,
      classification_profession: '',
      profession_specifique: '',
      domicile: '',
      residence_secondaire: '',
      lieu_accident: '',
      geolocalisation: {
        latitude: null,
        longitude: null,
        description: ""
      },
      accident_de_masse: false
    },
    signes_vitaux_data: {
      signes_de_vie: true,
      pression_arterielle_systolique: null,
      pression_arterielle_diastolique: null,
      frequence_cardiaque: null,
      saturation_oxygene: null,
      administration_oxygene: '',
      frequence_respiratoire: null
    },
    evaluation_abcde_data: {
      evda_initiale: '',
      score_glasgow_yeux: null,
      score_glasgow_verbal: null,
      score_glasgow_motricite: null,
      score_glasgow_total: null,
      glasgow_qualifie: false,
      nombre_reaction_pupillaire: null
    },
    triage_data: {
      triage_effectue: false,
      outil_triage: '',
      autre_outil_triage: '',
      autre_categorie_outil_triage: ""
    },
    historique_medical_data: {
      nombre_comorbidites: null,
      patiente_enceinte: false
    },
    historique_maladie_actuelle_data: {
      date_accident: null,
      hma_lieu_accident: '',
      autre_lieu_accident: '',
      activite_lors_accident: '',
      autre_activite_lors_accident: '',
      mecanisme_accident: '',
      autre_mecanisme_accident: '',
      materiel_protection: '',
      autre_materiel_protection: '',
      mecanisme_supplementaire: false,
      protection_utilisee: false,
      intentionnel: false,
      soins_prehospitaliers: false,
      prise_en_charge_medical_lieu_accident_lors_transport: false,
      hma_autre_mode_arrivee: false,
      procedure_supplementaire: false,
      consommation_substance: '',
      consommation_alcool: ""
    },
    blessures_data: {
      checklist_trauma_utilisee: false,
      blessure_supplementaire: false,
      details: []
    },
    interventions_urgences_medicaments_liquide_data: {
      medicaments_liquide_administres: false,
      medicaments_liquide_types: [],
      medicaments_liquide_autre: ""
    },
    interventions_urgences_procedures_data: {
      procedures: false,
      procedures_types: [],
      procedures_autre: ""
    },
    interventions_urgences_tests_diagnostiques_data: {
      tests_diagnostiques: false,
      tests_diagnostiques_types: [],
      tests_diagnostiques_autre: null
    },
    disposition_unite_urgence_data: {
      sortie_su: null,
      autre_sortie_su: null,
      consignes_domicile: null,
      accompagnant: null,
      rdv_controle: null,
      diagnostique_hospitalisation: null,
      numero_chambre_lit: null,
      hopital_transfert: null,
      autre_hopital: null,
      service_transfert: null,
      autre_service_transfert: null,
      motif_transfert: null,
      cause_deces: null
    }
  };

  const [formData, setFormData] = useState(initialFormData);

  // Fonction pour formater la suite de procédure
  const handleSuiteProcedur = (suiteduprocedure) => {
    const procedures = {
      'domicile': { label: "Retour à domicile", color: "success" },
      'hospitalisation': { label: "Hospitalisation", color: "info" },
      'transfert': { label: "Transfert", color: "warning" },
      'deces': { label: "Décès", color: "error" },
      '': { label: "Aucune", color: "default" }
    };
    return procedures[suiteduprocedure] || { label: "Statut inconnu", color: "default" };
  };

  // Fonction pour formater le statut
  const getStatutInfo = (statut) => {
    const statuts = {
      'ouvert': { label: "En cours", color: "warning" },
      'ferme': { label: "Fermé", color: "success" },
      'critique': { label: "Critique", color: "error" },
      'stable': { label: "Stable", color: "info" },
      'attente': { label: "En attente", color: "default" }
    };
    return statuts[statut] || { label: statut || "Non défini", color: "default" };
  };

  // Fonction pour calculer la durée de séjour
  const calculateDureeSejourVisuelle = (dateAdmission, dateSortie) => {
    if (!dateAdmission) return "Non définie";

    const admission = new Date(dateAdmission);
    const sortie = dateSortie ? new Date(dateSortie) : new Date();
    const diffMs = sortie - admission;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    const remainingHours = diffHours % 24;

    if (diffDays > 0) {
      return `${diffDays}j ${remainingHours}h`;
    }
    return `${diffHours}h`;
  };

  const fetchPatientsTraumatologieRecords = useCallback(async () => {
    setLoading(true);
    try {
      const { results } = await apiTogetAll('traumatologie/traumatologie-dossiers/');
      const data = results || [];
      setDossiers(data.map(record => ({
        id: record.id,
        patient_id: record.patient_id,
        patient: record.patient_nom ?? 'Inconnu',
        dateAdmission: record.date_admission,
        dateCreation: record.date_creation,
        dateSortie: record.date_sortie,
        dateArrivee: record.date_admission ? new Date(record.date_admission).toLocaleDateString('fr-FR') : 'N/A',
        heureArrivee: record.date_admission ? new Date(record.date_admission).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
        hospital: record.hospital_nom ?? 'N/A',
        enregistrator: record.enregistrator_nom ?? 'N/A',
        triage: record.triage_data?.autre_categorie_outil_triage ?? 'Non spécifié',
        statut: record.statut ?? 'Non défini',
        numero_dossier: record.numero_dossier ?? 'Non spécifié',
        suite_procedure: record.suite_procedure ?? '',
        est_en_cours: record.est_en_cours ?? false,
        duree_sejour: record.duree_sejour || calculateDureeSejourVisuelle(record.date_admission, record.date_sortie),
        motif_consultation: record.motif_consultation ?? 'Non renseigné',
        rawData: record // Garder les données brutes pour les détails
      })));
    } catch (error) {
      console.error('Erreur lors de la récupération:', error);
      setError('Erreur lors de la récupération des dossiers patients.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatientsTraumatologieRecords();
    return () => {
      setError(null);
    };
  }, [fetchPatientsTraumatologieRecords]);

  // Extraction des valeurs uniques pour les filtres
  const filterOptions = useMemo(() => {
    const options = {
      statut: [...new Set(dossiers.map(d => d.statut).filter(Boolean))],
      hospital: [...new Set(dossiers.map(d => d.hospital).filter(Boolean))],
      suite_procedure: [...new Set(dossiers.map(d => d.suite_procedure).filter(Boolean))],
      motif_consultation: [...new Set(dossiers.map(d => d.motif_consultation).filter(s => s !== 'Non renseigné' && s))]
    };
    return options;
  }, [dossiers]);

  // Application des filtres et recherche
  const filteredDossiers = useMemo(() => {
    return dossiers.filter(dossier => {
      // Recherche textuelle
      const searchLower = searchTerm.toLowerCase();
      const searchMatch = !searchTerm || (
        String(dossier.patient ?? '').toLowerCase().includes(searchLower) ||
        String(dossier.hospital ?? '').toLowerCase().includes(searchLower) ||
        String(dossier.numero_dossier ?? '').toLowerCase().includes(searchLower) ||
        String(dossier.motif_consultation ?? '').toLowerCase().includes(searchLower) ||
        String(dossier.enregistrator ?? '').toLowerCase().includes(searchLower)
      );

      // Filtres par statut
      const statutMatch = filters.statut.length === 0 || filters.statut.includes(dossier.statut);

      // Filtres par hôpital
      const hospitalMatch = filters.hospital.length === 0 || filters.hospital.includes(dossier.hospital);

      // Filtres par suite de procédure
      const suiteMatch = filters.suite_procedure.length === 0 || filters.suite_procedure.includes(dossier.suite_procedure);

      // Filtres par motif de consultation
      const motifMatch = filters.motif_consultation.length === 0 || filters.motif_consultation.includes(dossier.motif_consultation);

      // Filtre par date (si implémenté)
      let dateMatch = true;
      if (filters.date_range.start && filters.date_range.end && dossier.dateAdmission) {
        const dossierDate = new Date(dossier.dateAdmission);
        const startDate = new Date(filters.date_range.start);
        const endDate = new Date(filters.date_range.end);
        dateMatch = dossierDate >= startDate && dossierDate <= endDate;
      }

      return searchMatch && statutMatch && hospitalMatch && suiteMatch && motifMatch && dateMatch;
    });
  }, [dossiers, searchTerm, filters]);

  // Statistiques améliorées
  const stats = useMemo(() => {
    const total = dossiers.length;
    const enCours = dossiers.filter(d => d.est_en_cours === true).length;
    const critiques = dossiers.filter(d => d.statut?.toLowerCase() === 'critique').length;
    const fermes = dossiers.filter(d => d.statut?.toLowerCase() === 'ferme').length;
    const transferts = dossiers.filter(d => d.suite_procedure === 'transfert').length;
    const hospitalisations = dossiers.filter(d => d.suite_procedure === 'hospitalisation').length;
    const retourDomicile = dossiers.filter(d => d.suite_procedure === 'domicile').length;

    return {
      total,
      enCours,
      critiques,
      fermes,
      transferts,
      hospitalisations,
      retourDomicile
    };
  }, [dossiers]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Gestion des filtres
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: typeof value === 'string' ?
        (prev[filterType].includes(value) ?
          prev[filterType].filter(v => v !== value) :
          [...prev[filterType], value]
        ) : value
    }));
    setPage(0);
  };

  const clearFilters = () => {
    setFilters({
      statut: [],
      hospital: [],
      suite_procedure: [],
      motif_consultation: [],
      date_range: {
        start: null,
        end: null
      }
    });
    setSearchTerm('');
    setPage(0);
  };

  const activeFiltersCount = useMemo(() => {
    return filters.statut.length + filters.hospital.length + filters.suite_procedure.length + filters.motif_consultation.length;
  }, [filters]);


  const handleChange = useCallback((section, field) => (eventOrValue) => {
    const value = typeof eventOrValue === 'object' && eventOrValue !== null && 'target' in eventOrValue
      ? eventOrValue.target.type === 'checkbox' ? eventOrValue.target.checked : (eventOrValue.target.value === '' ? null : eventOrValue.target.value)
      : eventOrValue;
    setFormData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section] || {},
        [field]: value
      }
    }));
  }, []);

  const handleChangeNoSection = useCallback((field) => (eventOrValue) => {
    const value = typeof eventOrValue === 'object' && eventOrValue !== null && 'target' in eventOrValue
      ? eventOrValue.target.type === 'checkbox' ? eventOrValue.target.checked : (eventOrValue.target.value === '' ? null : eventOrValue.target.value)
      : eventOrValue;
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  }, []);

  const handleDateChange = useCallback((section, field) => (date) => {
    if (!dayjs(date).isValid()) {
      console.warn("La date reçue est invalide.");
      return;
    }
    const formattedValue =
      field.includes("date") ? dayjs(date).format("YYYY-MM-DD") :
        field.includes("heure") ? dayjs(date).format("HH:mm") :
          date;
    setFormData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section] || {},
        [field]: formattedValue
      }
    }));
  }, []);

  const handleGlasgowChange = (field) => (event) => {
    const value = event.target.value === '' ? null : parseInt(event.target.value);
    setFormData(prevData => {
      const updatedForm = {
        ...prevData,
        evaluation_abcde_data: {
          ...prevData.evaluation_abcde_data,
          [field]: value
        }
      };
      const yeux = parseInt(updatedForm.evaluation_abcde_data.score_glasgow_yeux || 0);
      const verbal = parseInt(updatedForm.evaluation_abcde_data.score_glasgow_verbal || 0);
      const motricite = parseInt(updatedForm.evaluation_abcde_data.score_glasgow_motricite || 0);
      updatedForm.evaluation_abcde_data.score_glasgow_total = (isNaN(yeux) ? 0 : yeux) + (isNaN(verbal) ? 0 : verbal) + (isNaN(motricite) ? 0 : motricite);
      return updatedForm;
    });
  };

  const validateForm = (stepIndex) => {
    const errors = [];

    if (!editingDossier) {
      if (stepIndex === 0) {
        if (!formData.patient) {
          errors.push("L'ID du patient est requis. Veuillez sélectionner ou créer un patient.");
        }
        if (!formData.hospital) {
          errors.push("L'ID de l'hôpital est requis.");
        }
      }

      if (formData.signes_vitaux_data) {
        const { pression_arterielle_systolique, pression_arterielle_diastolique } = formData.signes_vitaux_data;
        if (pression_arterielle_systolique && pression_arterielle_diastolique) {
          if (pression_arterielle_systolique <= pression_arterielle_diastolique) {
            errors.push("La pression systolique doit être supérieure à la pression diastolique.");
          }
        }
      }

      if (formData.evaluation_abcde_data) {
        const { score_glasgow_total } = formData.evaluation_abcde_data;
        if (score_glasgow_total && (score_glasgow_total < 3 || score_glasgow_total > 15)) {
          errors.push("Le score Glasgow doit être entre 3 et 15.");
        }
      }

      if (formData.triage_data?.triage_effectue && !formData.triage_data?.outil_triage) {
        errors.push("L'outil de triage est requis si le triage est effectué.");
      }

      if (formData.disposition_unite_urgence_data?.sortie_su === 'autre' &&
        !formData.disposition_unite_urgence_data?.autre_sortie_su) {
        errors.push("Précisez la sortie SU si 'autre' est sélectionné.");
      }
    }
    return errors;
  };

  const handleNext = useCallback(() => {
    const errors = validateForm(activeStep);
    if (errors.length > 0) {
      setError(errors.join(' '));
      return;
    }
    setError(null);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, [activeStep, formData, editingDossier]);

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError(null);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData(initialFormData);
    setEditingDossier(null);
    setError(null);
  };

  const handleDialogOpen = async (dossier = null, type = '') => {
    if (dossier && (type === 'edit' || type === 'change-decision')) {
      try {
        const data = await apiTogetById(`traumatologie/traumatologie-dossiers/`, dossier.id);
        // Mapper les données de l'API vers la structure du formulaire
        const mappedFormData = {
          // Données de base
          motif_consultation: data.motif_consultation || "",
          commentaires_generaux: data.commentaires_generaux || "",

          // Informations variantes du patient
          information_variant_patient_data: {
            mode_arrivee: data.information_variant_patient?.mode_arrivee || '',
            autre_mode_arrivee: data.information_variant_patient?.autre_mode_arrivee || '',
            nombre_frequentations_medicales: data.information_variant_patient?.nombre_frequentations_medicales || null,
            classification_profession: data.information_variant_patient?.classification_profession || '',
            profession_specifique: data.information_variant_patient?.profession_specifique || '',
            domicile: data.information_variant_patient?.domicile || '',
            residence_secondaire: data.information_variant_patient?.residence_secondaire || '',
            lieu_accident: data.information_variant_patient?.lieu_accident || '',
            geolocalisation: {
              latitude: data.information_variant_patient?.geolocalisation?.latitude || null,
              longitude: data.information_variant_patient?.geolocalisation?.longitude || null,
              description: data.information_variant_patient?.geolocalisation?.description || ""
            },
            accident_de_masse: data.information_variant_patient?.accident_de_masse || false
          },

          // Signes vitaux
          signes_vitaux_data: {
            signes_de_vie: data.signes_vitaux?.signes_de_vie ?? true,
            pression_arterielle_systolique: data.signes_vitaux?.pression_arterielle_systolique || null,
            pression_arterielle_diastolique: data.signes_vitaux?.pression_arterielle_diastolique || null,
            frequence_cardiaque: data.signes_vitaux?.frequence_cardiaque || null,
            saturation_oxygene: data.signes_vitaux?.saturation_oxygene || null,
            administration_oxygene: data.signes_vitaux?.administration_oxygene || '',
            frequence_respiratoire: data.signes_vitaux?.frequence_respiratoire || null
          },

          // Évaluation ABCDE
          evaluation_abcde_data: {
            evda_initiale: data.evaluation_abcde?.evda_initiale || '',
            score_glasgow_yeux: data.evaluation_abcde?.score_glasgow_yeux || null,
            score_glasgow_verbal: data.evaluation_abcde?.score_glasgow_verbal || null,
            score_glasgow_motricite: data.evaluation_abcde?.score_glasgow_motricite || null,
            score_glasgow_total: data.evaluation_abcde?.score_glasgow_total || null,
            glasgow_qualifie: data.evaluation_abcde?.glasgow_qualifie || false,
            nombre_reaction_pupillaire: data.evaluation_abcde?.nombre_reaction_pupillaire || null
          },

          // Triage
          triage_data: {
            triage_effectue: data.triage?.triage_effectue || false,
            outil_triage: data.triage?.outil_triage || '',
            autre_outil_triage: data.triage?.autre_outil_triage || '',
            autre_categorie_outil_triage: data.triage?.autre_categorie_outil_triage || ""
          },

          // Historique médical
          historique_medical_data: {
            nombre_comorbidites: data.historique_medical?.nombre_comorbidites || null,
            patiente_enceinte: data.historique_medical?.patiente_enceinte || false
          },

          // Historique maladie actuelle
          historique_maladie_actuelle_data: {
            date_accident: data.historique_maladie_actuelle?.date_accident || null,
            hma_lieu_accident: data.historique_maladie_actuelle?.hma_lieu_accident || '',
            autre_lieu_accident: data.historique_maladie_actuelle?.autre_lieu_accident || '',
            activite_lors_accident: data.historique_maladie_actuelle?.activite_lors_accident || '',
            autre_activite_lors_accident: data.historique_maladie_actuelle?.autre_activite_lors_accident || '',
            mecanisme_accident: data.historique_maladie_actuelle?.mecanisme_accident || '',
            autre_mecanisme_accident: data.historique_maladie_actuelle?.autre_mecanisme_accident || '',
            materiel_protection: data.historique_maladie_actuelle?.materiel_protection || '',
            autre_materiel_protection: data.historique_maladie_actuelle?.autre_materiel_protection || '',
            mecanisme_supplementaire: data.historique_maladie_actuelle?.mecanisme_supplementaire || false,
            protection_utilisee: data.historique_maladie_actuelle?.protection_utilisee || false,
            intentionnel: data.historique_maladie_actuelle?.intentionnel || false,
            soins_prehospitaliers: data.historique_maladie_actuelle?.soins_prehospitaliers || false,
            prise_en_charge_medical_lieu_accident_lors_transport: data.historique_maladie_actuelle?.prise_en_charge_medical_lieu_accident_lors_transport || false,
            hma_autre_mode_arrivee: data.historique_maladie_actuelle?.hma_autre_mode_arrivee || false,
            procedure_supplementaire: data.historique_maladie_actuelle?.procedure_supplementaire || false,
            consommation_substance: data.historique_maladie_actuelle?.consommation_substance || '',
            consommation_alcool: data.historique_maladie_actuelle?.consommation_alcool || ""
          },

          // Blessures
          blessures_data: {
            checklist_trauma_utilisee: data.blessures?.checklist_trauma_utilisee || false,
            blessure_supplementaire: data.blessures?.blessure_supplementaire || false,
            details: data.blessures?.details || []
          },

          // Médicaments et liquides
          interventions_urgences_medicaments_liquide_data: {
            medicaments_liquide_administres: data.interventions_medicaments_liquide?.medicaments_liquide_administres || false,
            medicaments_liquide_types: data.interventions_medicaments_liquide?.medicaments_liquide_types || [],
            medicaments_liquide_autre: data.interventions_medicaments_liquide?.medicaments_liquide_autre || ""
          },

          // Procédures
          interventions_urgences_procedures_data: {
            procedures: data.interventions_procedures?.procedures || false,
            procedures_types: data.interventions_procedures?.procedures_types || [],
            procedures_autre: data.interventions_procedures?.procedures_autre || ""
          },

          // Tests diagnostiques
          interventions_urgences_tests_diagnostiques_data: {
            tests_diagnostiques: data.interventions_tests_diagnostiques?.tests_diagnostiques || false,
            tests_diagnostiques_types: data.interventions_tests_diagnostiques?.tests_diagnostiques_types || [],
            tests_diagnostiques_autre: data.interventions_tests_diagnostiques?.tests_diagnostiques_autre || null
          },

          // Disposition unité urgence
          disposition_unite_urgence_data: {
            sortie_su: data.disposition_unite_urgence?.sortie_su || '',
            autre_sortie_su: data.disposition_unite_urgence?.autre_sortie_su || '',
            consignes_domicile: data.disposition_unite_urgence?.consignes_domicile || '',
            accompagnant: data.disposition_unite_urgence?.accompagnant || '',
            rdv_controle: data.disposition_unite_urgence?.rdv_controle || '',
            diagnostique_hospitalisation: data.disposition_unite_urgence?.diagnostique_hospitalisation || '',
            numero_chambre_lit: data.disposition_unite_urgence?.numero_chambre_lit || null,
            hopital_transfert: data.disposition_unite_urgence?.hopital_transfert || '',
            autre_hopital: data.disposition_unite_urgence?.autre_hopital || '',
            service_transfert: data.disposition_unite_urgence?.service_transfert || '',
            autre_service_transfert: data.disposition_unite_urgence?.autre_service_transfert || '',
            motif_transfert: data.disposition_unite_urgence?.motif_transfert || '',
            cause_deces: data.disposition_unite_urgence?.cause_deces || '',
          }
        };
        setFormData(mappedFormData);
        setEditingDossier(dossier);
        if (type === 'change-decision') {
          setDialogType('change-decision');
        }
        else {
          setDialogType('edit');
        }
        setDialogOpen(true);
      } catch (err) {
        setError("Impossible de charger les dossier du patient.");
      }
    } else if (dossier && type === 'delete') {
      setDialogType('delete');
      setDialogOpen(true);
      setDossierToDelete(dossier)
    } else {
      setDialogType('create');
      setDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setActiveStep(0);
    setEditingDossier(null);
    setError(null);
  };

  const handleViewDialogOpen = (dossier) => {
    setSelectedDossier(dossier);
    setViewDialogOpen(true);
  };

  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
    setSelectedDossier(null);
  };

  const cleanFormData = (data) => {
    const cleaned = { ...data };
    Object.keys(cleaned).forEach(key => {
      if (cleaned[key] && cleaned[key].undefined) {
        delete cleaned[key].undefined;
      }
    });
    return cleaned;
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join(' '));
      return;
    }

    const cleanedFormData = cleanFormData(formData);
    const dataToSend = JSON.parse(JSON.stringify(cleanedFormData));

    try {
      let responseRecord;

      if (editingDossier) {
        console.log('Editing dossier:', dataToSend);
        responseRecord = await apiToPatch(`traumatologie/traumatologie-dossiers/`, editingDossier.id, dataToSend);

        const bedId = dataToSend.disposition_unite_urgence_data?.numero_chambre_lit;

        if (responseRecord && bedId && typeof bedId === 'number' && bedId > 0) {
          try {
            console.log('Tentative de mise à jour du lit ID:', bedId);
            await apiToPatch(`services/beds/`, bedId, { is_occupied: true });
            console.log('Lit mis à jour avec succès');
          } catch (bedError) {
            console.error('Erreur lors de la mise à jour du lit:', bedError);
          }
        }
        setDossiers(dossiers.map(p =>
          p.id === editingDossier.id
            ? { ...p, ...responseRecord }
            : p
        ));
      } else {
        console.log('Creating new dossier:', dataToSend);
        responseRecord = await apiToPost('traumatologie/traumatologie-dossiers/', dataToSend);
        const bedId = dataToSend.disposition_unite_urgence_data?.numero_chambre_lit;

        if (responseRecord && bedId && typeof bedId === 'number' && bedId > 0) {
          try {
            console.log('Tentative de mise à jour du lit ID:', bedId);
            await apiToPatch(`services/beds/`, bedId, { is_occupied: true });
            console.log('Lit mis à jour avec succès');
          } catch (bedError) {
            console.error('Erreur lors de la mise à jour du lit:', bedError);
          }
        }
        if (responseRecord) {
          setDossiers(prevDossiers => [...prevDossiers, responseRecord]);
        }
      }

      fetchPatientsTraumatologieRecords();
      handleDialogClose();

    } catch (error) {
      console.group("📌 Erreur lors de la soumission");
      console.log("Statut HTTP :", error.response?.status);
      console.log("Détails DRF :", error.response?.data);
      console.groupEnd();

      let errorMessage = 'Une erreur est survenue. Veuillez réessayer.';

      if (error.response?.status === 400) {
        const details = error.response.data;
        if (typeof details === "object") {
          errorMessage = Object.entries(details)
            .map(([field, msgs]) => `${field} : ${msgs.join(', ')}`)
            .join(' | ');
        } else {
          errorMessage = details;
        }
      } else if (error.response?.status === 500) {
        errorMessage = 'Erreur serveur. Veuillez contacter l\'administrateur.';
      } else {
        errorMessage = error.message || JSON.stringify(error.response?.data);
      }

      setError(`Échec de la soumission du dossier : ${errorMessage}`);
    }
  };

  const handleDeleteDossier = async (id) => {
    try {
      await apiToDelete(`traumatologie/traumatologie-dossiers/`, id);
      setDossiers(dossiers.filter(d => d.id !== id));
      setDialogOpen(false);
      setDossierToDelete(null);
    } catch (error) {
      console.error('Erreur suppression:', error);
      setError('Erreur lors de la suppression du dossier patient.');
    }
  };

  const getStatusColor = (status) => {
    if (!status || typeof status !== 'string') {
      return theme.palette.info.main;
    }

    switch (status.toLowerCase()) {
      case 'critique':
        return theme.palette.error.main;
      case 'ouvert':
      case 'en cours':
        return theme.palette.warning.main;
      case 'stable':
        return theme.palette.success.main;
      case 'ferme':
      case 'terminé':
        return theme.palette.grey[500];
      default:
        return theme.palette.info.main;
    }
  };
  const steps = [
    ...(editingDossier ? [] : [{
      label: 'Informations Patient & Hôpital',
      content: (
        <Suspense fallback={<div>Chargement...</div>}>
          <InformationsPatient
            setPatient={setPatient}
            formData={formData}
            handleChangeNoSection={handleChangeNoSection}
            handleNext={handleNext}
            setError={memoizedSetError}
          />
        </Suspense>
      )
    }]),
    {
      label: 'Informations Variantes Patient',
      content: (
        <Suspense fallback={<div>Chargement...</div>}>
          <InformationsVariantesPatient
            AdapterDateFns={AdapterDateFns}
            handleChangeNoSection={handleChangeNoSection}
            formData={formData}
            handleChange={handleChange}
            handleDateChange={handleDateChange}
            editingDossier={editingDossier}
            patient={patient}
          />
        </Suspense>
      )
    },
    {
      label: 'Signes Vitaux',
      content: (
        <Suspense fallback={<div>Chargement...</div>}>
          <SignesVitaux
            formData={formData}
            handleChange={handleChange}
            setError={memoizedSetError}
            editingDossier={editingDossier}
            patient={patient}
          />
        </Suspense>
      )
    },
    {
      label: 'Évaluation ABCDE',
      content: (
        <Suspense fallback={<div>Chargement...</div>}>
          <EvaluationABCDE
            formData={formData}
            handleChange={handleChange}
            handleGlasgowChange={handleGlasgowChange}
            setError={memoizedSetError}
            editingDossier={editingDossier}
            patient={patient}
          />
        </Suspense>
      )
    },
    {
      label: 'Triage',
      content: (
        <Suspense fallback={<div>Chargement...</div>}>
          <Triage
            formData={formData}
            handleChange={handleChange}
            setError={memoizedSetError}
            editingDossier={editingDossier}
            patient={patient}
          />
        </Suspense>
      )
    },
    {
      label: 'Historique Médical',
      content: (
        <Suspense fallback={<div>Chargement...</div>}>
          <HistoriqueMedical
            formData={formData}
            handleChange={handleChange}
            setError={memoizedSetError}
            editingDossier={editingDossier}
            patient={patient}
          />
        </Suspense>
      )
    },
    {
      label: 'Historique Maladie Actuelle',
      content: (
        <Suspense fallback={<div>Chargement...</div>}>
          <HistoriqueMaladieActuelle
            AdapterDateFns={AdapterDateFns}
            formData={formData}
            handleChange={handleChange}
            handleDateChange={handleDateChange}
            editingDossier={editingDossier}
            patient={patient}
          />
        </Suspense>
      )
    },
    {
      label: 'Blessures',
      content: (
        <Suspense fallback={<div>Chargement...</div>}>
          <Blessures
            formData={formData}
            handleChange={handleChange}
            editingDossier={editingDossier}
            patient={patient}
          />
        </Suspense>
      )
    },
    {
      label: 'Médicaments et Liquides',
      content: (
        <Suspense fallback={<div>Chargement...</div>}>
          <MedicamentsLiquides
            formData={formData}
            handleChange={handleChange}
            setError={memoizedSetError}
            editingDossier={editingDossier}
            patient={patient}
          />
        </Suspense>
      )
    },
    {
      label: 'Procédures',
      content: (
        <Suspense fallback={<div>Chargement...</div>}>
          <Procedures
            formData={formData}
            handleChange={handleChange}
            setError={memoizedSetError}
            editingDossier={editingDossier}
            patient={patient}
          />
        </Suspense>
      )
    },
    {
      label: 'Tests Diagnostiques',
      content: (
        <Suspense fallback={<div>Chargement...</div>}>
          <TestsDiagnostiques
            formData={formData}
            handleChange={handleChange}
            setError={memoizedSetError}
            editingDossier={editingDossier}
            patient={patient}
          />
        </Suspense>
      )
    },
    {
      label: "Décision du service d'urgence",
      content: (
        <Suspense fallback={<div>Chargement...</div>}>
          <DispositionUniteUrgence
            AdapterDateFns={AdapterDateFns}
            formData={formData}
            handleChange={handleChange}
            handleDateChange={handleDateChange}
            setError={memoizedSetError}
            editingDossier={editingDossier}
            patient={patient}
          />
        </Suspense>
      )
    }
  ];

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <activeService.icon sx={{ mr: 2, fontSize: 30 }} color="primary" />
        <Typography variant="h6" fontWeight="bold">
          Centre de {activeService.text}
        </Typography>
      </Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Gérez les dossiers des patients admis au service de {activeService.text}. Utilisez les filtres et la barre de recherche pour trouver rapidement un dossier spécifique.
      </Typography>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Performance Indicators */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <Assignment />
              </Avatar>
              <Box>
                <Typography color="textSecondary" variant="body2">
                  Total Dossiers
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {stats.total}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                <Person />
              </Avatar>
              <Box>
                <Typography color="textSecondary" variant="body2">
                  En Cours
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {stats.enCours}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                <LocalHospitalIcon />
              </Avatar>
              <Box>
                <Typography color="textSecondary" variant="body2">
                  Cas Critiques
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {stats.critiques}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                <HealingRounded />
              </Avatar>
              <Box>
                <Typography color="textSecondary" variant="body2">
                  Cas Fermés
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {stats.fermes}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Toolbar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
          <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: { xs: '100%', sm: 400 }, boxShadow: 2 }}
          >
            <IconButton sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Rechercher par patient, hôpital, N° dossier..."
              inputProps={{ 'aria-label': 'rechercher un dossier' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <IconButton sx={{ p: '10px' }} onClick={() => setSearchTerm('')}>
                <ClearIcon />
              </IconButton>
            )}
          </Paper>
          {activeFiltersCount > 0 && (
            <Chip
              label={`${activeFiltersCount} filtre(s) actif(s)`}
              onDelete={clearFilters}
              color="primary"
              variant="outlined"
            />
          )}
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchPatientsTraumatologieRecords}
            disabled={loading}
            sx={{ height: 40 }}
          >
            Actualiser
          </Button>
          <Badge badgeContent={activeFiltersCount} color="primary">
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={handleFilterClick}
              sx={{ height: 40 }}
            >
              Filtres
            </Button>
          </Badge>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleDialogOpen(null, 'create')}
            sx={{ height: 40 }}
          >
            Nouveau dossier
          </Button>
        </Stack>
      </Box>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        PaperProps={{ sx: { width: 320, maxHeight: 400 } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Filtrer les dossiers
          </Typography>
          <FormControl fullWidth margin="normal" size="small">
            <InputLabel>Statut</InputLabel>
            <Select
              multiple
              value={filters.statut}
              onChange={(e) => handleFilterChange('statut', e.target.value)}
              renderValue={(selected) => selected.join(', ')}
            >
              {filterOptions.statut.map((status) => (
                <MenuItem key={status} value={status}>
                  <Checkbox checked={filters.statut.includes(status)} />
                  <ListItemText primary={getStatutInfo(status).label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" size="small">
            <InputLabel>Hôpital</InputLabel>
            <Select
              multiple
              value={filters.hospital}
              onChange={(e) => handleFilterChange('hospital', e.target.value)}
              renderValue={(selected) => selected.join(', ')}
            >
              {filterOptions.hospital.map((hospital) => (
                <MenuItem key={hospital} value={hospital}>
                  <Checkbox checked={filters.hospital.includes(hospital)} />
                  <ListItemText primary={hospital} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" size="small">
            <InputLabel>Suite de procédure</InputLabel>
            <Select
              multiple
              value={filters.suite_procedure}
              onChange={(e) => handleFilterChange('suite_procedure', e.target.value)}
              renderValue={(selected) => selected.map(s => handleSuiteProcedur(s).label).join(', ')}
            >
              {filterOptions.suite_procedure.map((procedure) => (
                <MenuItem key={procedure} value={procedure}>
                  <Checkbox checked={filters.suite_procedure.includes(procedure)} />
                  <ListItemText primary={handleSuiteProcedur(procedure).label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" size="small">
            <InputLabel>Motif de consultation</InputLabel>
            <Select
              multiple
              value={filters.motif_consultation}
              onChange={(e) => handleFilterChange('motif_consultation', e.target.value)}
              renderValue={(selected) => selected.join(', ')}
            >
              {filterOptions.motif_consultation.map((motif) => (
                <MenuItem key={motif} value={motif}>
                  <Checkbox checked={filters.motif_consultation.includes(motif)} />
                  <ListItemText primary={motif} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button size="small" onClick={clearFilters} startIcon={<ClearIcon />}>
              Tout effacer
            </Button>
            <Button size="small" variant="contained" onClick={handleFilterClose}>
              Appliquer
            </Button>
          </Stack>
        </Box>
      </Menu>

      {/* Data Table */}
      <Paper sx={{ width: '100%', mb: 2, boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
        {loading && <LinearProgress />}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
                <TableCell sx={{ fontWeight: 'bold', minWidth: 180 }}>Patient</TableCell>
                <TableCell sx={{ fontWeight: 'bold', minWidth: 140 }}>N° Dossier</TableCell>
                <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Admission</TableCell>
                <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Durée</TableCell>
                <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Établissement</TableCell>
                <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Décision</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: 120 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDossiers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((dossier) => {
                  const suiteInfo = handleSuiteProcedur(dossier.suite_procedure);

                  return (
                    <TableRow
                      key={dossier.id}
                      hover
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        backgroundColor: dossier.statut === 'critique' ? alpha(theme.palette.error.main, 0.05) : 'inherit'
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ bgcolor: getStatusColor(dossier.statut), width: 32, height: 32, fontSize: '0.875rem' }}>
                            {String(dossier.patient ?? '').split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'medium', lineHeight: 1.2 }}>
                              {dossier.patient}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {dossier.numero_dossier}
                        </Typography>
                        {dossier.est_en_cours && (
                          <Chip
                            label="Actif"
                            size="small"
                            color="success"
                            variant="outlined"
                            sx={{ mt: 0.5, height: 18 }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarTodayIcon fontSize="small" color="action" />
                          <Box>
                            <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
                              {dossier.dateArrivee}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {dossier.heureArrivee}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium" color={dossier.est_en_cours ? "primary" : "text.secondary"}>
                          {dossier.duree_sejour}
                        </Typography>
                        {dossier.est_en_cours && (
                          <Typography variant="caption" color="primary">
                            En cours
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocalHospitalIcon fontSize="small" color="action" />
                          <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
                            {dossier.hospital}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={suiteInfo.label}
                          size="small"
                          color={suiteInfo.color}
                          variant="outlined"
                          sx={{ fontWeight: 'medium', minWidth: 100 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                          <Tooltip title="Voir détails">
                            <IconButton size="small" color="info" onClick={() => handleViewDialogOpen(dossier)}>
                              <OpenInNewRounded fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Modifier">
                            <IconButton size="small" color="default" onClick={() => handleDialogOpen(dossier, 'edit')}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Changer décision">
                            <IconButton size="small" color="primary" onClick={() => handleDialogOpen(dossier, 'change-decision')}>
                              <ChangeCircle fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Supprimer">
                            <IconButton size="small" color="error" onClick={() => handleDialogOpen(dossier, 'delete')}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {filteredDossiers.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Assignment sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        Aucun dossier trouvé
                      </Typography>
                      <Typography variant="body2" color="text.disabled">
                        {searchTerm || activeFiltersCount > 0
                          ? "Aucun dossier ne correspond à vos critères de recherche"
                          : "Commencez par créer un nouveau dossier patient"}
                      </Typography>
                      {(searchTerm || activeFiltersCount > 0) && (
                        <Button
                          variant="outlined"
                          onClick={clearFilters}
                          sx={{ mt: 2 }}
                          startIcon={<ClearIcon />}
                        >
                          Effacer les filtres
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredDossiers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page :"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count} ${count > 1 ? 'dossiers' : 'dossier'}`}
          sx={{ '& p': { mb: 0 }, borderTop: `1px solid ${theme.palette.divider}` }}
        />
      </Paper>

      {/* Results Summary */}
      {filteredDossiers.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {filteredDossiers.length} dossier{filteredDossiers.length > 1 ? 's' : ''}
            {searchTerm || activeFiltersCount > 0 ? ' trouvé' + (filteredDossiers.length > 1 ? 's' : '') : ' au total'}
          </Typography>
          {(searchTerm || activeFiltersCount > 0) && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary">Filtres appliqués:</Typography>
              {searchTerm && (
                <Chip label={`"${searchTerm}"`} size="small" onDelete={() => setSearchTerm('')} />
              )}
              {filters.statut.map(status => (
                <Chip
                  key={status}
                  label={`Statut: ${getStatutInfo(status).label}`}
                  size="small"
                  onDelete={() => handleFilterChange('statut', filters.statut.filter(s => s !== status))}
                />
              ))}
              {filters.hospital.map(hospital => (
                <Chip
                  key={hospital}
                  label={`Hôpital: ${hospital}`}
                  size="small"
                  onDelete={() => handleFilterChange('hospital', filters.hospital.filter(h => h !== hospital))}
                />
              ))}
            </Stack>
          )}
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      {dossierToDelete && (
        <Dialog
          open={dialogOpen && dialogType === 'delete'}
          onClose={handleDialogClose}
          maxWidth="sm"
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DeleteIcon color="error" />
              Confirmer la suppression
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Êtes-vous sûr de vouloir supprimer définitivement le dossier suivant ?
            </Typography>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                Dossier N° : {dossierToDelete.numero_dossier}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Patient : {dossierToDelete.patient}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hôpital : {dossierToDelete.hospital}
              </Typography>
            </Box>
            <Alert severity="warning" sx={{ mt: 2 }}>
              Cette action est irréversible. Toutes les données du dossier seront définitivement perdues.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Annuler
            </Button>
            <Button
              onClick={() => handleDeleteDossier(dossierToDelete.id)}
              color="error"
              variant="contained"
              startIcon={<DeleteIcon />}
            >
              Supprimer définitivement
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={dialogOpen && (dialogType === 'edit' || dialogType === 'create')}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="md"
        scroll="paper"
      >
        <DialogTitle
          sx={{
            color: 'white',
            position: 'relative',
            zIndex: 1400,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {editingDossier ? <EditIcon /> : <AddIcon />}
            {editingDossier
              ? `Modification du dossier : ${editingDossier.patient}`
              : (patient
                ? `Nouveau dossier pour : ${patient.first_name ?? ''} ${patient.last_name ?? ''}`
                : 'Nouveau dossier : Sélection du patient'
              )}
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel optional={index === steps.length - 1 ? <Typography variant="caption">Dernière étape</Typography> : null}>
                  {step.label}
                </StepLabel>
                <StepContent>
                  <form onSubmit={index === steps.length - 1 ? handleFormSubmit : undefined}>
                    {step.content}
                    {!editingDossier && index === 0 ? null : (
                      <Box sx={{ mb: 2 }}>
                        <Button
                          variant="contained"
                          type={index === steps.length - 1 ? 'submit' : 'button'}
                          onClick={index === steps.length - 1 ? undefined : handleNext}
                          sx={{ mt: 1, mr: 1 }}
                          disabled={loading}
                        >
                          {index === steps.length - 1
                            ? (editingDossier ? 'Mettre à jour' : 'Créer le dossier')
                            : 'Continuer'}
                        </Button>
                        <Button
                          disabled={index === 0}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Retour
                        </Button>
                      </Box>
                    )}
                  </form>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length && (
            <Paper square elevation={0} sx={{ p: 3 }}>
              <Typography gutterBottom>Toutes les étapes sont complétées !</Typography>
              <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                Recommencer
              </Button>
            </Paper>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant="outlined">
            Annuler
          </Button>
        </DialogActions>
      </Dialog>

      {/* Decision Change Dialog */}
      {dialogOpen && (dialogType === 'change-decision') && (
        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ChangeCircle color="primary" />
              Changer la décision – {editingDossier.patient}
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Suspense fallback={<div>Chargement...</div>}>
              <DispositionUniteUrgence
                AdapterDateFns={AdapterDateFns}
                formData={formData}
                handleChange={handleChange}
                handleDateChange={handleDateChange}
                setError={memoizedSetError}
                editingDossier={editingDossier}
              />
            </Suspense>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} variant="outlined">Annuler</Button>
            <Button onClick={handleFormSubmit} variant="contained" color="primary">
              Sauvegarder
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Detailed View Dialog */}
      {viewDialogOpen && selectedDossier && (
        <DetailDialog
          open={viewDialogOpen}
          onClose={handleViewDialogClose}
          selectedDossier={selectedDossier}
        />
      )}
    </Box>
  );
}