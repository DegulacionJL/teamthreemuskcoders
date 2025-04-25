'use client';

import PropTypes from 'prop-types';
import React, { memo, useCallback } from 'react';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import AdminTableBody from 'components/atoms/DataTable/AdminTableBody';
import TableBody from 'components/atoms/DataTable/TableBody';
// keep if you use it elsewhere
import TableHead from 'components/atoms/DataTable/TableHead';
import TableToolbar from 'components/atoms/DataTable/TableToolbar';

/**
 * Generic DataTable used across the admin panel.
 * Memoised so it renders only when real props change.
 */
function DataTable(props) {
  const {
    data,
    header,
    page,
    total,
    order,
    sort,
    handleChangePage,
    handleSort,
    handleSearch,
    handleDelete,
    handleEdit,
    handleRowClick,
    handleAdd,
    handleFollow,
    toolbar,
    actions,
    alignSearchRight,
    user,
  } = props;

  /* ------------------------------------------------------------------ *
   * Memoise every handler so descendants always receive the same ref   *
   * — prevents MUI TableSortLabel from firing on every render.         *
   * ------------------------------------------------------------------ */
  const _handleSort = useCallback(handleSort, [handleSort]);
  const _handleChangePage = useCallback(handleChangePage, [handleChangePage]);
  const _handleSearch = useCallback(handleSearch, [handleSearch]);
  const _handleDelete = useCallback(handleDelete, [handleDelete]);
  const _handleEdit = useCallback(handleEdit, [handleEdit]);
  const _handleRowClick = useCallback(handleRowClick, [handleRowClick]);
  const _handleAdd = useCallback(handleAdd, [handleAdd]);
  const _handleFollow = useCallback(handleFollow, [handleFollow]);

  return (
    <Box sx={{ width: '100%' }}>
      {toolbar && (
        <TableToolbar
          handleSearch={_handleSearch}
          handleAdd={_handleAdd}
          alignRight={alignSearchRight}
        />
      )}

      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead
              order={order}
              orderBy={sort}
              onRequestSort={_handleSort}
              rowCount={data.length}
              headCells={header}
              actions={actions}
            />

            {/* Admin‑flavoured body (has delete/edit etc.) */}
            <AdminTableBody
              header={header}
              rows={data}
              handleDelete={_handleDelete}
              handleEdit={_handleEdit}
              handleRowClick={_handleRowClick}
              handleAdd={_handleAdd}
              handleFollow={_handleFollow}
              actions={actions}
              user={user}
              role={user?.role}
            />
          </Table>
        </TableContainer>

        <Stack spacing={2} sx={{ display: 'flex', alignItems: 'end', py: 1 }}>
          <Pagination onChange={_handleChangePage} page={page} count={total} />
        </Stack>
      </Paper>
    </Box>
  );
}

/* --------------------------- prop types ----------------------------- */

DataTable.propTypes = {
  header: PropTypes.array.isRequired,
  data: PropTypes.array,
  page: PropTypes.number,
  total: PropTypes.number,
  order: PropTypes.string,
  sort: PropTypes.string,
  handleChangePage: PropTypes.func,
  handleSort: PropTypes.func,
  handleSearch: PropTypes.func,
  handleDelete: PropTypes.func,
  handleEdit: PropTypes.func,
  handleRowClick: PropTypes.func,
  handleAdd: PropTypes.func,
  toolbar: PropTypes.bool,
  actions: PropTypes.bool,
  alignSearchRight: PropTypes.bool,
  handleFollow: PropTypes.func,
  user: PropTypes.object,
};

DataTable.defaultProps = {
  data: [],
  page: 1,
  total: 1,
  order: 'desc',
  sort: 'id',
  toolbar: true,
  actions: true,
};

/* -------------------------------------------------------------------- */
/* memoise the whole component so identical props don’t cause re‑render */
/* -------------------------------------------------------------------- */
export default memo(DataTable);
