import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { visuallyHidden } from '@mui/utils';
import { Searche_Field } from '../../../../inputs/Searche_Field';
import { Divider } from '@mui/material';
import './DataTable.css';

function createData(id, reportdate, statut, attribue, numir, genre, sortiesu, sortiees) {
    return {
        id,
        reportdate,
        statut,
        attribue,
        numir,
        genre,
        sortiesu,
        sortiees
    };
}

const rows = [
    createData(1, '2024-12-14', 'Terminé', '', '053/1560/2', 'Féminin', 'Retour à domicile'),
    createData(2, '2024-10-14', 'Terminé', '', '053/1560/2', 'Féminin', 'Retour à domicile'),
    createData(3, '2024-09-14', 'Terminé', '', '053/1560/2', 'Féminin', 'Retour à domicile'),
    createData(4, '2024-08-14', 'Terminé', '', '053/1560/2', 'Féminin', 'Retour à domicile'),
    createData(5, '2024-07-14', 'Terminé', '', '053/1560/2', 'Féminin', 'Retour à domicile'),
    createData(6, '2024-06-14', 'Terminé', '', '053/1560/2', 'Féminin', 'Retour à domicile'),
    createData(7, '2024-05-14', 'Terminé', '', '053/1560/2', 'Féminin', 'Retour à domicile'),
    createData(8, '2024-04-14', 'Terminé', '', '053/1560/2', 'Féminin', 'Retour à domicile'),
    createData(9, '2024-03-14', 'Terminé', '', '053/1560/2', 'Féminin', 'Retour à domicile'),
    createData(10, '2024-02-14', 'Terminé', '', '053/1560/2', 'Féminin', 'Retour à domicile'),

];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
    {
        id: 'reportdate',
        numeric: false,
        disablePadding: true,
        label: 'Report Date',
    },
    {
        id: 'statut',
        numeric: true,
        disablePadding: false,
        label: 'Statut',
    },
    {
        id: 'attribue',
        numeric: true,
        disablePadding: false,
        label: 'Attribue',
    },
    {
        id: "Numeroidentificationauregistre",
        numeric: true,
        disablePadding: false,
        label: "Numéro d'identification au registre",
    },
    {
        id: 'genre',
        numeric: true,
        disablePadding: false,
        label: 'Genre',
    },
    {
        id: 'sortieduSU',
        numeric: true,
        disablePadding: false,
        label: 'Sortie du SU',
    },
    {
        id: 'sortiedeletablissementdesanté',
        numeric: true,
        disablePadding: false,
        label: "Sortie de l'établissement de santé",
    },
];

function EnhancedTableHead(props) {
    const theme = useTheme
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={'left'}
                        // align={headCell.numeric ? 'left':'right'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
    const { numSelected } = props;
    return (
        <Toolbar
            component={'div'}
            sx={[
                {
                    bgcolor: 'whitesmoke',
                },
                numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                },
            ]}
        >
            <div className='d-flex flex-column flex-grow-1 justify-content-between'>
                <div className='d-flex flex-grow-1 justify-content-start'>

                </div>
                <div className='d-flex flex-grow-1 justify-content-between align-items-center'>

                    {numSelected > 0 ? (
                        <Typography
                            color="inherit"
                            variant="subtitle1"
                            component="div"
                        >
                            {numSelected} {numSelected<2 ? 'Selectionné':'Selectionnés'}
                        </Typography>
                    ) : (
                        <Typography
                            variant="h6"
                            id="tableTitle"
                            component="div"
                        >
                            Evénement enregistrés
                        </Typography>
                    )}
                    <div className='d-flex align-items-center '>
                        <Searche_Field />
                        <Divider sx={{ height: 35, ml:1.5 }} orientation="vertical" />
                        {numSelected > 0 ? (
                            <Tooltip title="Effacer">
                                <IconButton>
                                    <DeleteIcon color='error' />
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <Tooltip title="Ajout">
                                <IconButton>
                                    <AddCircleIcon color='success' />
                                </IconButton>
                            </Tooltip>
                        )}
                    </div>
                </div>
            </div>
        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

export const DataTable = () => {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('reportdate');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            [...rows]
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [order, orderBy, page, rowsPerPage],
    );

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar numSelected={selected.length} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {visibleRows.map((row, index) => {
                                const isItemSelected = selected.includes(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row.id)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell component="th" id={labelId} scope="row" padding="none">{row.reportdate}</TableCell>
                                        <TableCell align="left">{row.statut}</TableCell>
                                        <TableCell align="left">{row.attribue}</TableCell>
                                        <TableCell align="left">{row.numir}</TableCell>
                                        <TableCell align="left">{row.genre}</TableCell>
                                        <TableCell align="left">{row.sortiesu}</TableCell>
                                        <TableCell align="left">{row.sortiees}</TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    labelRowsPerPage={'Ligne par page:'}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{ '& p':{marginBottom:0} }}
                >
                </TablePagination>
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Rendre le Tableau dense"
            />
        </Box>
    );
}
