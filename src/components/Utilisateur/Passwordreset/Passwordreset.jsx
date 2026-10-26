import { useState, useEffect } from 'react'
import {
    Email,
    RefreshRounded,
    Search
} from '@mui/icons-material'
import {
    alpha,
    Avatar,
    Badge,
    Box,
    IconButton,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip,
    Typography,
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material'
import { grey } from '@mui/material/colors'
import { apiTogetAll } from '../../../utils/ApiServices'

export const Passwordreset = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [users, setUsers] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [filteredUsers, setFilteredUsers] = useState([])
    const [error, setError] = useState(null)
    const [selectedUser, setSelectedUser] = useState(null)
    const [openResetDialog, setOpenResetDialog] = useState(false)

    const theme = useTheme();

    const handleFetchUsers = async () => {
        try {
            const mockUsers = await apiTogetAll('comptes/users/?is_active=true');
            setUsers(mockUsers);
        } catch (err) {
            setError('Erreur lors de la récupération des utilisateurs')
            console.error(err)
        }
    }

    const handleUserResetPassword = (user) => {
        setSelectedUser(user)
        setOpenResetDialog(true)
    }

    const confirmPasswordReset = () => {
        if (selectedUser) {

            // Close dialog
            setOpenResetDialog(false)
            setSelectedUser(null)
        }
    }

    useEffect(() => {
        let result = [...users]

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                user =>
                    user.first_name?.toLowerCase().includes(query) ||
                    user.last_name?.toLowerCase().includes(query) ||
                    user.email?.toLowerCase().includes(query) ||
                    user.blocage?.[0]?.reason?.toLowerCase().includes(query)
            );
        }

        setFilteredUsers(result);
    }, [searchQuery, users])

    useEffect(() => {
        handleFetchUsers()
    }, [])

    return (
        <>
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'column', md: 'row' } }}>
                <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Réinitialisation des Comptes
                    </Typography>
                    <Typography variant="body1" color="text.secondary" component="p">
                        Gérez les comptes qui sont en attente de réinitialisation
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1, mt: { xs: 2, sm: 0 }, width: { xs: '100%', sm: 'auto' } }}>
                    <TextField
                        size="small"
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search fontSize="small" />
                                </InputAdornment>
                            )
                        }}
                        sx={{
                            width: { xs: '100%', sm: 250 },
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                            }
                        }}
                    />
                </Box>
            </Box>
            <Paper
                sx={{
                    p: { xs: 1, md: 3 },
                    borderRadius: 3,
                    boxShadow: 3,
                    overflow: 'hidden',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                        boxShadow: 6,
                    }
                }}
            >
                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Avatar</TableCell>
                                <TableCell>Nom</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Date de soumission</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((user) => (
                                    <TableRow
                                        key={user.id}
                                        hover
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: grey[300]
                                            }
                                        }}
                                    >
                                        <TableCell>
                                            <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                                                <Avatar
                                                    src={user.profile_picture ? `http://localhost:8000${user.profile_picture}` : "/userProfile.jpg"}
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                    }}
                                                />
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                {user.first_name} {user.last_name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                                                <Email fontSize="small" sx={{ opacity: 0.6, fontSize: 16 }} />
                                                {user.email}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{'23 - 05 - 2025'}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                                <Tooltip title="Réinitialiser le mot de passe">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleUserResetPassword(user)}
                                                        sx={{
                                                            color: theme.palette.primary.main,
                                                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                            '&:hover': {
                                                                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                                            }
                                                        }}
                                                    >
                                                        <RefreshRounded fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredUsers.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(event, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(event) => {
                            setRowsPerPage(parseInt(event.target.value, 10));
                            setPage(0);
                        }}
                        labelDisplayedRows={({ from, to, count }) =>
                            `${from}-${to} sur ${count} ${count !== 1 ? 'utilisateurs' : 'utilisateur'}`
                        }
                        labelRowsPerPage="Lignes par page :"
                        sx={{ '& p': { marginBottom: 0 } }}
                    />
                </TableContainer>
            </Paper>

            {/* Password Reset Confirmation Dialog */}
            <Dialog
                open={openResetDialog}
                onClose={() => setOpenResetDialog(false)}
                aria-labelledby="reset-password-dialog-title"
            >
                <DialogTitle id="reset-password-dialog-title">
                    Réinitialiser le mot de passe
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Voulez-vous vraiment réinitialiser le mot de passe pour
                        {' '}
                        <strong>{selectedUser?.first_name} {selectedUser?.last_name}</strong>
                        {' '}
                        ({selectedUser?.email}) ?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenResetDialog(false)}
                        color="secondary"
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={confirmPasswordReset}
                        color="primary"
                        variant="contained"
                    >
                        Confirmer
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}