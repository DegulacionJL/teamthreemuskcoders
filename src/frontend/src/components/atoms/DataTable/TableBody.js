'use client';

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isFollowing } from 'services/follow.service';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { TableBody as MuiTableBody } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

function TableBody(props) {
  const { header, rows, handleFollow, handleDelete, handleEdit, actions, user } = props;
  const { t } = useTranslation();
  const [followingStatus, setFollowingStatus] = useState({});

  useEffect(() => {
    // Check following status for each user when rows change
    if (rows.length > 0 && user) {
      const checkFollowingStatus = async () => {
        const statusMap = {};
        for (const row of rows) {
          try {
            if (row.id !== user.id) {
              // Don't check following status for current user
              const following = await isFollowing(row.id);
              statusMap[row.id] = following;
            }
          } catch (error) {
            console.error(`Error checking following status for user ${row.id}:`, error);
          }
        }
        setFollowingStatus(statusMap);
      };

      checkFollowingStatus();
    }
  }, [rows, user]);

  if (!user) {
    console.error('User is undefined in TableBody component.');
    return null; // Prevent rendering if user is undefined
  }

  return (
    <MuiTableBody>
      {rows.map((row, index) => {
        return (
          <TableRow hover role="checkbox" tabIndex={-1} key={index}>
            {header.map((cell, index) => {
              const getLabel = (cell) => {
                let label = row;
                // support value from objects e.g cell id: "status.name"  |  { "status": { "name": "Active"} }
                cell.id.split('.').forEach((key) => {
                  label = label[key];
                });
                return label;
              };

              return (
                <TableCell key={index} align={cell.numeric ? 'right' : 'left'}>
                  {getLabel(cell)}
                </TableCell>
              );
            })}
            {actions && (
              <TableCell align="right">
                {user?.role === 'admin' && (
                  <>
                    <IconButton onClick={() => handleDelete(row.id)}>
                      <DeleteIcon sx={{ fontSize: '1rem' }} />
                    </IconButton>

                    <IconButton onClick={() => handleEdit(row.id)}>
                      <EditIcon sx={{ fontSize: '1rem' }} />
                    </IconButton>
                  </>
                )}
                {user.role !== 'admin' && row.id !== user.id && (
                  <>
                    <IconButton
                      onClick={() => {
                        handleFollow(row.id);
                        // Optimistically update UI
                        setFollowingStatus({
                          ...followingStatus,
                          [row.id]: !followingStatus[row.id],
                        });
                      }}
                    >
                      {followingStatus[row.id] ? <CheckIcon color="primary" /> : <PersonAddIcon />}
                    </IconButton>
                  </>
                )}
              </TableCell>
            )}
          </TableRow>
        );
      })}

      {rows.length < 1 && (
        <TableRow>
          <TableCell align="center" colSpan={6}>
            {t('table.no_data')}
          </TableCell>
        </TableRow>
      )}
    </MuiTableBody>
  );
}

TableBody.defaultProps = {
  header: [],
  rows: [],
  actions: true,
  handleDelete: (id) => alert(`Delete id # ${id}`),
  handleEdit: (id) => alert(`Edit id # ${id}`),
  handleFollow: (id) => alert(`follow id # ${id}`),
  user: { role: '', id: 0 },
};

TableBody.propTypes = {
  header: PropTypes.array,
  rows: PropTypes.array,
  handleDelete: PropTypes.func,
  handleEdit: PropTypes.func,
  actions: PropTypes.bool,
  handleFollow: PropTypes.func,
  user: PropTypes.shape({
    role: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  }),
};

export default TableBody;
