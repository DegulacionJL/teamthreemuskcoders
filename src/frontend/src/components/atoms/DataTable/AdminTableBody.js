import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { TableBody as MuiTableBody } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

/**
 * AdminTableBody – renders rows with optional action buttons and now supports
 * a row-click event via `handleRowClick`.
 */
function AdminTableBody(props) {
  const { header, rows, handleDelete, handleEdit, handleRowClick, actions } = props;
  const { t } = useTranslation();

  return (
    <MuiTableBody>
      {rows.map((row) => {
        return (
          <TableRow
            hover
            role="checkbox"
            tabIndex={-1}
            key={row.id}
            onClick={() => handleRowClick?.(row)}
            sx={{ cursor: handleRowClick ? 'pointer' : 'default' }}
          >
            {header.map((cell) => {
              const getLabel = (cell) => {
                let label = row;
                // support nested value e.g., "status.name"
                cell.id.split('.').forEach((key) => {
                  label = label?.[key];
                });

                if (cell.id === 'avatar') {
                  const rawAvatar = label;
                  const avatarUrl = rawAvatar ? rawAvatar.replace(/\\/g, '') : '';
                  return (
                    <Avatar
                      src={avatarUrl}
                      alt="Profile"
                      sx={{
                        width: 70,
                        height: 70,
                        mx: 'auto',
                        border: '2px solid #888',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                      }}
                    />
                  );
                }

                return label ?? 'N/A';
              };

              return (
                <TableCell key={cell.id} align={cell.numeric ? 'right' : 'left'}>
                  {getLabel(cell)}
                </TableCell>
              );
            })}
            {actions && (
              <TableCell align="right">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(row.id);
                  }}
                >
                  <DeleteIcon sx={{ fontSize: '1rem' }} />
                </IconButton>

                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(row.id);
                  }}
                >
                  <EditIcon sx={{ fontSize: '1rem' }} />
                </IconButton>
              </TableCell>
            )}
          </TableRow>
        );
      })}

      {rows.length < 1 && (
        <TableRow>
          <TableCell align="center" colSpan={header.length + (actions ? 1 : 0)}>
            {t('table.no_data')}
          </TableCell>
        </TableRow>
      )}
    </MuiTableBody>
  );
}

AdminTableBody.defaultProps = {
  header: [],
  rows: [],
  actions: true,
  handleDelete: (id) => alert(`Delete id # ${id}`),
  handleEdit: (id) => alert(`Edit id # ${id}`),
  handleRowClick: null,
};

AdminTableBody.propTypes = {
  header: PropTypes.array,
  rows: PropTypes.array,
  handleDelete: PropTypes.func,
  handleEdit: PropTypes.func,
  handleRowClick: PropTypes.func,
  actions: PropTypes.bool,
};

export default AdminTableBody;
