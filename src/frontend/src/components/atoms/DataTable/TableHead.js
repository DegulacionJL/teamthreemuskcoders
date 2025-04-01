import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { TableHead as MUITableHead, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';

function TableHead(props) {
  const { order, orderBy, onRequestSort, headCells, actions } = props;
  const { t } = useTranslation();

  const createSortHandler = (property) => (event) => {
    const isAsc = orderBy === property && order === 'asc';
    onRequestSort(event, { order: isAsc ? 'desc' : 'asc', sort: property });
  };

  return (
    <MUITableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              sx={(theme) => ({
                fontWeight: theme.typography.fontWeightBold,
                fontSize: theme.typography.body2.fontSize,
                textTransform: 'uppercase',
                color: theme.palette.text.primary,
                letterSpacing: 0.5,
              })}
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

        {actions && (
          <TableCell align="right">
            <Typography
              sx={(theme) => ({
                fontWeight: theme.typography.fontWeightBold,
                fontSize: theme.typography.body2.fontSize,
                textTransform: 'uppercase',
                color: theme.palette.text.primary,
                letterSpacing: 0.5,
              })}
            >
              <AdminPanelSettingsIcon sx={{ verticalAlign: 'middle', color: '#b2102f' }} />
              {t('labels.action')}
            </Typography>
          </TableCell>
        )}
      </TableRow>
    </MUITableHead>
  );
}

TableHead.defaultProps = {
  order: 'desc',
  orderBy: 'id',
  actions: true,
};

TableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  headCells: PropTypes.array.isRequired,
  actions: PropTypes.bool,
};

export default TableHead;
