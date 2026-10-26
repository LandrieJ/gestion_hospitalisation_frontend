import { useContext, useEffect, useState } from "react";
import { apiTogetAll, apiToDelete } from "../../../utils/ApiServices";
import { DataGrid } from "@mui/x-data-grid";
import {
  SearchRounded,
  DeleteForeverRounded,
  OpenInNewRounded,
  FilterListRounded,
  RefreshRounded,
} from "@mui/icons-material";
import {
  Tooltip,
  Box,
  Avatar,
  TextField,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
  CardContent,
  useTheme,
  Divider,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert
} from "@mui/material";
import { alpha } from '@mui/material/styles';
import { NavLink } from "react-router-dom";
import { styled } from "@mui/system";
import { UserContext } from "../../../utils/UserContext";

// Styles personnalisés
const StyledCard = styled(Card)(({ theme }) => ({
  // borderRadius: 16,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column'
}));

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url("/list.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '200px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  color: 'white',
  padding: '0 32px',
  position: 'relative',
  borderRadius: '5px',
}));

const SearchBar = styled(Paper)(({ theme }) => ({
  padding: '8px 16px',
  display: 'flex',
  alignItems: 'center',
  width: 320,
  borderRadius: 10,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  border: '1px solid #eaeaea',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
  }
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 10,
  textTransform: 'none',
  padding: '8px 24px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  fontWeight: 600
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px #ffffff`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

export const Liste = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const { user } = useContext(UserContext);

  const getRoleLabel = (role) => {
    const roles = {
      super_admin: { label: "Super Admin", color: theme.palette.error.main },
      admin: { label: "Admin", color: theme.palette.warning.main },
      simple_user: { label: "Utilisateur", color: theme.palette.success.main },
    };
    return roles[role] || { label: "Inconnu", color: "default" };
  };

  const paginationModel = { page: 0, pageSize: 10 };

  const columns = [
    {
      field: "photo",
      headerName: (<Typography fontWeight={'bold'} >Photo</Typography>),
      width: 80,
      sortable: false,
      display: 'flex',
      alignItems: 'center',
      renderCell: (params) => (
        <Tooltip title={`${params.row.first_name} ${params.row.last_name}`}>
          {params.row.user_type === 'super_admin' || params.row.user_type === 'admin' ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
            >
              <Avatar
                src={params.row.profile_picture ? `http://localhost:8000${params.row.profile_picture}` : "/userProfile.jpg"}
                alt={params.row.first_name}
                sx={{
                  width: 42,
                  height: 42,
                  border: `2px solid ${params.row.user_type === 'super_admin' ? theme.palette.error.main :
                    params.row.user_type === 'admin' ? theme.palette.warning.main :
                      theme.palette.grey[300]}`
                }}
              />
            </StyledBadge>
          ) : (
            <Avatar
              src={params.row.profile_picture ? `http://localhost:8000${params.row.profile_picture}` : "/userProfile.jpg"}
              alt={params.row.first_name}
              sx={{ width: 42, height: 42 }}
            />
          )}
        </Tooltip>
      ),
    },
    {
      field: "last_name",
      headerName: (<Typography fontWeight={'bold'} >Nom</Typography>),
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 600 }}>
          {params.value}
        </Typography>
      )
    },
    { field: "first_name", headerName: <Typography fontWeight={'bold'} >Prénom</Typography>, flex: 1 },
    {
      field: "user_type",
      headerName: (<Typography fontWeight={'bold'} >Rôle</Typography>),
      flex: 1,
      renderCell: (params) => {
        const { label, color } = getRoleLabel(params.row.user_type);
        return (
          <Chip
            label={label}
            size="small"
            sx={{
              fontWeight: 600,
              borderRadius: '50px',
              px: 1,
              backgroundColor: alpha(color, 0.2),
              color: alpha(color, 0.8),
            }}
          />
        );
      },
    },
    {
      field: "email",
      headerName: (<Typography fontWeight={'bold'} >Email</Typography>),
      flex: 1.5,
      display: 'flex',
      alignItems: 'center',
      renderCell: (params) => (
        <Typography
          sx={{
            color: theme.palette.text.secondary,
            fontSize: '0.875rem',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
              color: theme.palette.primary.main
            }
          }}
        >
          {params.value}
        </Typography>
      )
    },
    {
      field: "actions",
      headerName: (<Typography fontWeight={'bold'} >Actions</Typography>),
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: 'center' }}>
          <Tooltip title="Voir détails">
            <NavLink to={`${params.row.id}/detail`}>
              <IconButton
                size="small"
                sx={{
                  color: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  }
                }}
              >
                <OpenInNewRounded fontSize="small" />
              </IconButton>
            </NavLink>
          </Tooltip>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = await apiTogetAll('comptes/users/?is_active=true');
      const sortedUsers = userData.filter((oneUser) => oneUser.id !== user.id).sort((a, b) => a.last_name.localeCompare(b.last_name));
      setUsers(sortedUsers);
    } catch {
      setError("Erreur lors du chargement des données.");
      showSnackbar('Erreur lors du chargement des données', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSelectionChange = (selectionModel) => {
    setSelectedUsers(selectionModel);
  };

  const handleDeleteClick = () => {
    if (selectedUsers.length === 0) return;
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteUsers = async () => {
    setDeleteDialogOpen(false);
    setLoading(true);

    try {
      // Effectuer la suppression pour chaque utilisateur sélectionné
      for (const userId of selectedUsers) {
        apiToDelete('comptes/users/', userId)
      }

      // Mettre à jour les utilisateurs
      const remainingUsers = users.filter((user) => !selectedUsers.includes(user.id));
      setUsers(remainingUsers);
      setSelectedUsers([]); // Réinitialiser la sélection
      showSnackbar(`${selectedUsers.length} utilisateur(s) supprimé(s) avec succès`, 'success');
    } catch {
      setError("Erreur lors de la suppression des utilisateurs.");
      showSnackbar('Erreur lors de la suppression des utilisateurs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  const handleFilterClick = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterMenuAnchor(null);
  };

  const handleFilterSelect = (filter) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
    handleFilterClose();
  };

  const filteredUsers = users.filter((user) => {
    // Filtrage par recherche
    const matchesSearch = searchQuery === "" ||
      Object.values(user).some((value) =>
        value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );

    // Filtrage par rôle
    const matchesRoleFilter = activeFilters.length === 0 ||
      activeFilters.includes(user.user_type);

    return matchesSearch && matchesRoleFilter;
  });

  return (
    <>
      <StyledCard className="d-flex flex-column flex-grow-1">
        {loading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="400px"
            flexDirection="column"
            gap={2}
          >
            <CircularProgress color="primary" size={40} thickness={4} />
            <Typography variant="body2" color="textSecondary">
              Chargement des utilisateurs...
            </Typography>
          </Box>
        )}

        {error && !loading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="200px"
            flexDirection="column"
            gap={2}
            p={3}
          >
            <Alert severity="error" sx={{ width: '100%', maxWidth: 500 }}>
              {error}
            </Alert>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<RefreshRounded />}
              onClick={fetchUserData}
            >
              Réessayer
            </Button>
          </Box>
        )}

        {!loading && !error && (
          <Box>
            <HeroSection>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                Liste des Utilisateurs
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''} dans la base de données
              </Typography>
            </HeroSection>

            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
                flexWrap="wrap"
                gap={2}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <SearchBar elevation={0}>
                    <SearchRounded color="action" sx={{ mr: 1 }} />
                    <TextField
                      variant="standard"
                      fullWidth
                      placeholder="Rechercher un utilisateur..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      InputProps={{
                        disableUnderline: true
                      }}
                    />
                  </SearchBar>

                  <Tooltip title="Filtrer par rôle">
                    <IconButton
                      color={activeFilters.length > 0 ? "primary" : "default"}
                      onClick={handleFilterClick}
                      sx={{
                        border: `1px solid ${activeFilters.length > 0 ? theme.palette.primary.main : '#eaeaea'}`,
                        backgroundColor: activeFilters.length > 0 ? alpha(theme.palette.primary.main, 0.1) : 'transparent'
                      }}
                    >
                      <Badge
                        badgeContent={activeFilters.length || null}
                        color="primary"
                        overlap="circular"
                      >
                        <FilterListRounded />
                      </Badge>
                    </IconButton>
                  </Tooltip>

                  <Menu
                    anchorEl={filterMenuAnchor}
                    open={Boolean(filterMenuAnchor)}
                    onClose={handleFilterClose}
                    PaperProps={{
                      sx: { borderRadius: 2, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)' }
                    }}
                  >
                    <MenuItem onClick={() => handleFilterSelect('super_admin')}>
                      <ListItemIcon>
                        <Chip
                          size="small"
                          label="Super Admin"
                          color="error"
                          sx={{ minWidth: 100 }}
                        />
                      </ListItemIcon>
                      <ListItemText />
                      {activeFilters.includes('super_admin') && (
                        <ListItemIcon sx={{ justifyContent: 'flex-end' }}>
                          ✓
                        </ListItemIcon>
                      )}
                    </MenuItem>
                    <MenuItem onClick={() => handleFilterSelect('admin')}>
                      <ListItemIcon>
                        <Chip
                          size="small"
                          label="Admin"
                          color="warning"
                          sx={{ minWidth: 100 }}
                        />
                      </ListItemIcon>
                      <ListItemText />
                      {activeFilters.includes('admin') && (
                        <ListItemIcon sx={{ justifyContent: 'flex-end' }}>
                          ✓
                        </ListItemIcon>
                      )}
                    </MenuItem>
                    <MenuItem onClick={() => handleFilterSelect('simple_user')}>
                      <ListItemIcon>
                        <Chip
                          size="small"
                          label="Utilisateur"
                          color="success"
                          sx={{ minWidth: 100 }}
                        />
                      </ListItemIcon>
                      <ListItemText />
                      {activeFilters.includes('simple_user') && (
                        <ListItemIcon sx={{ justifyContent: 'flex-end' }}>
                          ✓
                        </ListItemIcon>
                      )}
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => setActiveFilters([])}>
                      <ListItemText>
                        <Typography sx={{ fontSize: '0.875rem' }}>Effacer les filtres</Typography>
                      </ListItemText>
                    </MenuItem>
                  </Menu>
                </Box>
                {user.user_type === "simple_user" ? () => null : (
                  <Box display="flex" gap={2}>
                    <ActionButton
                      variant="contained"
                      color="error"
                      startIcon={<DeleteForeverRounded />}
                      onClick={handleDeleteClick}
                      disabled={selectedUsers.length === 0}
                    >
                      Supprimer {selectedUsers.length > 1 ? `(${selectedUsers.length})` : ''}
                    </ActionButton>
                  </Box>
                )}
              </Box>

              <DataGrid
                rows={filteredUsers}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10, 25, 50]}
                checkboxSelection={user.user_type === "simple_user" ? false : true}
                disableColumnResize
                onRowSelectionModelChange={handleSelectionChange}
                rowHeight={60}
                localeText={{
                  noRowsLabel: "Aucun utilisateur disponible",
                  columnMenuSortAsc: "Trier par ordre croissant",
                  columnMenuSortDesc: "Trier par ordre décroissant",
                  columnMenuFilter: "Filtrer",
                  columnMenuHideColumn: "Masquer la colonne",
                  columnMenuShowColumns: "Gérer les colonnes",
                  columnMenuManageColumns: "Organise les colones",
                  toolbarColumns: "Colonnes",
                  toolbarFilters: "Filtres",
                  toolbarDensity: "Densité",
                  toolbarDensityCompact: "Compact",
                  toolbarDensityStandard: "Standard",
                  toolbarDensityComfortable: "Confortable",
                  footerRowSelected: (count) => `${count} utilisateur${count !== 1 ? 's' : ''} sélectionné${count !== 1 ? 's' : ''}`,
                  footerTotalRows: "Total:",
                  MuiTablePagination: {
                    labelRowsPerPage: "Lignes par page:",
                    labelDisplayedRows: ({ from, to, count }) => `${from} - ${to} sur ${count !== -1 ? count : `plus de ${to}`}`,
                  },
                }}
                sx={{
                  border: 0,
                  height: '100%',
                  "& p": { marginBottom: 0 },
                  "& .MuiDataGrid-row": {
                    transition: "background-color 0.2s ease",
                  },
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  },
                  "& .MuiDataGrid-cell": {
                    borderBottom: "1px solid #f0f0f0",
                  },
                  "& .MuiDataGrid-topContainer": {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  },
                  "& .MuiDataGrid-columnHeaders": {
                  },
                  "& .MuiCheckbox-root": {
                    color: theme.palette.primary.main,
                  },
                  "& .MuiTablePagination-root": {
                    mt: 2,
                  },
                  "& .MuiDataGrid-footerContainer": {
                    borderTop: "none",
                  },
                }}
              />
            </CardContent>
          </Box>
        )}

        {/* Dialogue de confirmation de suppression */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          PaperProps={{
            sx: { borderRadius: 3, p: 1 }
          }}
        >
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Êtes-vous sûr de vouloir supprimer {selectedUsers.length} utilisateur{selectedUsers.length !== 1 ? 's' : ''} ?
              Cette action est irréversible.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={handleCloseDeleteDialog}
              variant="outlined"
              sx={{ borderRadius: 50, textTransform: 'none' }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleDeleteUsers}
              color="error"
              variant="contained"
              sx={{ borderRadius: 50, textTransform: 'none' }}
            >
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar pour les notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            elevation={6}
            variant="filled"
            sx={{ borderRadius: 2 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </StyledCard>
    </>
  );
};