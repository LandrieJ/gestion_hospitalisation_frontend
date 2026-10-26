import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, FormControl, InputLabel, Select, MenuItem, TextField,
  Grid, Card, CardContent, CardHeader, Tabs, Tab, Alert, Tooltip,
  TableSortLabel, InputAdornment, Avatar,
  Slide,
  alpha,
  useTheme,
  TablePagination
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Search as SearchIcon,
  Category as CategoryIcon,
  LocationOn as LocationOnIcon,
  Business as BusinessIcon,
  ArrowBack,
  OpenInNewRounded,
  InventoryRounded
} from '@mui/icons-material';
import { TypeArticleForm } from '../Components/TypeArticleForm';
import { ArticleForm } from '../Components/ArticleForm';
import { apiTogetAll, apiToDelete } from '../../../../utils/ApiServices';

export const Article = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [editing, setEditing] = useState(false);
  const [articles, setArticles] = useState([]);
  const [typesArticle, setTypesArticle] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [slideSection, setSlideSection] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  // États pour les filtres et le tri
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermType, setSearchTermType] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sortBy, setSortBy] = useState('nom');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const openAddDialog = (type) => {
    setDialogType(type);
    setSelectedItem(null);
    setOpenDialog(true);
  };

  const openDetailDialog = (article) => {
    setSelectedItem(article);
    setDialogType('detail');
    setOpenDialog(true);
  };

  const openDeleteDialog = (item, type) => {
    setSelectedItem(item);
    setDialogType(`delete-${type}`);
    console.log(item);
    console.log(item.id);
    console.log(`delete-${type}`);
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    setDialogType('');
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleEdit = (articleToEdit) => {
    if (articleToEdit) {
      setSelectedItem(articleToEdit);
      setEditing(true);
      setSlideSection('article');
    }
  };

  const handleDelete = async () => {
    if (dialogType === 'delete-article') {
      await apiToDelete(`logistique/articles/`, selectedItem.id);
      setArticles(articles.filter(article => article.id !== selectedItem.id));
    } else if (dialogType === 'delete-type') {
      await apiToDelete(`logistique/types-articles/`, selectedItem.id);
      setTypesArticle(typesArticle.filter(type => type.id !== selectedItem.id));
    }
    closeDialog();
  };

  const getTypeNom = (typeArticle) => {
    if (!typeArticle) return 'Type inconnu';
    const typeId = typeof typeArticle === 'object' ? typeArticle.id : typeArticle;
    const type = typesArticle.find(t => t.id === typeId);
    return type ? type.nom : 'Type inconnu';
  };


  const getFournisseurNom = (fournisseurId) => {
    const fournisseur = fournisseurs.find(f => f.id === fournisseurId);
    return fournisseur ? fournisseur.nom : 'Fournisseur inconnu';
  };

  const getStockStatus = (article) => {
    if (article.quantite_stock <= article.seuil_critique) {
      return { status: 'Critique', color: 'error', icon: <ErrorIcon /> };
    } else if (article.quantite_stock <= article.seuil_alerte) {
      return { status: 'Alerte', color: 'warning', icon: <WarningIcon /> };
    }
    return { status: 'Normal', color: 'success', icon: null };
  };

  const isExpirationSoon = (date) => {
    if (!date) return false;
    const currentDate = new Date();
    const expDate = new Date(date);
    const daysToExpiration = Math.ceil((expDate - currentDate) / (1000 * 60 * 60 * 24));
    return daysToExpiration < 7 && daysToExpiration >= 0;
  };

  const handleSort = (field) => {
    const isAsc = sortBy === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(field);
  };

  const filteredAndSortedtypesArticle = typesArticle
    .filter(type => {
      const matchesSearch = type.nom.toLowerCase().includes(searchTermType.toLowerCase()) ||
        type.code.toLowerCase().includes(searchTermType.toLowerCase()) || type.description.toLowerCase().includes(searchTermType.toLowerCase());
      return matchesSearch;
    });

  const handleDiffSlide = (typeSection) => {
    if (typeSection === 'type') {
      setEditing(false);
      setSlideSection(typeSection);
    } else if (typeSection === 'article') {
      setEditing(false);
      setSlideSection(typeSection);
    } else if (typeSection === '') {
      setEditing(false);
      setSlideSection(typeSection);
    }
  };

  const filteredAndSortedArticles = articles
    .filter(article => {
      const matchesSearch = article.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !filterType || article.type_article?.id.toString() === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'type_article') {
        aValue = getTypeNom(a.type_article);
        bValue = getTypeNom(b.type_article);
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  useEffect(() => {
    const fetchData = async () => {
      const articlesData = await apiTogetAll('logistique/articles/');
      setArticles(articlesData.results || []);
      const typesData = await apiTogetAll('logistique/types-articles/');
      setTypesArticle(typesData.results || []);
      const fournisseursData = await apiTogetAll('logistique/fournisseurs/');
      setFournisseurs(fournisseursData.results || []);
    };
    fetchData();
  }, [slideSection]);

  return (
    <Box sx={{ p: 3 }}>
      {slideSection === "type" && (
        <Slide direction="left" in={slideSection === 'type'} mountOnEnter unmountOnExit>
          <Box>
            <IconButton onClick={() => handleDiffSlide('')}>
              <ArrowBack />
            </IconButton>
            <TypeArticleForm setSlideSection={setSlideSection} editing={editing} />
          </Box>
        </Slide>
      )}
      {slideSection === "article" && (
        <Slide direction="left" in={slideSection === 'article'} mountOnEnter unmountOnExit>
          <Box>
            <IconButton onClick={() => handleDiffSlide('')}>
              <ArrowBack />
            </IconButton>
            <ArticleForm handleDiffSlide={handleDiffSlide} setSlideSection={setSlideSection} editing={editing} selectedItem={selectedItem} typesArticle={typesArticle} fournisseurs={fournisseurs} />
          </Box>
        </Slide>
      )}
      {slideSection === '' && (
        <Slide direction='right' in={slideSection === ''} mountOnEnter unmountOnExit>
          <Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <InventoryRounded sx={{ mr: 2, fontSize: 30 }} color="primary" />
                <Typography variant="h6" component="h6" fontWeight="bold">
                  Gestion des Articles
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Gestion des articles et les types d'articles
              </Typography>
            </Box>

            {/* Onglets */}
            <Paper sx={{ my: 3, borderRadius: 2, boxShadow: '0 4px 20px RGBA(0,0,0,0.08)' }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                sx={{ bgcolor: 'background.paper' }}
              >
                <Tab label="Articles" />
                <Tab label="Types d'Articles" />
              </Tabs>
            </Paper>

            {/* Contenu de l'onglet Articles */}
            {activeTab === 0 && (
              <Box>
                {/* Barre de recherche et filtres */}
                <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: '0 4px 20px RGBA(0,0,0,0.08)' }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        label="Rechercher un article"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <FormControl fullWidth>
                        <InputLabel>Filtrer par type</InputLabel>
                        <Select
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                          label="Filtrer par type"
                        >
                          <MenuItem value="">Tous les types</MenuItem>
                          {typesArticle.map((type) => (
                            <MenuItem key={type.id} value={type.id.toString()}>
                              {type.nom}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => handleDiffSlide('article')}
                          size="large"
                          sx={{ borderRadius: 2 }}
                        >
                          Nouvel Article
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Tableau des articles */}
                <Paper sx={{ borderRadius: 2, boxShadow: '0 4px 20px RGBA(0,0,0,0.08)' }}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
                          <TableCell>
                            <TableSortLabel
                              active={sortBy === 'nom'}
                              direction={sortBy === 'nom' ? sortOrder : 'asc'}
                              onClick={() => handleSort('nom')}
                            >
                              <Typography variant="subtitle2" fontWeight="bold">
                                Nom
                              </Typography>
                            </TableSortLabel>
                          </TableCell>
                          <TableCell>
                            <TableSortLabel
                              active={sortBy === 'type_article'}
                              direction={sortBy === 'type_article' ? sortOrder : 'asc'}
                              onClick={() => handleSort('type_article')}
                            >
                              <Typography variant="subtitle2" fontWeight="bold">
                                Type
                              </Typography>
                            </TableSortLabel>
                          </TableCell>
                          <TableCell>
                            <TableSortLabel
                              active={sortBy === 'quantite_stock'}
                              direction={sortBy === 'quantite_stock' ? sortOrder : 'asc'}
                              onClick={() => handleSort('quantite_stock')}
                            >
                              <Typography variant="subtitle2" fontWeight="bold">
                                Stock
                              </Typography>
                            </TableSortLabel>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight="bold">
                              Statut des stocks
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight="bold">
                              Expiration
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="subtitle2" fontWeight="bold">
                              Actions
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredAndSortedArticles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((article) => {
                          const stockStatus = getStockStatus(article);
                          const isExpiringSoon = isExpirationSoon(article.date_expiration);
                          return (
                            <TableRow
                              key={article.id}
                              hover
                              sx={{
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.primary.main, 0.04)
                                }
                              }}
                            >
                              <TableCell>
                                <Typography variant="body2" fontWeight="600">
                                  {article.nom}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={getTypeNom(article.type_article)}
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {article.quantite_stock} {article.unite}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  icon={stockStatus.icon}
                                  label={stockStatus.status}
                                  size="small"
                                  color={stockStatus.color}
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>
                                {isExpiringSoon ? (
                                  <Alert
                                    severity="warning"
                                    sx={{ p: 0.5, fontSize: '0.75rem' }}
                                  >
                                    Expire bientôt ({new Date(article.date_expiration).toLocaleDateString('fr-FR')})
                                  </Alert>
                                ) : (
                                  <Typography variant="body2">
                                    {article.date_expiration ? new Date(article.date_expiration).toLocaleDateString('fr-FR') : '-'}
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell align="right">
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Tooltip title="Détails">
                                    <IconButton
                                      size="small"
                                      onClick={() => openDetailDialog(article)}
                                      color="primary"
                                    >
                                      <OpenInNewRounded fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Modifier">
                                    <IconButton size="small" color="default" onClick={() => handleEdit(article)}>
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Supprimer">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => openDeleteDialog(article, 'article')}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredAndSortedArticles.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Lignes par page:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
                    sx={{ "& p": { mb: 0 } }}
                  />
                </Paper>

                {filteredAndSortedArticles.length === 0 && (
                  <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                    <Typography>
                      Aucun article ne correspond aux critères de recherche.
                    </Typography>
                  </Alert>
                )}
              </Box>
            )}

            {/* Contenu de l'onglet Types d'Articles */}
            {activeTab === 1 && (
              <Box>
                <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: '0 4px 20px RGBA(0,0,0,0.08)' }}>
                  <Grid container spacing={2} alignItems={'center'}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        label="Rechercher un type d'article"
                        value={searchTermType}
                        onChange={(e) => setSearchTermType(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 8 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => setSlideSection('type')}
                          size="large"
                          sx={{ borderRadius: 2 }}
                        >
                          Nouveau Type
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>

                <Grid container spacing={3}>
                  {filteredAndSortedtypesArticle.map((type) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={type.id}>
                      <Card sx={{ height: '100%', boxShadow: '0 4px 20px RGBA(0,0,0,0.08)', borderRadius: 2 }}>
                        <CardHeader
                          avatar={
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              <CategoryIcon />
                            </Avatar>
                          }
                          title={
                            <Typography variant="h6" fontWeight="bold">
                              {type.nom}
                            </Typography>
                          }
                          subheader={
                            <Chip
                              label={type.code}
                              size="small"
                              variant="outlined"
                              color="secondary"
                            />
                          }
                          action={
                            <Tooltip title="Supprimer">
                              <IconButton
                                color="error"
                                onClick={() => openDeleteDialog(type, 'type')}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          }
                        />
                        <CardContent>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {type.description || 'Aucune description'}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BusinessIcon fontSize="small" color="action" />
                            <Typography variant="caption">
                              Articles associés: <strong>{articles.filter(a => a.type_article.id === type.id).length}</strong>
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            {/* Dialog de détails d'article */}
            <Dialog open={openDialog && dialogType === 'detail'} onClose={closeDialog} maxWidth="md" fullWidth>
              {selectedItem && (
                <>
                  <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <OpenInNewRounded color="primary" />
                      Détails de l'article
                    </Box>
                  </DialogTitle>
                  <DialogContent>
                    <Grid container spacing={3} sx={{ pt: 1 }}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Nom:
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {selectedItem.nom}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Type:
                        </Typography>
                        <Chip
                          label={getTypeNom(selectedItem.type_article)}
                          color="primary"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Description:
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {selectedItem.description}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Stock:
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>{selectedItem.quantite_stock}</strong> {selectedItem.unite}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Prix unitaire:
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {selectedItem.prix_unitaire} Ar
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Code-barre:
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {selectedItem.code_barre}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Numéro de lot:
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {selectedItem.numero_lot}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Fournisseur:
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {getFournisseurNom(selectedItem.fournisseur_principal?.id)}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Emplacement:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationOnIcon fontSize="small" color="action" />
                          <Typography variant="body1">
                            {selectedItem.emplacement}
                          </Typography>
                        </Box>
                      </Grid>
                      {isExpirationSoon(selectedItem.date_expiration) && (
                        <Grid size={{ xs: 12 }}>
                          <Alert severity="warning">
                            Cet article expire bientôt ({new Date(selectedItem.date_expiration).toLocaleDateString('fr-FR')})
                          </Alert>
                        </Grid>
                      )}
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={closeDialog} variant="contained" sx={{ borderRadius: 2 }}>
                      Fermer
                    </Button>
                  </DialogActions>
                </>
              )}
            </Dialog>

            {/* Dialog de confirmation de suppression */}
            <Dialog
              open={openDialog && (dialogType === 'delete-article' || dialogType === 'delete-type')}
              onClose={closeDialog}
              maxWidth="sm"
              fullWidth
            >
              {selectedItem && (
                <>
                  <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DeleteIcon color="error" />
                      Confirmer la suppression
                    </Box>
                  </DialogTitle>
                  <DialogContent>
                    <Typography variant="body1" gutterBottom>
                      Êtes-vous sûr de vouloir supprimer {dialogType === 'delete-article' ? 'l\'article' : 'le type'}
                      <strong> {selectedItem.nom} </strong>?
                    </Typography>
                    {dialogType === 'delete-type' && (
                      <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
                        <Typography variant="body2">
                          <strong>Attention:</strong> Cette action supprimera également tous les articles
                          associés à ce type.
                        </Typography>
                      </Alert>
                    )}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={closeDialog} sx={{ borderRadius: 2 }}>
                      Annuler
                    </Button>
                    <Button
                      onClick={handleDelete}
                      color="error"
                      variant="contained"
                      startIcon={<DeleteIcon />}
                      sx={{ borderRadius: 2 }}
                    >
                      Supprimer
                    </Button>
                  </DialogActions>
                </>
              )}
            </Dialog>
          </Box>
        </Slide>
      )}
    </Box>
  );
}