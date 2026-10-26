import {
  AssignmentRounded,
  BusinessRounded,
  InventoryRounded,
  ShoppingCartRounded,
  PersonAddRounded,
  BlockRounded,
  HealingRounded,
  PeopleAltRounded,
  ScheduleRounded,
  StarRounded,
  SchoolRounded,
  WorkRounded,
  PersonRounded,
  MenuBookRounded,
  GroupRounded,
  LocalHospitalRounded,
  EmergencyRounded,
  TimelineRounded,
  BarChartRounded,
  FitnessCenterRounded,
  FavoriteRounded,
  MonitorHeartRounded,
  DescriptionRounded,
  PsychologyAltRounded,
  ChildCareRounded,
  VaccinesRounded,
  ShowChartRounded,
  MedicalServicesRounded,
  ContentCutRounded,
  MeetingRoomRounded,
  PregnantWomanRounded,
  EventNoteRounded,
  CribRounded,
  ScienceRounded,
  MedicationRounded,
  AirRounded,
  ImageRounded,
  PhotoCameraRounded,
  BiotechRounded,
  HistoryRounded,
  WarehouseRounded,
  AdminPanelSettingsRounded,
  AttachMoneyRounded,
  ComputerRounded,
  FolderSpecialRounded,
  PsychologyRounded,
} from "@mui/icons-material";


export const services = [
  // ===================== URGENCES =====================
  {
    id: "urgences",
    type: "service",
    link: "service/urgences",
    text: "Urgences",
    icon: LocalHospitalRounded,
    children: [
      { link: "service/urgences/dossier", text: "Dossier médical", icon: AssignmentRounded, children: [] },
      { link: "service/urgences/patients", text: "Gestion des patients", icon: GroupRounded, children: [] },
      { link: "service/urgences/triage", text: "Triage", icon: EmergencyRounded, children: [] },
      { link: "service/urgences/suivi", text: "Suivi des cas", icon: TimelineRounded, children: [] },
    ]
  },
  // ===================== TRAUMATOLOGIE =====================
  {
    id: "traumatologie",
    type: "service",
    link: "service/traumatologie",
    text: "Traumatologie",
    icon: HealingRounded,
    children: [
      { link: "service/traumatologie/dossier", text: "Dossier médical", icon: AssignmentRounded, children: [] },
      { link: "service/traumatologie/patients", text: "Gestion des patients", icon: GroupRounded, children: [] },
    ]
  },


  // ===================== CARDIOLOGIE =====================
  {
    id: "cardiologie",
    type: "service",
    link: "service/cardiologie",
    text: "Cardiologie",
    icon: FavoriteRounded,
    children: [
      { link: "service/cardiologie/dossier", text: "Dossier médical", icon: AssignmentRounded, children: [] },
      { link: "service/cardiologie/patients", text: "Gestion des patients", icon: GroupRounded, children: [] },
      { link: "service/cardiologie/examens", text: "Examens (ECG, échographie)", icon: MonitorHeartRounded, children: [] },
      { link: "service/cardiologie/prescriptions", text: "Prescriptions", icon: DescriptionRounded, children: [] },
    ]
  },

  // ===================== NEUROLOGIE =====================
  {
    id: "neurologie",
    type: "service",
    link: "service/neurologie",
    text: "Neurologie",
    icon: PsychologyRounded,
    children: [
      { link: "service/neurologie/dossier", text: "Dossier médical", icon: AssignmentRounded, children: [] },
      { link: "service/neurologie/patients", text: "Gestion des patients", icon: GroupRounded, children: [] },
      { link: "service/neurologie/examens", text: "Examens neurologiques", icon: PsychologyAltRounded, children: [] },
      { link: "service/neurologie/suivi", text: "Suivi pathologique", icon: TimelineRounded, children: [] },
    ]
  },

  // ===================== PÉDIATRIE =====================
  {
    id: "pediatrie",
    type: "service",
    link: "service/pediatrie",
    text: "Pédiatrie",
    icon: ChildCareRounded,
    children: [
      { link: "service/pediatrie/dossier", text: "Dossier médical", icon: AssignmentRounded, children: [] },
      { link: "service/pediatrie/patients", text: "Gestion des patients", icon: GroupRounded, children: [] },
      { link: "service/pediatrie/vaccinations", text: "Vaccinations", icon: VaccinesRounded, children: [] },
      { link: "service/pediatrie/suivi-croissance", text: "Suivi croissance", icon: ShowChartRounded, children: [] },
    ]
  },

  // ===================== CHIRURGIE =====================
  {
    id: "chirurgie",
    type: "service",
    link: "service/chirurgie",
    text: "Chirurgie",
    icon: MedicalServicesRounded,
    children: [
      { link: "service/chirurgie/dossier", text: "Dossier médical", icon: AssignmentRounded, children: [] },
      { link: "service/chirurgie/patients", text: "Gestion des patients", icon: GroupRounded, children: [] },
      { link: "service/chirurgie/operations", text: "Opérations", icon: ContentCutRounded, children: [] },
      { link: "service/chirurgie/salles", text: "Gestion des salles", icon: MeetingRoomRounded, children: [] },
    ]
  },

  // ===================== GYNÉCOLOGIE =====================
  {
    id: "gynecologie",
    type: "service",
    link: "service/gynecologie",
    text: "Gynécologie & Obstétrique",
    icon: PregnantWomanRounded,
    children: [
      { link: "service/gynecologie/dossier", text: "Dossier médical", icon: AssignmentRounded, children: [] },
      { link: "service/gynecologie/patients", text: "Gestion des patients", icon: GroupRounded, children: [] },
      { link: "service/gynecologie/consultations", text: "Consultations", icon: EventNoteRounded, children: [] },
      { link: "service/gynecologie/maternite", text: "Maternité", icon: CribRounded, children: [] },
    ]
  },

  // ===================== ONCOLOGIE =====================
  {
    id: "oncologie",
    type: "service",
    link: "service/oncologie",
    text: "Oncologie",
    icon: ScienceRounded,
    children: [
      { link: "service/oncologie/dossier", text: "Dossier médical", icon: AssignmentRounded, children: [] },
      { link: "service/oncologie/patients", text: "Gestion des patients", icon: GroupRounded, children: [] },
      { link: "service/oncologie/chimiotherapie", text: "Chimiothérapie", icon: MedicationRounded, children: [] },
      { link: "service/oncologie/suivi", text: "Suivi post-traitement", icon: TimelineRounded, children: [] },
    ]
  },

  // ===================== RÉANIMATION =====================
  {
    id: "reanimation",
    type: "service",
    link: "service/reanimation",
    text: "Réanimation",
    icon: MonitorHeartRounded,
    children: [
      { link: "service/reanimation/dossier", text: "Dossier médical", icon: AssignmentRounded, children: [] },
      { link: "service/reanimation/patients", text: "Gestion des patients", icon: GroupRounded, children: [] },
      { link: "service/reanimation/ventilation", text: "Gestion ventilation", icon: AirRounded, children: [] },
      { link: "service/reanimation/soins-intensifs", text: "Soins intensifs", icon: LocalHospitalRounded, children: [] },
    ]
  },

  // ===================== IMAGERIE =====================
  {
    id: "imagerie",
    type: "service",
    link: "service/imagerie",
    text: "Imagerie médicale",
    icon: ImageRounded,
    children: [
      { link: "service/imagerie/dossier", text: "Dossier médical", icon: AssignmentRounded, children: [] },
      { link: "service/imagerie/patients", text: "Gestion des patients", icon: GroupRounded, children: [] },
      { link: "service/imagerie/radiologie", text: "Radiologie", icon: PhotoCameraRounded, children: [] },
      { link: "service/imagerie/nucleaire", text: "Médecine nucléaire", icon: ScienceRounded, children: [] },
    ]
  },

  // ===================== LABORATOIRE =====================
  {
    id: "laboratoire",
    type: "service",
    link: "service/laboratoire",
    text: "Laboratoire",
    icon: BiotechRounded,
    children: [
      { link: "service/laboratoire/dossier", text: "Dossier médical", icon: AssignmentRounded, children: [] },
      { link: "service/laboratoire/patients", text: "Gestion des patients", icon: GroupRounded, children: [] },
      { link: "service/laboratoire/analyses", text: "Analyses", icon: BiotechRounded, children: [] },
      { link: "service/laboratoire/resultats", text: "Résultats", icon: DescriptionRounded, children: [] },
    ]
  },

  // ===================== LOGISTIQUE =====================
  {
    id: "logistique",
    type: "service",
    link: "service/logistique",
    text: "Logistique",
    icon: BusinessRounded,
    children: [
      { link: "service/logistique/article", text: "Article", icon: InventoryRounded, children: [] },
      { link: "service/logistique/commande", text: "Commande", icon: ShoppingCartRounded, children: [] },
    ]
  },

  // ===================== ADMINISTRATION =====================
  {
    id: "administration",
    type: "service",
    link: "service/administration",
    text: "Administration",
    icon: AdminPanelSettingsRounded,
    children: [
      { link: "service/administration/rh", text: "Ressources humaines", icon: PeopleAltRounded, children: [] },
      { link: "service/administration/comptabilite", text: "Comptabilité", icon: AttachMoneyRounded, children: [] },
      { link: "service/administration/informatique", text: "Informatique", icon: ComputerRounded, children: [] },
      { link: "service/administration/archives", text: "Archives médicales", icon: FolderSpecialRounded, children: [] },
    ]
  }
];


export const utilisateurs = [
  { id: "liste", type: "utilisateur", link: "utilisateur/liste", text: "Personnel", icon: PeopleAltRounded, children: [] },
  { id: "bloque", type: "utilisateur", link: "utilisateur/bloque", text: "Bloqué", icon: BlockRounded, children: [] },
  { id: "demande", type: "utilisateur", link: "utilisateur/demande", text: "Demande", icon: PersonAddRounded, children: [] },
];

export const monprofile = [
  {
    id: "info-personnelle", type: "monprofile",
    link: "monprofile/info-personnelle",
    text: "Info personnelles",
    icon: PersonRounded,
    children: [],
  },
  {
    id: "info-professionnelle", type: "monprofile",
    link: "monprofile/info-professionnelle",
    text: "Info professionnelles",
    icon: WorkRounded,
    children: [],
  },
  {
    id: "biographie", type: "monprofile",
    link: "monprofile/biographie",
    text: "Biographie",
    icon: MenuBookRounded,
    children: [],
  },
  {
    id: "educ-certific", type: "monprofile",
    link: "monprofile/educ-certific",
    text: "Éducation",
    icon: SchoolRounded,
    children: [],
  },
  {
    id: "special-competence", type: "monprofile",
    link: "monprofile/special-competence",
    text: "Spécialités",
    icon: StarRounded,
    children: [],
  },
  {
    id: "horaire", type: "monprofile",
    link: "monprofile/horaire",
    text: "Horaires de travail",
    icon: ScheduleRounded,
    children: [],
  }
];