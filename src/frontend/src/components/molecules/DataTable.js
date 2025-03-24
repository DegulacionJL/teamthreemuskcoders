import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableBody from 'components/atoms/DataTable/TableBody';
import TableHead from 'components/atoms/DataTable/TableHead';
import TableToolbar from 'components/atoms/DataTable/TableToolbar';

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
    handleAdd,
    toolbar,
    actions,
    alignSearchRight,
  } = props;

  return (
    <Box sx={{ width: '100%' }}>
      {toolbar && (
        <TableToolbar
          handleSearch={handleSearch}
          handleAdd={handleAdd}
          alignSearchRight={alignSearchRight}
        />
      )}

      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead
              order={order}
              orderBy={sort}
              onRequestSort={handleSort}
              rowCount={data.length}
              headCells={header}
              actions={actions}
            />
            <TableBody
              header={header}
              rows={data}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              actions={actions}
            />
          </Table>
        </TableContainer>

        <Stack spacing={2} sx={{ display: 'flex', alignItems: 'end', py: 1 }}>
          <Pagination onChange={handleChangePage} page={page} count={total} />
        </Stack>
      </Paper>
    </Box>
  );
}

DataTable.propTypes = {
  header: PropTypes.array.isRequired,
  data: PropTypes.array,
  page: PropTypes.number,
  total: PropTypes.number,
  handleChangePage: PropTypes.func,
  order: PropTypes.string,
  sort: PropTypes.string,
  handleSort: PropTypes.func,
  handleSearch: PropTypes.func,
  handleDelete: PropTypes.func,
  handleEdit: PropTypes.func,
  handleAdd: PropTypes.bool,
  toolbar: PropTypes.bool,
  actions: PropTypes.bool,
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

export default DataTable;
