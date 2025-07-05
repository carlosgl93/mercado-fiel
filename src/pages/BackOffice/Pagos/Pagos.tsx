import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useAppointments } from '@/hooks/useAppointments';
import { IconButtonBox, StyledOutlinedInput, Wrapper } from '../styledBackOffice';
import Loading from '@/components/Loading';
import { PaymentsGridController } from './PaymentsGridController';
import { IconButton, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import { PaymentDialog } from './PaymentDialog';

export const Pagos = () => {
  const { getTotalAppointments, getTotalAppointmentsIsLoading } = useAppointments();
  const {
    columns,
    isLoadingPaymentVerificationFailed,
    isLoadingVerifyPayment,
    paginationModel,
    duePayments,
    duePaymentsIsLoading,
    showPaymentsDetails,
    paymentDetailsParams,
    setPaginationModel,
    handleOpenPaymentDetails,
  } = PaymentsGridController();

  const isLoading =
    isLoadingPaymentVerificationFailed ||
    isLoadingVerifyPayment ||
    getTotalAppointmentsIsLoading ||
    duePaymentsIsLoading;

  if (duePayments)
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
              rows={duePayments}
              getRowId={(row) => row.appointmentId}
              paginationMode="server"
              rowCount={getTotalAppointments?.count || 0}
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
