import { useState, useEffect, useContext } from "react";
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
  IconButton,
  Chip,
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
  MenuItem,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Tooltip
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  PersonOff as PersonOffIcon,
  Email as EmailIcon,
  Restore as RestoreIcon,
  BlockRounded as BlockRoundedIcon,
  OpenInNewRounded as OpenInNewRoundedIcon
} from "@mui/icons-material";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { red } from "@mui/material/colors";
import { apiToDelete, apiTogetAll, updateUser } from "../../../utils/ApiServices";
import { UserContext } from "../../../utils/UserContext";

export const Bloque = () => {
  const { user } = useContext(UserContext);
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("last_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        const blockedUsers = await apiTogetAll('comptes/users/?status=blocked');
        setUsers(blockedUsers);
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Erreur lors du chargement des utilisateurs bloqués",
          severity: "error"
        });
      }
    };
    fetchBlockedUsers();
  }, []);

  const handleSort = (field) => {
    const isAsc = sortBy === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortBy(field);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (mode, user) => {
    setSelectedUser(user);
    setDialogMode(mode);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
    setDialogMode("");
  };

  const handleReinstate = async () => {
    if (selectedUser) {
      try {
        await updateUser(selectedUser.id, { status: "approved", is_active: true });
        setUsers(users.filter(user => user.id !== selectedUser.id));
        setSnackbar({
          open: true,
          message: `${selectedUser.first_name} ${selectedUser.last_name} a été réintégré avec succès`,
          severity: "success"
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Erreur lors de la réintégration de l'utilisateur",
          severity: "error"
        });
      } finally {
        handleCloseDialog();
      }
    }
  };

  const handleDelete = async () => {
    if (selectedUser) {
      try {
        await apiToDelete('comptes/users/', selectedUser.id);
        setUsers(users.filter(user => user.id !== selectedUser.id));
        setSnackbar({
          open: true,
          message: "Utilisateur supprimé définitivement",
          severity: "success"
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Erreur lors de la suppression de l'utilisateur",
          severity: "error"
        });
      } finally {
        handleCloseDialog();
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredUsers = users.filter(user => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      user.first_name?.toLowerCase().includes(query) ||
      user.last_name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.blocage?.at(-1)?.reason?.toLowerCase().includes(query);
    const matchesStatus = !statusFilter || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    let aValue = a[sortBy] || a.blocage?.at(-1)?.[sortBy] || "";
    let bValue = b[sortBy] || b.blocage?.at(-1)?.[sortBy] || "";
    if (sortBy === "date") {
      aValue = a.blocage?.at(-1)?.date || "";
      bValue = b.blocage?.at(-1)?.date || "";
    }
    if (sortOrder === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  const formatDate = (date) => {
    try {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body2">{format(new Date(date), "dd MMMM yyyy", { locale: fr })}</Typography>
          <Typography variant="caption" color="text.secondary">
            à {format(new Date(date), "HH:mm", { locale: fr })}
          </Typography>
        </Box>
      );
    } catch {
      return "-";
    }
  };

  const getStatusColor = () => "error";

  const getStatusIcon = () => <PersonOffIcon fontSize="small" />;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BlockRoundedIcon sx={{ mr: 2, fontSize: 30 }} color="primary" />
            <Typography variant="h6" component="h6" fontWeight="bold">
              Comptes Bloqués
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Gestion des comptes des personnels bloqués
          </Typography>
        </Box>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <PersonOffIcon />
              </Avatar>
              <Box>
                <Typography color="textSecondary" variant="body2">
                  Total Utilisateurs Bloqués
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {users.length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                <BlockRoundedIcon />
              </Avatar>
              <Box>
                <Typography color="textSecondary" variant="body2">
                  Bloqués par Admin
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {users.filter(u => u.blocage?.at(-1)?.par).length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid> */}
        {/* <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                <EmailIcon />
              </Avatar>
              <Box>
                <Typography color="textSecondary" variant="body2">
                  Avec Email
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {users.filter(u => u.email).length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid> */}
      </Grid>

      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={statusFilter}
                label="Statut"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="blocked">Bloqué</MenuItem>
                <MenuItem value="suspendu">Suspendu</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Users Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">Avatar</Typography>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === "last_name"}
                    direction={sortOrder}
                    onClick={() => handleSort("last_name")}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">Nom</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === "email"}
                    direction={sortOrder}
                    onClick={() => handleSort("email")}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">Email</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">Statut</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">Raison</Typography>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === "date"}
                    direction={sortOrder}
                    onClick={() => handleSort("date")}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">Date</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">Actions</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2">
                      Aucun utilisateur bloqué trouvé
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Avatar
                          src={user.profile_picture ? `http://localhost:8000${user.profile_picture}` : "/userProfile.jpg"}
                          sx={{ width: 32, height: 32 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {user.first_name} {user.last_name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{user.email || '-'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.status === 'blocked' ? "Bloqué" : "Suspendu"}
                          color={getStatusColor()}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{user.blocage?.at(-1)?.reason || '-'}</Typography>
                      </TableCell>
                      <TableCell>
                        {formatDate(user.blocage?.at(-1)?.date)}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Voir détails">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog('view', user)}
                              color="primary"
                            >
                              <OpenInNewRoundedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Réintégrer">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog('reinstate', user)}
                              color="success"
                            >
                              <RestoreIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Supprimer">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog('delete', user)}
                              color="error"
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
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
          sx={{ "& p": { mb: 0 } }}
        />
      </Paper>

      {/* Dialog for view/reinstate/delete */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'view' ? `Détails de ${selectedUser?.first_name} ${selectedUser?.last_name}` :
           dialogMode === 'reinstate' ? 'Confirmer la réintégration' : 'Confirmer la suppression'}
        </DialogTitle>
        <DialogContent>
          {dialogMode === 'view' && selectedUser && (
            <Stack spacing={2}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Avatar
                  src={selectedUser.profile_picture ? `http://localhost:8000${selectedUser.profile_picture}` : "/userProfile.jpg"}
                  sx={{ width: 80, height: 80, mx: 'auto', mb: 1 }}
                />
                <Typography variant="h6" fontWeight="bold">
                  {selectedUser.first_name} {selectedUser.last_name}
                </Typography>
                <Chip
                  label={selectedUser.status === 'blocked' ? "Bloqué" : "Suspendu"}
                  color={getStatusColor()}
                  size="small"
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {selectedUser.email || '-'}
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Raison</Typography>
                  <Typography variant="body2">{selectedUser.blocage?.at(-1)?.reason || '-'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                  {formatDate(selectedUser.blocage?.at(-1)?.date)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Bloqué par</Typography>
                  <Typography variant="body2">{selectedUser.blocage?.at(-1)?.par || '-'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Notes</Typography>
                  <Typography variant="body2">{selectedUser.blocage?.at(-1)?.note || '-'}</Typography>
                </Grid>
              </Grid>
            </Stack>
          )}
          {dialogMode === 'reinstate' && selectedUser && (
            <Typography variant="body1">
              Êtes-vous sûr de vouloir réintégrer <strong>{selectedUser.first_name} {selectedUser.last_name}</strong> ?
            </Typography>
          )}
          {dialogMode === 'delete' && selectedUser && (
            <Typography variant="body1">
              Êtes-vous sûr de vouloir supprimer définitivement <strong>{selectedUser.first_name} {selectedUser.last_name}</strong> ?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Annuler
          </Button>
          {dialogMode === 'reinstate' && (
            <Button
              onClick={handleReinstate}
              color="success"
              variant="contained"
              startIcon={<RestoreIcon />}
            >
              Réintégrer
            </Button>
          )}
          {dialogMode === 'delete' && (
            <Button
              onClick={handleDelete}
              color="error"
              variant="contained"
              startIcon={<DeleteIcon />}
            >
              Supprimer
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};