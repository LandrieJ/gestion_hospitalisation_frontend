import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  Chip,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Tab,
  Tabs,
  Badge,
  alpha,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  MenuItem,
  useTheme,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  Search,
  FilterList,
  Person,
  EventNote,
  Refresh,
  ArrowDownward,
  ArrowUpward,
  Info,
  Warning,
  OpenInNewRounded,
  CloseRounded,
  History,
  PersonAddRounded,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { apiTogetAll, updateUser } from "../../../utils/ApiServices";

const StatusChip = styled(Chip)(({ theme, status }) => ({
  ...(status === "new" && {
    backgroundColor: alpha(theme.palette.info.main, 0.1),
    color: theme.palette.info.dark,
    fontWeight: "bold",
  }),
  ...(status === "rejected" && {
    backgroundColor: alpha(theme.palette.error.main, 0.1),
    color: theme.palette.error.dark,
    fontWeight: "bold",
  }),
  ...(status === "approved" && {
    backgroundColor: alpha(theme.palette.success.main, 0.1),
    color: theme.palette.success.dark,
    fontWeight: "bold",
  }),
}));

export const Demande = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [currentSort, setCurrentSort] = useState({
    field: "date_joined",
    direction: "desc",
  });
  const [currentFilter, setCurrentFilter] = useState({
    service: "all",
    fonction: "all",
    status: "all",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [newType, setNewType] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const InactiveUsersData = await apiTogetAll('comptes/users/?is_active=false');
      const sortedInactiveUsers = InactiveUsersData.sort((a, b) =>
        (a.last_name || "").localeCompare(b.last_name || "")
      );
      setUsers(sortedInactiveUsers);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const filteredUsers = useMemo(() => {
    return (users || [])
      .filter((user) => {
        return user.status !== "blocked" && user.status !== "approved";
      })
      .filter((user) => {
        const fullName = `${user?.first_name || ""} ${user?.last_name || ""}`.toLowerCase();
        const searchLower = (searchQuery || "").toLowerCase();
        return (
          fullName.includes(searchLower) ||
          (user?.email || "").toLowerCase().includes(searchLower) ||
          (user?.service?.name || "").toLowerCase().includes(searchLower) ||
          (user?.fonction || "").toLowerCase().includes(searchLower)
        );
      })
      .filter((user) => {
        if (currentFilter.service !== "all" && user.service?.name !== currentFilter.service)
          return false;
        if (currentFilter.fonction !== "all" && user.fonction !== currentFilter.fonction)
          return false;
        if (currentFilter.status !== "all" && user.status !== currentFilter.status)
          return false;
        if (selectedTab === 0) return true;
        if (selectedTab === 1) return user.status === "new";
        if (selectedTab === 2) return user.status === "rejected";
        return false;
      })
      .sort((a, b) => {
        const { field, direction } = currentSort;
        if (field === "name") {
          const nameA = `${a.last_name || ""} ${a.first_name || ""}`;
          const nameB = `${b.last_name || ""} ${b.first_name || ""}`;
          return direction === "asc"
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        }
        if (field === "date_joined") {
          return direction === "asc"
            ? new Date(a.date_joined || 0) - new Date(b.date_joined || 0)
            : new Date(b.date_joined || 0) - new Date(a.date_joined || 0);
        }
        return 0;
      });
  }, [users, searchQuery, currentFilter, selectedTab, currentSort]);

  const handleRenew = (userId) => {
    setUsers((users) =>
      users.map((user) =>
        user.id === userId ? { ...user, status: "new" } : user
      )
    );
    if (detailsOpen && selectedUser?.id === userId) {
      setDetailsOpen(false);
    }
  };

  const handleApprove = async (userId) => {
    if (newType) {
      await updateUser(userId, { status: "approved", is_active: true, user_type: newType });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      if (detailsOpen && selectedUser?.id === userId) {
        setDetailsOpen(false);
      }
    }
  };

  const handleReject = async (userId) => {
    await updateUser(userId, { status: "rejected" });
    setUsers((users) =>
      users.map((user) =>
        user.id === userId ? { ...user, status: "rejected" } : user
      )
    );
    if (detailsOpen && selectedUser?.id === userId) {
      setDetailsOpen(false);
    }
  };

  const handleSort = (field) => {
    setCurrentSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setNewType(null);
    setDetailsOpen(true);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setPage(0);
  };

  const handleFilterChange = (newFilter) => {
    setCurrentFilter(newFilter);
    setPage(0);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  const formatHour = (dateString) => {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleTimeString("fr-FR", options);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "new":
        return "Nouvelle";
      case "rejected":
        return "Rejetée";
      default:
        return status;
    }
  };

  const theUserType = ["super_admin", "admin", "simple_user"];
  const typeUser = (type) => {
    switch (type) {
      case "super_admin":
        return "Super Admin";
      case "admin":
        return "Admin";
      case "simple_user":
        return "Utilisateur simple";
      default:
        return type;
    }
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
  };

  const handleSaveUser = async () => {
    await updateUser(editedUser.id, {
      first_name: editedUser.first_name,
      last_name: editedUser.last_name,
      email: editedUser.email,
      fonction: editedUser.fonction,
      service: { name: editedUser.service?.name || editedUser.service },
    });
    setUsers((users) =>
      users.map((user) =>
        user.id === editedUser.id ? { ...editedUser } : user
      )
    );
    setEditDialogOpen(false);
  };

  const stats = useMemo(() => {
    const total = users.filter((user) => user.status !== "blocked" && user.status !== "approved").length;
    const newCount = users.filter((user) => user.status === "new").length;
    const rejectedCount = users.filter((user) => user.status === "rejected").length;

    return {
      total,
      new: newCount,
      rejected: rejectedCount,
    };
  }, [users]);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box mb={4}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PersonAddRounded sx={{ mr: 2, fontSize: 30 }} color="primary" />
            <Typography variant="h6" component="h6" fontWeight="bold">
              Demandes d&apos;inscription
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Gérez les demandes d&apos;inscription soumis par des nouveaux personnels
          </Typography>
        </Box>

        <Grid container spacing={2} mt={3}>
          <Grid size={{ xs: 12, sm: 12, md: 4 }}>
            <Card sx={{ backgroundColor: alpha("#3f51b5", 0.05), border: 1, borderColor: alpha("#3f51b5", 0.1) }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <Person sx={{ color: "primary.main", mr: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Total des demandes
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {stats.total || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {stats.new || 0} nouveau, {stats.rejected || 0} rejetées
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 4 }}>
            <Card sx={{ backgroundColor: alpha("#4caf50", 0.05), border: 1, borderColor: alpha("#4caf50", 0.1) }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <EventNote sx={{ color: "success.main", mr: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Nouvelles
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {stats.new || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Nouvelles Demande à traiter en priorité
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 4 }}>
            <Card sx={{ backgroundColor: alpha("#f44336", 0.05), border: 1, borderColor: alpha("#f44336", 0.1) }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <Warning sx={{ color: "error.main", mr: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Rejetée
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {stats.rejected || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Les demande qui ont été rejetées
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Paper sx={{ mb: 3, p: 0, borderRadius: 2, boxShadow: 1 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <Badge badgeContent={stats.total || 0} color="primary">
                  <Person />
                </Badge>
                <Box>Toutes</Box>
              </Box>
            }
          />
          <Tab
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <Badge badgeContent={stats.new || 0} color="info">
                  <Info />
                </Badge>
                <Box>Nouvelles</Box>
              </Box>
            }
          />
          <Tab
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <Badge badgeContent={stats.rejected || 0} color="warning">
                  <Warning />
                </Badge>
                <Box>Demande rejetée</Box>
              </Box>
            }
          />
        </Tabs>
      </Paper>

      <Box mb={3} display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2} alignItems={{ xs: "stretch", sm: "center" }} justifyContent="space-between">
        <TextField
          placeholder="Rechercher par nom, email, département..."
          variant="outlined"
          size="small"
          fullWidth
          sx={{ maxWidth: { sm: 400 } }}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(0);
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            },
          }}
        />

        <Box display="flex" gap={1}>
          <Tooltip title="Filtres avancés">
            <Button
              startIcon={<FilterList />}
              variant="outlined"
              size="small"
              onClick={() => setFilterDialogOpen(true)}
              sx={{
                borderColor: Object.values(currentFilter).some((val) => val !== "all") ? "primary.main" : "inherit",
                color: Object.values(currentFilter).some((val) => val !== "all") ? "primary.main" : "inherit",
                fontWeight: Object.values(currentFilter).some((val) => val !== "all") ? "bold" : "normal",
              }}
            >
              Filtres
              {Object.values(currentFilter).some((val) => val !== "all") && (
                <Box
                  component="span"
                  sx={{
                    ml: 1,
                    bgcolor: "primary.main",
                    color: "white",
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                  }}
                >
                  {Object.values(currentFilter).filter((val) => val !== "all").length}
                </Box>
              )}
            </Button>
          </Tooltip>

          <Tooltip title="Actualiser">
            <IconButton size="small" onClick={fetchUserData}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Paper sx={{ borderRadius: 2, boxShadow: 3 }}>
        {isLoading ? (
          <Box py={5} textAlign="center">
            <Typography>Chargement...</Typography>
          </Box>
        ) : filteredUsers.length === 0 ? (
          <Box py={5} textAlign="center">
            <Typography color="text.secondary" mb={2}>
              Aucune demande ne correspond à vos critères.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => {
                setSearchQuery("");
                setCurrentFilter({ service: "all", fonction: "all", status: "all" });
                setPage(0);
              }}
            >
              Effacer les filtres
            </Button>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
                    <TableCell width={60}></TableCell>
                    <TableCell>
                      <Box
                        display="flex"
                        alignItems="center"
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleSort("name")}
                      >
                        <Typography variant="subtitle2" fontWeight="bold">
                          Candidat
                        </Typography>
                        {currentSort.field === "name" && (
                          currentSort.direction === "asc" ? (
                            <ArrowUpward fontSize="small" sx={{ ml: 0.5 }} />
                          ) : (
                            <ArrowDownward fontSize="small" sx={{ ml: 0.5 }} />
                          )
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Service
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        display="flex"
                        alignItems="center"
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleSort("date_joined")}
                      >
                        <Typography variant="subtitle2" fontWeight="bold">
                          Date de soumission
                        </Typography>
                        {currentSort.field === "date_joined" && (
                          currentSort.direction === "asc" ? (
                            <ArrowUpward fontSize="small" sx={{ ml: 0.5 }} />
                          ) : (
                            <ArrowDownward fontSize="small" sx={{ ml: 0.5 }} />
                          )
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Statut
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
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                    <TableRow
                      key={user.id}
                      hover
                      sx={{
                        transition: "background-color 0.3s",
                        "&:hover": {
                          backgroundColor: alpha("#f5f5f5", 0.5),
                        },
                      }}
                    >
                      <TableCell>
                        <Avatar
                          alt={`${user.first_name} ${user.last_name}`}
                          src={user.profile_picture || "/profile.jpg"}
                          sx={{
                            width: 45,
                            height: 45,
                            border: 2,
                            borderColor: user.status === "new" ? "info.light" : "grey.300",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                            {user.first_name} {user.last_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.email}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.phone_number}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography variant="body2">{user.fonction}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.service?.name || "Département non spécifié"}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography variant="body2">{formatDate(user.date_joined)}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            à : {formatHour(user.date_joined)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <StatusChip
                          label={getStatusLabel(user.status)}
                          status={user.status}
                          size="small"
                          icon={user.status === "new" ? <Info fontSize="small" /> : <Cancel fontSize="small" />}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box display="flex" justifyContent="flex-end">
                          <Tooltip title="Voir les détails">
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(user)}
                              sx={{
                                color: theme.palette.primary.main,
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                "&:hover": {
                                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                },
                              }}
                            >
                              <OpenInNewRounded fontSize="small" />
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
              count={filteredUsers.length}
              component="div"
              onPageChange={(_, newPage) => setPage(newPage)}
              page={page}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
              labelRowsPerPage="Lignes par page :"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} sur ${count} ${count !== 1 ? "demandes" : "demande"}`
              }
              sx={{ "& p": { marginBottom: 0 } }}
            />
            <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} fullWidth maxWidth="sm">
              {detailsOpen && selectedUser && (
                <>
                  <DialogTitle>
                    Détails de la demande
                    <IconButton
                      aria-label="close"
                      onClick={() => setDetailsOpen(false)}
                      sx={{ position: "absolute", right: 8, top: 8 }}
                    >
                      <CloseRounded />
                    </IconButton>
                  </DialogTitle>
                  <DialogContent sx={{ p: 3 }} dividers>
                    <Box display="flex" flexDirection={{ xs: "column" }} gap={3} textAlign="center">
                      <Box elevation={2} sx={{ flex: 1, borderRadius: 2, gap: 2 }}>
                        <Badge overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                          <Avatar src={selectedUser.profile_picture || "/userProfile.jpg"} sx={{ width: 80, height: 80, mx: "auto", mb: 1 }} />
                        </Badge>
                        <Typography variant="h6" gutterBottom>
                          {selectedUser.first_name} {selectedUser.last_name}
                        </Typography>
                        <Box>
                          <Chip label={getStatusLabel(selectedUser.status)} sx={{ fontWeight: "bold", px: 1 }} />
                        </Box>
                      </Box>
                      <Divider />
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                          <Box textAlign="start" mb={2}>
                            <Typography>{selectedUser.id}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              ID
                            </Typography>
                          </Box>
                          <Box textAlign="start">
                            <Typography>{selectedUser.matricule_professionnel}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Numéro matricule
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                          <Box textAlign="start" mb={2}>
                            <Typography>{selectedUser.phone_number}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Téléphone
                            </Typography>
                          </Box>
                          <Box textAlign="start">
                            <Typography>{selectedUser.email}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Adresse email
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                          <Box textAlign="start" mb={2}>
                            <Typography>{selectedUser.fonction}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Fonction
                            </Typography>
                          </Box>
                          <Box textAlign="start">
                            <Typography>{selectedUser?.hospital?.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Hôpital
                            </Typography>
                          </Box>
                        </Grid>
                        {selectedUser.status === "new" && (
                          <Grid size={12}>
                            <TextField
                              fullWidth
                              sx={{ mt: 2 }}
                              select
                              name="user_type"
                              label="Donner un rôle à cet Personnel"
                              value={newType || ""}
                              onChange={(e) => setNewType(e.target.value)}
                            >
                              {theUserType?.length > 0 ? (
                                theUserType.map((value) => (
                                  <MenuItem key={value} value={value}>
                                    {typeUser(value)}
                                  </MenuItem>
                                ))
                              ) : (
                                <MenuItem disabled>Aucune option disponible</MenuItem>
                              )}
                            </TextField>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  </DialogContent>
                  <DialogActions sx={{ p: 2 }}>
                    <Box elevation={2} sx={{ flex: 1, borderRadius: 2, display: "flex", flexDirection: "column" }}>
                      <Box display="flex" flexWrap="wrap" gap={1} mt="auto" marginLeft="auto">
                        {selectedUser.status === "new" && (
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={<CheckCircle />}
                            onClick={() => handleApprove(selectedUser.id)}
                            disabled={!newType}
                            sx={{ borderRadius: 1, textTransform: "none", fontWeight: "bold" }}
                          >
                            APPROUVER
                          </Button>
                        )}
                        {selectedUser.status === "rejected" && (
                          <Button
                            variant="contained"
                            color="warning"
                            startIcon={<History />}
                            onClick={() => handleRenew(selectedUser.id)}
                            sx={{ borderRadius: 1, textTransform: "none", fontWeight: "bold" }}
                          >
                            RÉINTÉGRER
                          </Button>
                        )}
                        {selectedUser.status === "new" && (
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<Cancel />}
                            onClick={() => handleReject(selectedUser.id)}
                            sx={{ borderRadius: 1, textTransform: "none", fontWeight: "bold" }}
                          >
                            REJETER
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </DialogActions>
                </>
              )}
            </Dialog>

            <Dialog open={editDialogOpen} onClose={handleCloseDialog} fullWidth>
              <DialogTitle>Modifier les informations de l&apos;utilisateur</DialogTitle>
              <DialogContent>
                <TextField
                  label="Nom"
                  value={editedUser?.last_name || ""}
                  onChange={(e) => setEditedUser({ ...editedUser, last_name: e.target.value })}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Prénom"
                  value={editedUser?.first_name || ""}
                  onChange={(e) => setEditedUser({ ...editedUser, first_name: e.target.value })}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Email"
                  value={editedUser?.email || ""}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Service"
                  value={editedUser?.service?.name || editedUser?.service || ""}
                  onChange={(e) =>
                    setEditedUser({
                      ...editedUser,
                      service: { ...editedUser.service, name: e.target.value },
                    })
                  }
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Fonction"
                  value={editedUser?.fonction || ""}
                  onChange={(e) => setEditedUser({ ...editedUser, fonction: e.target.value })}
                  fullWidth
                  margin="normal"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                  Annuler
                </Button>
                <Button onClick={handleSaveUser} color="primary">
                  Sauvegarder
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} maxWidth="sm" fullWidth>
              <DialogTitle>Filtrer les demandes</DialogTitle>
              <DialogContent>
                <TextField
                  select
                  label="Service"
                  value={currentFilter.service}
                  onChange={(e) =>
                    handleFilterChange({
                      ...currentFilter,
                      service: e.target.value,
                    })
                  }
                  fullWidth
                  margin="normal"
                >
                  <MenuItem value="all">Tous</MenuItem>
                  {[...new Set(users.map((user) => user.service?.name || "Non spécifié"))].map((serv) => (
                    <MenuItem key={serv} value={serv}>
                      {serv}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Fonction"
                  value={currentFilter.fonction}
                  onChange={(e) =>
                    handleFilterChange({
                      ...currentFilter,
                      fonction: e.target.value,
                    })
                  }
                  fullWidth
                  margin="normal"
                >
                  <MenuItem value="all">Toutes</MenuItem>
                  {[...new Set(users.map((user) => user.fonction || "Non spécifié"))].map((func) => (
                    <MenuItem key={func} value={func}>
                      {func}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Statut"
                  value={currentFilter.status}
                  onChange={(e) =>
                    handleFilterChange({
                      ...currentFilter,
                      status: e.target.value,
                    })
                  }
                  fullWidth
                  margin="normal"
                >
                  <MenuItem value="all">Tous</MenuItem>
                  {["new", "rejected"].map((status) => (
                    <MenuItem key={status} value={status}>
                      {getStatusLabel(status)}
                    </MenuItem>
                  ))}
                </TextField>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    handleFilterChange({ service: "all", fonction: "all", status: "all" });
                  }}
                  color="secondary"
                >
                  Réinitialiser
                </Button>
                <Button onClick={() => setFilterDialogOpen(false)} color="primary">
                  Fermer
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Paper>
    </Box>
  );
};





// import {
//     useEffect,
//     useState,
//     useMemo,
// } from "react";
// import {
//     Box,
//     Paper,
//     Typography,
//     Avatar,
//     Button,
//     IconButton,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     TablePagination,
//     Tooltip,
//     Chip,
//     TextField,
//     InputAdornment,
//     Card,
//     CardContent,
//     Tab,
//     Tabs,
//     Badge,
//     alpha,
//     Grid,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     Divider,
//     MenuItem,
//     useTheme
// } from "@mui/material";
// import {
//     CheckCircle,
//     Cancel,
//     Search,
//     FilterList,
//     Person,
//     EventNote,
//     Refresh,
//     ArrowDownward,
//     ArrowUpward,
//     Info,
//     Warning,
//     OpenInNewRounded,
//     CloseRounded,
//     History,
//     PersonAddRounded,
// } from "@mui/icons-material";
// import { styled } from "@mui/material/styles";
// import { apiTogetAll, updateUser } from "../../../utils/ApiServices";

// const StatusChip = styled(Chip)(({ theme, status }) => ({
//     ...(status === "new" && {
//         backgroundColor: alpha(theme.palette.info.main, 0.1),
//         color: theme.palette.info.dark,
//         fontWeight: "bold",
//     }),
//     ...(status === "rejected" && {
//         backgroundColor: alpha(theme.palette.error.main, 0.1),
//         color: theme.palette.error.dark,
//         fontWeight: "bold",
//     }),
//     ...(status === "approved" && {
//         backgroundColor: alpha(theme.palette.success.main, 0.1),
//         color: theme.palette.success.dark,
//         fontWeight: "bold",
//     }),
// }));

// export const Demande = () => {
//     const [users, setUsers] = useState([]);
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(5);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [selectedTab, setSelectedTab] = useState(0);
//     const [currentSort, setCurrentSort] = useState({
//         field: "date_joined",
//         direction: "desc",
//     });
//     const [currentFilter, setCurrentFilter] = useState({
//         service: "all",
//         fonction: "all",
//         status: "all",
//     });
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [newType, setNewType] = useState(null);
//     const [detailsOpen, setDetailsOpen] = useState(false);

//     const [filterDialogOpen, setFilterDialogOpen] = useState(false);
//     // const [showOnlyIncomplete, setShowOnlyIncomplete] = useState(false);
//     const [editDialogOpen, setEditDialogOpen] = useState(false);
//     const [editedUser, setEditedUser] = useState(null);
//     const theme = useTheme()
//     const fetchUserData = async () => {
//         const InactiveUsersData = await apiTogetAll('comptes/users/?is_active=false');
//         const sortedInactiveUsers = InactiveUsersData.sort((a, b) => a.last_name.localeCompare(b.last_name))
//         setUsers(sortedInactiveUsers);
//     };

//     useEffect(() => {
//         fetchUserData();
//     }, []);

//     const filteredUsers = useMemo(() => {
//         return (users || [])
//             .filter((user) => {
//                 return user.status !== "blocked" && user.status !== "approved";
//             })
//             .filter((user) => {
//                 const fullName = `${user?.first_name || ''} ${user?.last_name || ''}`.toLowerCase();
//                 const searchLower = (searchQuery || '').toLowerCase();
//                 return (
//                     fullName.includes(searchLower) ||
//                     (user?.email || '').toLowerCase().includes(searchLower) ||
//                     (user?.service.name || '').toLowerCase().includes(searchLower) ||
//                     (user?.fonction || '').toLowerCase().includes(searchLower)
//                 );
//             }).filter((user) => {
//                 if (currentFilter.service !== "all" && user.service?.name !== currentFilter.service)
//                     return false;
//                 if (currentFilter.fonction !== "all" && user.fonction !== currentFilter.fonction)
//                     return false;
//                 if (currentFilter.status !== "all" && user.status !== currentFilter.status)
//                     return false;
//                 if (selectedTab === 0) return true;
//                 if (selectedTab === 1) return user.status === "new";
//                 if (selectedTab === 2) return user.status === "rejected";
//                 return false;
//             }).sort((a, b) => {
//                 const { field, direction } = currentSort;
//                 if (field === "name") {
//                     const nameA = `${a.last_name} ${a.first_name}`;
//                     const nameB = `${b.last_name} ${b.first_name}`;
//                     return direction === "asc"
//                         ? nameA.localeCompare(nameB)
//                         : nameB.localeCompare(nameA);
//                 }
//                 if (field === "date_joined") {
//                     return direction === "asc"
//                         ? new Date(a.date_joined) - new Date(b.date_joined)
//                         : new Date(b.date_joined) - new Date(a.date_joined);
//                 }
//                 if (field === "documents") {
//                     const ratioA = a.documents_submitted / a.documents_required;
//                     const ratioB = b.documents_submitted / b.documents_required;
//                     return direction === "asc" ? ratioA - ratioB : ratioB - ratioA;
//                 }
//                 return 0;
//             });
//     }, [
//         users,
//         searchQuery,
//         currentFilter,
//         showOnlyIncomplete,
//         selectedTab,
//         currentSort,
//     ]);

//     const handleRenew = (userId) => {
//         setUsers((users) =>
//             users.map((user) =>
//                 user.id === userId ? { ...user, status: "new" } : user
//             )
//         );
//         if (detailsOpen && selectedUser?.id === userId) {
//             setDetailsOpen(false);
//         }
//     };

//     const handleApprove = async (userId) => {
//         if (newType !== "" && newType !== null) {
//             const udatedUser = await updateUser(userId, { status: "approved", is_active: true, user_type: newType });

//             // Après approbation, supprimer l'utilisateur de la liste
//             setUsers((prevUsers) => prevUsers.filter(user => user.id !== userId));

//             if (detailsOpen && selectedUser?.id === userId) {
//                 setDetailsOpen(false);
//             }
//         } else {
//             // Si aucun type n'est sélectionné, gardez la boîte de dialogue ouverte
//             setDetailsOpen(true);
//         }
//     };

//     const handleReject = (userId) => {
//         updateUser(userId, { status: "rejected" });
//         setUsers((users) =>
//             users.map((user) =>
//                 user.id === userId ? { ...user, status: "rejected" } : user
//             )
//         )
//         if (detailsOpen && selectedUser?.id === userId) {
//             setDetailsOpen(false);
//         }
//     };

//     const handleSort = (field) => {
//         setCurrentSort((prev) => ({
//             field,
//             direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
//         }));
//     };

//     const handleViewDetails = (user) => {
//         setSelectedUser(user);
//         setNewType(null); // Réinitialiser le type sélectionné
//         setDetailsOpen(true);
//     };

//     const handleTabChange = (event, newValue) => {
//         setSelectedTab(newValue);
//         setPage(0);
//     };

//     const formatDate = (dateString) => {
//         const options = {
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//         };
//         return new Date(dateString).toLocaleDateString("fr-FR", options);
//     };
//     const formatHour = (dateString) => {
//         const options = {
//             hour: "2-digit",
//             minute: "2-digit",
//         };
//         return new Date(dateString).toLocaleTimeString("fr-FR", options);
//     };

//     const getStatusLabel = (status) => {
//         switch (status) {
//             case "new":
//                 return "Nouvelle";
//             case "rejected":
//                 return "Rejetée";
//             default:
//                 return status;
//         }
//     };
//     const theUserType = ["super_admin", "admin", "simple_user"];
//     const typeUser = (type) => {
//         switch (type) {
//             case "super_admin":
//                 return "Super Admin";
//             case "admin":
//                 return "Admin";
//             case "simple_user":
//                 return "Utilisateur simple";
//             default:
//                 return type;
//         }
//     };

//     const handleCloseDialog = () => {
//         setEditDialogOpen(false);
//     };

//     const handleSaveUser = () => {
//         setUsers((users) =>
//             users.map((user) =>
//                 user.id === editedUser.id ? { ...editedUser } : user
//             )
//         );
//         setEditDialogOpen(false);
//     };

//     // Mis à jour pour n'inclure que les utilisateurs non approuvés
//     const stats = useMemo(() => {
//         const total = users.filter((user) => user.status !== "blocked" && user.status !== "approved").length;
//         const newCount = users.filter((user) => user.status === "new").length;
//         const rejectedCount = users.filter((user) => user.status === "rejected").length;

//         return {
//             total,
//             new: newCount,
//             rejected: rejectedCount,
//         };
//     }, [users]);

//     return (
//         <Box sx={{ p: { xs: 2, md: 3 } }}>
//             {/* En-tête avec statistiques */}
//             <Box mb={4}>
//                 <Box>
//                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                         <PersonAddRounded sx={{ mr: 2, fontSize: 30 }} color="primary" />
//                         <Typography variant="h6" component="h6" fontWeight="bold">
//                             Demandes d&apos;inscription
//                         </Typography>
//                     </Box>
//                     <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
//                         Gérez les demandes d&apos;inscription soumis par des nouveaux personnels
//                     </Typography>
//                 </Box>

//                 <Grid container spacing={2} mt={3}>
//                     <Grid size={{ xs: 12, sm: 12, md: 4 }}>
//                         <Card sx={{ backgroundColor: alpha('#3f51b5', 0.05), border: 1, borderColor: alpha('#3f51b5', 0.1) }}>
//                             <CardContent>
//                                 <Box display="flex" alignItems="center" mb={1}>
//                                     <Person sx={{ color: 'primary.main', mr: 1 }} />
//                                     <Typography variant="subtitle2" color="text.secondary">
//                                         Total des demandes
//                                     </Typography>
//                                 </Box>
//                                 <Typography variant="h4" fontWeight="bold">
//                                     {stats.total || 0}
//                                 </Typography>
//                                 <Typography variant="body2" color="text.secondary" mt={1}>
//                                     {stats.new || 0} nouveau, {stats.rejected || 0} rejetées
//                                 </Typography>
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                     <Grid size={{ xs: 12, sm: 12, md: 4 }}>
//                         <Card sx={{ backgroundColor: alpha('#4caf50', 0.05), border: 1, borderColor: alpha('#4caf50', 0.1) }}>
//                             <CardContent>
//                                 <Box display="flex" alignItems="center" mb={1}>
//                                     <EventNote sx={{ color: 'success.main', mr: 1 }} />
//                                     <Typography variant="subtitle2" color="text.secondary">
//                                         Nouvelles
//                                     </Typography>
//                                 </Box>
//                                 <Typography variant="h4" fontWeight="bold">
//                                     {stats.new || 0}
//                                 </Typography>
//                                 <Typography variant="body2" color="text.secondary" mt={1}>
//                                     Nouvelles Demande à traiter en priorité
//                                 </Typography>
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                     <Grid size={{ xs: 12, sm: 12, md: 4 }}>
//                         <Card sx={{ backgroundColor: alpha('#f44336', 0.05), border: 1, borderColor: alpha('#f44336', 0.1) }}>
//                             <CardContent>
//                                 <Box display="flex" alignItems="center" mb={1}>
//                                     <Warning sx={{ color: 'error.main', mr: 1 }} />
//                                     <Typography variant="subtitle2" color="text.secondary">
//                                         Rejetée
//                                     </Typography>
//                                 </Box>
//                                 <Typography variant="h4" fontWeight="bold">
//                                     {stats.rejected || 0}
//                                 </Typography>
//                                 <Typography variant="body2" color="text.secondary" mt={1}>
//                                     Les demande qui ont été rejetées
//                                 </Typography>
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                 </Grid>
//             </Box>

//             {/* Onglets de statut */}
//             <Paper sx={{ mb: 3, p: 0, borderRadius: 2, boxShadow: 1 }}>
//                 <Tabs
//                     value={selectedTab}
//                     onChange={handleTabChange}
//                     indicatorColor="primary"
//                     textColor="primary"
//                     variant="fullWidth"
//                 >
//                     <Tab
//                         label={
//                             <Box display="flex" alignItems="center" gap={1}>
//                                 <Badge badgeContent={stats.total || 0} color="primary">
//                                     <Person />
//                                 </Badge>
//                                 <Box>Toutes</Box>
//                             </Box>
//                         }
//                     />
//                     <Tab
//                         label={
//                             <Box display="flex" alignItems="center" gap={1}>
//                                 <Badge badgeContent={stats.new || 0} color="info">
//                                     <Info />
//                                 </Badge>
//                                 <Box>Nouvelles</Box>
//                             </Box>
//                         }
//                     />
//                     <Tab
//                         label={
//                             <Box display="flex" alignItems="center" gap={1}>
//                                 <Badge badgeContent={stats.rejected || 0} color="warning">
//                                     <Warning />
//                                 </Badge>
//                                 <Box>Demande rejetée</Box>
//                             </Box>
//                         }
//                     />
//                 </Tabs>
//             </Paper>

//             {/* Barre d'outils */}
//             <Box mb={3} display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between">
//                 <TextField
//                     placeholder="Rechercher par nom, email, département..."
//                     variant="outlined"
//                     size="small"
//                     fullWidth
//                     sx={{ maxWidth: { sm: 400 } }}
//                     value={searchQuery}
//                     onChange={(e) => {
//                         setSearchQuery(e.target.value);
//                         setPage(0);
//                     }}
//                     slotProps={{
//                         input: {
//                             startAdornment: (
//                                 <InputAdornment position="start">
//                                     <Search />
//                                 </InputAdornment>
//                             ),
//                         },
//                     }}
//                 />

//                 <Box display="flex" gap={1}>
//                     <Tooltip title="Filtres avancés">
//                         <Button
//                             startIcon={<FilterList />}
//                             variant="outlined"
//                             size="small"
//                             onClick={() => setFilterDialogOpen(true)}
//                             sx={{
//                                 borderColor: Object.values(currentFilter).some(val => val !== 'all') || showOnlyIncomplete ? 'primary.main' : 'inherit',
//                                 color: Object.values(currentFilter).some(val => val !== 'all') || showOnlyIncomplete ? 'primary.main' : 'inherit',
//                                 fontWeight: Object.values(currentFilter).some(val => val !== 'all') || showOnlyIncomplete ? 'bold' : 'normal',
//                             }}
//                         >
//                             Filtres
//                             {(Object.values(currentFilter).some(val => val !== 'all') || showOnlyIncomplete) &&
//                                 <Box
//                                     component="span"
//                                     sx={{
//                                         ml: 1,
//                                         bgcolor: 'primary.main',
//                                         color: 'white',
//                                         width: 20,
//                                         height: 20,
//                                         borderRadius: '50%',
//                                         display: 'inline-flex',
//                                         alignItems: 'center',
//                                         justifyContent: 'center',
//                                         fontSize: 12
//                                     }}
//                                 >
//                                     {Object.values(currentFilter).filter(val => val !== 'all').length + (showOnlyIncomplete ? 1 : 0)}
//                                 </Box>
//                             }
//                         </Button>
//                     </Tooltip>

//                     <Tooltip title="Actualiser">
//                         <IconButton
//                             size="small"
//                             onClick={fetchUserData}
//                         >
//                             <Refresh />
//                         </IconButton>
//                     </Tooltip>
//                 </Box>
//             </Box>

//             {/* Tableau principal */}
//             <Paper sx={{ borderRadius: 2, boxShadow: 3 }}>
//                 {filteredUsers.length === 0 ? (
//                     <Box py={5} textAlign="center">
//                         <Typography color="text.secondary" mb={2}>Aucune demande ne correspond à vos critères.</Typography>
//                         <Button
//                             variant="outlined"
//                             startIcon={<FilterList />}
//                             onClick={() => {
//                                 setSearchQuery('');
//                                 setCurrentFilter({ service: 'all', fonction: 'all', status: 'all' });
//                                 setShowOnlyIncomplete(false);
//                             }}
//                         >
//                             Effacer les filtres
//                         </Button>
//                     </Box>
//                 ) : (
//                     <>
//                         <TableContainer>
//                             <Table>
//                                 <TableHead>
//                                     <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
//                                         <TableCell width={60}></TableCell>
//                                         <TableCell>
//                                             <Box
//                                                 display="flex"
//                                                 alignItems="center"
//                                                 sx={{ cursor: 'pointer' }}
//                                                 onClick={() => handleSort('name')}
//                                             >
//                                                 <Typography variant="subtitle2" fontWeight="bold">
//                                                     Candidat
//                                                 </Typography>
//                                                 {currentSort.field === 'name' && (
//                                                     currentSort.direction === 'asc' ? <ArrowUpward fontSize="small" sx={{ ml: 0.5 }} /> : <ArrowDownward fontSize="small" sx={{ ml: 0.5 }} />
//                                                 )}
//                                             </Box>
//                                         </TableCell>
//                                         <TableCell>
//                                             <Typography variant="subtitle2" fontWeight="bold">
//                                                 Service
//                                             </Typography>
//                                         </TableCell>
//                                         <TableCell>
//                                             <Box
//                                                 display="flex"
//                                                 alignItems="center"
//                                                 sx={{ cursor: 'pointer' }}
//                                                 onClick={() => handleSort('date_joined')}
//                                             >
//                                                 <Typography variant="subtitle2" fontWeight="bold">
//                                                     Date de soumission
//                                                 </Typography>
//                                                 {currentSort.field === 'date_joined' && (
//                                                     currentSort.direction === 'asc' ? <ArrowUpward fontSize="small" sx={{ ml: 0.5 }} /> : <ArrowDownward fontSize="small" sx={{ ml: 0.5 }} />
//                                                 )}
//                                             </Box>
//                                         </TableCell>
//                                         <TableCell>
//                                             <Typography variant="subtitle2" fontWeight="bold">
//                                                 Statut
//                                             </Typography>
//                                         </TableCell>
//                                         <TableCell align="right">
//                                             <Typography variant="subtitle2" fontWeight="bold">
//                                                 Actions
//                                             </Typography>
//                                         </TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
//                                         <TableRow
//                                             key={user.id}
//                                             hover
//                                             sx={{
//                                                 transition: 'background-color 0.3s',
//                                                 '&:hover': {
//                                                     backgroundColor: alpha('#f5f5f5', 0.5),
//                                                 },
//                                             }}
//                                         >
//                                             <TableCell>
//                                                 <Avatar
//                                                     alt={`${user.first_name} ${user.last_name}`}
//                                                     src={user.profile_picture || "/profile.jpg"}
//                                                     sx={{
//                                                         width: 45,
//                                                         height: 45,
//                                                         border: 2,
//                                                         borderColor: user.status === 'new' ? 'info.light' : 'grey.300'
//                                                     }}
//                                                 />
//                                             </TableCell>
//                                             <TableCell>
//                                                 <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//                                                     <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
//                                                         {user.first_name} {user.last_name}
//                                                     </Typography>
//                                                     <Typography variant="body2" color="text.secondary">
//                                                         {user.email}
//                                                     </Typography>
//                                                     <Typography variant="body2" color="text.secondary">
//                                                         {user.phone}
//                                                     </Typography>
//                                                 </Box>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//                                                     <Typography variant="body2">
//                                                         {user.fonction}
//                                                     </Typography>
//                                                     <Typography variant="caption" color="text.secondary">
//                                                         {user.service.name || 'Département non specifié'}
//                                                     </Typography>
//                                                 </Box>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//                                                     <Typography variant="body2">
//                                                         {formatDate(user.date_joined)}
//                                                     </Typography>
//                                                     <Typography variant="caption" color="text.secondary">
//                                                         à : {formatHour(user.date_joined)}
//                                                     </Typography>
//                                                 </Box>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <StatusChip
//                                                     label={getStatusLabel(user.status)}
//                                                     status={user.status}
//                                                     size="small"
//                                                     icon={
//                                                         user.status === 'new' ? <Info fontSize="small" /> :
//                                                             <Cancel fontSize="small" />
//                                                     }
//                                                 />
//                                             </TableCell>
//                                             <TableCell align="right">
//                                                 <Box display="flex" justifyContent="flex-end">
//                                                     <Tooltip title="Voir les détails">
//                                                         <IconButton
//                                                             size="small"
//                                                             onClick={() => handleViewDetails(user)}
//                                                             sx={{
//                                                                 color: theme.palette.primary.main,
//                                                                 backgroundColor: alpha(theme.palette.primary.main, 0.1),
//                                                                 '&:hover': {
//                                                                     backgroundColor: alpha(theme.palette.primary.main, 0.2),
//                                                                 }
//                                                             }}
//                                                         >
//                                                             <OpenInNewRounded fontSize="small" />
//                                                         </IconButton>
//                                                     </Tooltip>
//                                                 </Box>
//                                             </TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                         <TablePagination
//                             rowsPerPageOptions={[5, 10, 25]}
//                             count={filteredUsers.length}
//                             component="div"
//                             onPageChange={(_, newPage) => setPage(newPage)}
//                             page={page}
//                             rowsPerPage={rowsPerPage}
//                             onRowsPerPageChange={(event) => {
//                                 setRowsPerPage(parseInt(event.target.value, 10));
//                                 setPage(0);
//                             }}
//                             labelRowsPerPage="Lignes par page :"
//                             labelDisplayedRows={({ from, to, count }) =>
//                                 `${from}-${to} sur ${count} ${count !== 1 ? 'demandes' : 'demande'}`
//                             }
//                             sx={{ '& p': { marginBottom: 0 } }}
//                         />
//                         <Dialog
//                             open={detailsOpen}
//                             onClose={() => setDetailsOpen(false)}
//                             fullWidth
//                             maxWidth="sm"
//                         >
//                             {detailsOpen && selectedUser && (
//                                 <>
//                                     <DialogTitle>
//                                         Détails de la demande
//                                         <IconButton
//                                             aria-label="close"
//                                             onClick={() => setDetailsOpen(false)}
//                                             sx={{ position: 'absolute', right: 8, top: 8 }}
//                                         >
//                                             <CloseRounded />
//                                         </IconButton>
//                                     </DialogTitle>

//                                     <DialogContent sx={{ p: 3 }} dividers>
//                                         <Box display="flex" flexDirection={{ xs: "column" }} gap={3} textAlign={'center'}>
//                                             {/* Panneau gauche - Informations personnelles */}
//                                             <Box elevation={2} sx={{ flex: 1, borderRadius: 2, gap: 2, }}>
//                                                 <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
//                                                     <Avatar src={selectedUser.profile_picture || "/userProfile.jpg"} sx={{ width: 80, height: 80, mx: "auto", mb: 1 }} />
//                                                 </Badge>
//                                                 <Typography variant="h6" gutterBottom>
//                                                     {selectedUser.first_name} {selectedUser.last_name}
//                                                 </Typography>
//                                                 <Box>
//                                                     <Chip
//                                                         label={getStatusLabel(selectedUser.status)}
//                                                         sx={{ fontWeight: 'bold', px: 1 }}
//                                                     />
//                                                 </Box>
//                                             </Box>
//                                             <Divider />
//                                             <Grid container spacing={2}>
//                                                 <Grid size={{ xs: 12, sm: 4, md: 4 }}>
//                                                     <Box textAlign={'start'} mb={2}>
//                                                         <Typography>
//                                                             {selectedUser.id}
//                                                         </Typography>

//                                                         <Typography variant="body2" color="text.secondary">ID</Typography>

//                                                     </Box>
//                                                     <Box textAlign={'start'}>
//                                                         <Typography>
//                                                             {selectedUser.matricule_professionnel}
//                                                         </Typography>

//                                                         <Typography variant="body2" color="text.secondary">numéro matricule</Typography>

//                                                     </Box>
//                                                 </Grid>
//                                                 <Grid size={{ xs: 12, sm: 4, md: 4 }}>
//                                                     <Box textAlign={'start'} mb={2}>
//                                                         <Typography>
//                                                             {selectedUser.phone_number}
//                                                         </Typography>

//                                                         <Typography variant="body2" color="text.secondary">Téléphone</Typography>

//                                                     </Box>
//                                                     <Box textAlign={'start'}>
//                                                         <Typography>
//                                                             {selectedUser.email}
//                                                         </Typography>

//                                                         <Typography variant="body2" color="text.secondary">Adresse email</Typography>

//                                                     </Box>
//                                                 </Grid>
//                                                 <Grid size={{ xs: 12, sm: 4, md: 4 }}>
//                                                     <Box textAlign={'start'} mb={2}>
//                                                         <Typography>
//                                                             {selectedUser.fonction}
//                                                         </Typography>

//                                                         <Typography variant="body2" color="text.secondary">Fonction</Typography>

//                                                     </Box>
//                                                     <Box textAlign={'start'}>
//                                                         <Typography>
//                                                             {selectedUser?.hospital?.name}
//                                                         </Typography>

//                                                         <Typography variant="body2" color="text.secondary">Hôpital</Typography>

//                                                     </Box>
//                                                 </Grid>
//                                                 {(selectedUser.status === "new") && (
//                                                     <Grid size={12}>
//                                                         <TextField
//                                                             fullWidth
//                                                             sx={{ mt: 2 }}
//                                                             select
//                                                             name="user_type"
//                                                             label={'Donner un rôle à cet Personnel'}
//                                                             value={newType}
//                                                             onChange={(e) => setNewType(e.target.value)}
//                                                         >
//                                                             {theUserType?.length > 0 ? (
//                                                                 theUserType.map((value) => (
//                                                                     <MenuItem key={value} value={value}>
//                                                                         {typeUser(value)}
//                                                                     </MenuItem>
//                                                                 ))
//                                                             ) : (
//                                                                 <MenuItem disabled>Aucune option disponible</MenuItem>
//                                                             )}
//                                                         </TextField>

//                                                     </Grid>
//                                                 )}
//                                             </Grid>
//                                         </Box>
//                                     </DialogContent>
//                                     <DialogActions sx={{ p: 2 }}>
//                                         <Box
//                                             elevation={2}
//                                             sx={{
//                                                 flex: 1,
//                                                 borderRadius: 2,
//                                                 display: 'flex',
//                                                 flexDirection: 'column',
//                                             }}
//                                         >
//                                             {/* Actions */}
//                                             <Box display="flex" flexWrap="wrap" gap={1} mt="auto" marginLeft={'auto'}>
//                                                 {(selectedUser.status === "new") && (
//                                                     <Button
//                                                         variant="contained"
//                                                         color="success"
//                                                         startIcon={<CheckCircle />}
//                                                         onClick={() => handleApprove(selectedUser.id)}
//                                                         disabled={!newType}
//                                                         sx={{ borderRadius: 1, textTransform: 'none', fontWeight: 'bold' }}
//                                                     >
//                                                         APPROUVER
//                                                     </Button>
//                                                 )}

//                                                 {(selectedUser.status === "rejected") && (
//                                                     <Button
//                                                         variant="contained"
//                                                         color="warning"
//                                                         startIcon={<History />}
//                                                         onClick={() => handleRenew(selectedUser.id)}
//                                                         sx={{ borderRadius: 1, textTransform: 'none', fontWeight: 'bold' }}
//                                                     >
//                                                         RÉINTÉGRER
//                                                     </Button>
//                                                 )}

//                                                 {(selectedUser.status === "new") && (
//                                                     <Button
//                                                         variant="outlined"
//                                                         color="error"
//                                                         startIcon={<Cancel />}
//                                                         onClick={() => handleReject(selectedUser.id)}
//                                                         sx={{ borderRadius: 1, textTransform: 'none', fontWeight: 'bold' }}
//                                                     >
//                                                         REJETER
//                                                     </Button>
//                                                 )}
//                                             </Box>
//                                         </Box>
//                                     </DialogActions>
//                                 </>
//                             )}
//                         </Dialog>

//                         <Dialog open={editDialogOpen} onClose={handleCloseDialog} fullWidth>
//                             <DialogTitle>Modifier les informations de l&apos;utilisateur</DialogTitle>
//                             <DialogContent>
//                                 <TextField
//                                     label="Nom"
//                                     value={editedUser?.last_name || ""}
//                                     onChange={(e) =>
//                                         setEditedUser({ ...editedUser, last_name: e.target.value })
//                                     }
//                                     fullWidth
//                                     margin="normal"
//                                 />
//                                 <TextField
//                                     label="Prénom"
//                                     value={editedUser?.first_name || ""}
//                                     onChange={(e) =>
//                                         setEditedUser({ ...editedUser, first_name: e.target.value })
//                                     }
//                                     fullWidth
//                                     margin="normal"
//                                 />
//                                 <TextField
//                                     label="Email"
//                                     value={editedUser?.email || ""}
//                                     onChange={(e) =>
//                                         setEditedUser({ ...editedUser, email: e.target.value })
//                                     }
//                                     fullWidth
//                                     margin="normal"
//                                 />
//                                 <TextField
//                                     label="Service"
//                                     value={editedUser?.service.name || ""}
//                                     onChange={(e) =>
//                                         setEditedUser({
//                                             ...editedUser,
//                                             service: e.target.value,
//                                         })
//                                     }
//                                     fullWidth
//                                     margin="normal"
//                                 />
//                                 <TextField
//                                     label="Fonction"
//                                     value={editedUser?.fonction || ""}
//                                     onChange={(e) =>
//                                         setEditedUser({ ...editedUser, fonction: e.target.value })
//                                     }
//                                     fullWidth
//                                     margin="normal"
//                                 />
//                             </DialogContent>
//                             <DialogActions>
//                                 <Button onClick={handleCloseDialog} color="primary">
//                                     Annuler
//                                 </Button>
//                                 <Button onClick={handleSaveUser} color="primary">
//                                     Sauvegarder
//                                 </Button>
//                             </DialogActions>
//                         </Dialog>

//                         <Dialog
//                             open={filterDialogOpen}
//                             onClose={() => setFilterDialogOpen(false)}
//                             maxWidth="sm"
//                             fullWidth
//                         >
//                             <DialogTitle>Filtrer les demandes</DialogTitle>
//                             <DialogContent>
//                                 <TextField
//                                     select
//                                     label="Service"
//                                     value={currentFilter.service}
//                                     onChange={(e) =>
//                                         setCurrentFilter({
//                                             ...currentFilter,
//                                             service: e.target.value,
//                                         })
//                                     }
//                                     fullWidth
//                                     margin="normal"
//                                 >
//                                     <MenuItem value="all">Tous</MenuItem>
//                                     {[...new Set(users.map((user) => user.service?.name || "Non spécifié"))].map(
//                                         (serv) => (
//                                             <MenuItem key={serv} value={serv}>
//                                                 {serv}
//                                             </MenuItem>
//                                         )
//                                     )}
//                                 </TextField>
//                                 <TextField
//                                     select
//                                     label="Fonction"
//                                     value={currentFilter.fonction}
//                                     onChange={(e) =>
//                                         setCurrentFilter({
//                                             ...currentFilter,
//                                             fonction: e.target.value,
//                                         })
//                                     }
//                                     fullWidth
//                                     margin="normal"
//                                 >
//                                     <MenuItem value="all">Toutes</MenuItem>
//                                     {[...new Set(users.map((user) => user.fonction))].map((func) => (
//                                         <MenuItem key={func} value={func}>
//                                             {func}
//                                         </MenuItem>
//                                     ))}
//                                 </TextField>
//                                 <TextField
//                                     select
//                                     label="Statut"
//                                     value={currentFilter.status}
//                                     onChange={(e) =>
//                                         setCurrentFilter({ ...currentFilter, status: e.target.value })
//                                     }
//                                     fullWidth
//                                     margin="normal"
//                                 >
//                                     <MenuItem value="all">Tous</MenuItem>
//                                     {["new", "rejected"].map((status) => (
//                                         <MenuItem key={status} value={status}>
//                                             {getStatusLabel(status)}
//                                         </MenuItem>
//                                     ))}
//                                 </TextField>
//                             </DialogContent>
//                             <DialogActions>
//                                 <Button onClick={() => setFilterDialogOpen(false)} color="primary">
//                                     Fermer
//                                 </Button>
//                             </DialogActions>
//                         </Dialog>
//                     </>
//                 )}
//             </Paper>
//         </Box >
//     );
// };