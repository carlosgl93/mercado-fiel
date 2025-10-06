import Loading from '@/components/Loading';
import { Search } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { IconButtonBox, StyledOutlinedInput, Wrapper } from '../styledBackOffice';
import { PaymentDialog } from './PaymentDialog';
import { PaymentsGridController } from './PaymentsGridController';

export const Pagos = () => {
  const {
    columns,
    paginationModel,
    showPaymentsDetails,
    paymentDetailsParams,
    setPaginationModel,
    handleOpenPaymentDetails,
  } = PaymentsGridController();

  const isLoading = false;

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
            placeholder="Buscar pago por ID"
            // onChange={onChangeHandler}
          />
          <DataGrid
            slots={{
              toolbar: GridToolbar,
            }}
            columns={columns}
            rows={[]}
            getRowId={(row) => row.appointmentId}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 25]}
            loading={isLoading}
            onRowClick={(params) => {
              handleOpenPaymentDetails(params.row);
            }}
          />
        </>
      )}
      <PaymentDialog
        open={showPaymentsDetails}
        paymentDetails={paymentDetailsParams}
        onClose={handleOpenPaymentDetails}
      />
    </Wrapper>
  );
};
