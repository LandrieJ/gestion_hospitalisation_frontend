import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Avatar,
  alpha,
  useTheme,
  TableSortLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Stack,
  Dialog,
  DialogTitle,
  Tooltip,
  DialogActions,
  DialogContent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ShoppingCartRounded,
  TrendingDown as TrendingDownIcon,
  Group as GroupIcon,
  MedicalServices as MedicalIcon,
  Receipt as ReceiptIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  OpenInNewRounded
} from '@mui/icons-material';
import { apiToDelete, apiTogetAll, apiToPatch, apiToPost } from '../../../../utils/ApiServices';
import { CommandeForm } from '../Components/CommandeForm';
import { CommandeDetail } from '../Components/CommandeDetail';


const typeBeneficiaireColors = {
  famille: 'primary',
  personnel: 'secondary',
  service: 'success'
};

const typeMouvementColors = {
  vente: 'success',
  don: 'info',
  usage_medical: 'error',
  formation: 'warning',
  maintenance: 'default',
  administration: 'secondary'
};

export const Commande = () => {
  const theme = useTheme();
  const [mouvements, setMouvements] = useState([]);
  const [page, setPage] = useState(0);
  const [articles, setArticles] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMouvement, setSelectedMouvement] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTypeBeneficiaire, setFilterTypeBeneficiaire] = useState('');
  const [filterTypeMouvement, setFilterTypeMouvement] = useState('');
  const [sortBy, setSortBy] = useState('date_mouvement');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSort = (field) => {
    const isAsc = sortBy === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(field);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMouvement(null);
  };

  const handleOpenDialog = (mode, mouvement) => {
    setSelectedMouvement(mouvement);
    setDialogMode(mode);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMouvement(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSaveMouvement = async (formData) => {
    const articlesPayload = formData.articles.map(a => ({
      article_id: typeof a.article === "object" ? a.article.id : a.article,
      quantite: a.quantite,
      prix_unitaire: a.prix_unitaire
    }));

    if (dialogMode === 'create') {
      const newMouvement = {
        type_beneficiaire: formData.type_beneficiaire,
        beneficiaire: formData.beneficiaire,
        contact: formData.contact,
        type_mouvement: formData.type_mouvement,
        commentaire: formData.commentaire,
        numero_mouvement: `MVT${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(mouvements.length + 1).padStart(3, '0')}`,
        articles: articlesPayload
      };
      const savedMouvement = await apiToPost('logistique/mouvements/', newMouvement);
      setMouvements([savedMouvement, ...mouvements]);
    } else if (dialogMode === 'edit' && selectedMouvement) {
      await apiToPatch(`logistique/mouvements/`, selectedMouvement.id, {
        ...formData,
        articles: articlesPayload
      });
      setMouvements(mouvements.map(m =>
        m.id === selectedMouvement.id
          ? { ...m, ...formData, montant_total: articlesPayload.reduce((sum, item) => sum + (item.quantite * item.prix_unitaire), 0) }
          : m
      ));
    }
    handleCloseDialog();
  };

  const handleDeleteMouvement = async () => {
    if (selectedMouvement) {
      await apiToDelete(`logistique/mouvements/`, selectedMouvement.id);
      setMouvements(mouvements.filter(m => m.id !== selectedMouvement.id));
      handleMenuClose();
    }
  };

  const filteredMouvements = mouvements.filter(mouvement => {
    const matchesSearch = mouvement.numero_mouvement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mouvement.beneficiaire.toLowerCase().includes(searchTerm.toLowerCase());
    const utilisateur_nom = mouvement.utilisateur_nom;
    const matchesTypeBeneficiaire = !filterTypeBeneficiaire || mouvement.type_beneficiaire === filterTypeBeneficiaire;
    const matchesTypeMouvement = !filterTypeMouvement || mouvement.type_mouvement === filterTypeMouvement;
    return matchesSearch && matchesTypeBeneficiaire && matchesTypeMouvement, utilisateur_nom;
  }).sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const getBeneficiaireIcon = (type) => {
    switch (type) {
      case 'famille': return <GroupIcon />;
      case 'personnel': return <PersonIcon />;
      case 'service': return <WorkIcon />;
      default: return <PersonIcon />;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const articlesData = await apiTogetAll('logistique/articles/');
      setArticles(articlesData.results || []);
      const mouvementsData = await apiTogetAll('logistique/mouvements/');
      setMouvements(mouvementsData.results || []);
    };
    fetchData();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ShoppingCartRounded sx={{ mr: 2, fontSize: 30 }} color="primary" />
            <Typography variant="h6" component="h6" fontWeight="bold">
              Mouvements de Stock
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Gestion des sorties et distributions d'articles
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('create')}
          sx={{ borderRadius: 2 }}
        >
          Nouveau Mouvement
        </Button>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <TrendingDownIcon />
              </Avatar>
              <Box>
                <Typography color="textSecondary" variant="body2">
                  Mouvements aujourd hui
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {mouvements.filter(m => new Date(m.date_mouvement).toDateString() === new Date().toDateString()).length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                <GroupIcon />
              </Avatar>
              <Box>
                <Typography color="textSecondary" variant="body2">
                  Ventes familles
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {mouvements.filter(m => m.type_beneficiaire === 'famille').length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                <MedicalIcon />
              </Avatar>
              <Box>
                <Typography color="textSecondary" variant="body2">
                  Usage médical
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {mouvements.filter(m => m.type_mouvement === 'usage_medical').length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                <ReceiptIcon />
              </Avatar>
              <Box>
                <Typography color="textSecondary" variant="body2">
                  Valeur totale
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {mouvements.reduce((sum, m) => sum + m.montant_total, 0)} AMG
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              placeholder="Rechercher un mouvement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Type bénéficiaire</InputLabel>
              <Select
                value={filterTypeBeneficiaire}
                label="Type bénéficiaire"
                onChange={(e) => setFilterTypeBeneficiaire(e.target.value)}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="famille">Famille</MenuItem>
                <MenuItem value="personnel">Personnel</MenuItem>
                <MenuItem value="service">Service</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Type mouvement</InputLabel>
              <Select
                value={filterTypeMouvement}
                label="Type mouvement"
                onChange={(e) => setFilterTypeMouvement(e.target.value)}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="vente">Vente</MenuItem>
                <MenuItem value="don">Don</MenuItem>
                <MenuItem value="usage_medical">Usage médical</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Movements Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'numero_mouvement'}
                    direction={sortOrder}
                    onClick={() => handleSort('numero_mouvement')}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">N°</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'beneficiaire'}
                    direction={sortOrder}
                    onClick={() => handleSort('beneficiaire')}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">Bénéficiaire</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'type_mouvement'}
                    direction={sortOrder}
                    onClick={() => handleSort('type_mouvement')}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">Type</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'date_mouvement'}
                    direction={sortOrder}
                    onClick={() => handleSort('date_mouvement')}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">Date</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'articles'}
                    direction={sortOrder}
                    onClick={() => handleSort('articles')}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">Articles</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'montant'}
                    direction={sortOrder}
                    onClick={() => handleSort('montant')}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">Montant</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'responsable'}
                    direction={sortOrder}
                    onClick={() => handleSort('responsable')}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">Responsable</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">Actions</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMouvements
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((mouvement) => (
                  <TableRow key={mouvement.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {mouvement.numero_mouvement}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{
                          bgcolor: `${typeBeneficiaireColors[mouvement.type_beneficiaire]}.main`,
                          width: 32,
                          height: 32,
                          mr: 2
                        }}>
                          {getBeneficiaireIcon(mouvement.type_beneficiaire)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {mouvement.beneficiaire.split(' - ')[0]}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {mouvement.contact}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={1}>
                        <Chip
                          label={mouvement.type_beneficiaire}
                          color={typeBeneficiaireColors[mouvement.type_beneficiaire]}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={mouvement.type_mouvement.replace('_', ' ')}
                          color={typeMouvementColors[mouvement.type_mouvement]}
                          size="small"
                          variant="filled"
                        />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {new Date(mouvement.date_mouvement).toLocaleDateString('fr-FR')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(mouvement.date_mouvement).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {mouvement.articles.length} article{mouvement.articles.length > 1 ? 's' : ''}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {mouvement.articles.reduce((sum, a) => sum + a.quantite, 0)} unités total
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="bold" color="primary">
                        {mouvement.montant_total} AMG
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {/* {mouvement.utilisateur.first_name} {mouvement.utilisateur.last_name} */}
                        {mouvement.utilisateur_nom}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Voir détails">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog('view', mouvement)}
                            color="primary"
                          >
                            <OpenInNewRounded fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Modifier">
                          <IconButton size="small" color="default" onClick={() => handleOpenDialog('edit', mouvement)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleOpenDialog('delete', mouvement)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredMouvements.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
          sx={{ "& p": { mb: 0 } }}
        />
      </Paper>


      {/* Dialog for create/edit/view */}
      <Dialog
        open={openDialog && dialogMode != 'delete'}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'create' ? 'Nouveau Mouvement de Stock' :
            dialogMode === 'edit' ? 'Modifier Mouvement' :
              `Mouvement ${selectedMouvement?.numero_mouvement}`}
        </DialogTitle>
        {(dialogMode === 'view') ? (
          <CommandeDetail
            mouvement={selectedMouvement}
            typeBeneficiaireColors={typeBeneficiaireColors}
            typeMouvementColors={typeMouvementColors}
            onClose={handleCloseDialog}
          />
        ) : (
          <CommandeForm
            mode={dialogMode}
            initialData={selectedMouvement}
            articles={articles}
            onSave={handleSaveMouvement}
            onClose={handleCloseDialog}
          />
        )}
      </Dialog>
      {selectedMouvement && (
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
            <Typography variant="body1" gutterBottom>
              Êtes-vous sûr de vouloir supprimer le mouvement
              <strong> {selectedMouvement.numero_mouvement} </strong>?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Annuler
            </Button>
            <Button
              onClick={handleDeleteMouvement}
              color="error"
              variant="contained"
              startIcon={<DeleteIcon />}>
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};