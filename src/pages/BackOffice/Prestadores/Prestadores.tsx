import Loading from '@/components/Loading';
import { Search } from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { IconButton, InputAdornment } from '@mui/material';
import { IconButtonBox, StyledOutlinedInput, Wrapper } from '../styledBackOffice';
import { PrestadoresGridController } from './Controllers/PrestadoresGridController';

export const Prestadores = () => {
  const {
    rows,
    columns,
    paginationModel,
    setPaginationModel,
    totalPrestadores,
    allPrestadoresLoading,
    isLoadingVerifyPrestador,
    isLoadingTotalPrestadores,
    isLoadingFailedVerifyPrestador,
  } = PrestadoresGridController();

  const isLoading =
    isLoadingFailedVerifyPrestador ||
    isLoadingTotalPrestadores ||
    isLoadingVerifyPrestador ||
    allPrestadoresLoading;

  if (rows && totalPrestadores)
    return (
      <Wrapper>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <StyledOutlinedInput
              id="searchPago"
              type={'text'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label="buscar por comuna" edge="end">
                    <IconButtonBox>
                      <Search
                        sx={{
                          color: 'primary.main',
                        }}
                      />
                    </IconButtonBox>
                  </IconButton>
                </InputAdornment>
              }
              placeholder="Buscar prestador por ID"
              // onChange={onChangeHandler}
            />
            <DataGrid
              slots={{
                toolbar: GridToolbar,
              }}
              columns={columns}
              rows={rows}
              paginationMode="server"
              rowCount={totalPrestadores || 0}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[10, 25]}
            />
          </>
        )}
      </Wrapper>
    );
};
