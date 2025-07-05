import { Container, styled } from '@mui/material';
import { Wrapper } from './styledBackOffice';
import { Text, Title } from '@/components/StyledComponents';
import { CenteredFlexBox } from '@/components/styled';
import Loading from '@/components/Loading';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { UsersGridController } from './Dashboard/UsersGridController';

export const BackOffice = () => {
  const {
    columns,
    paginationModel,
    rows,
    setPaginationModel,
    usersCount,
    usersCountLoading,
    usersCountError,
    prestadoresCount,
    prestadoresCountLoading,
    prestadoresCountError,
    providersPerComunaCountLoading,
    usersPerComunaCountLoading,
  } = UsersGridController();

  return (
    <Wrapper>
      <Container maxWidth="xl">
        <CenteredFlexBox>
          {/* total users created */}
          <KPIContainer>
            <KPITitle>Usuarios</KPITitle>
            {usersCountLoading && <Loading />}
            {usersCountError && <ErrorOutlineOutlinedIcon />}
            {!usersCountLoading && !usersCountError && <Text>Usuarios creados: {usersCount}</Text>}
          </KPIContainer>
          {/* total prestadores created */}
          <KPIContainer>
            <KPITitle>Prestadores</KPITitle>
            {prestadoresCountLoading && <Loading />}
            {prestadoresCountError && <ErrorOutlineOutlinedIcon />}
            {!prestadoresCountLoading && !prestadoresCountError && (
              <Text>Prestadores creados: {prestadoresCount}</Text>
            )}
          </KPIContainer>
        </CenteredFlexBox>
        {/* usuarios y prestadores por comuna */}
        {/* <KPIContainer>
          <KPITitle>Usuarios y prestadores por comuna y tipo de apoyo</KPITitle>
          {(usersPerComunaCountLoading || providersPerComunaCountLoading) && <Loading />}
          {((usersPerComunaCountError as Error) || (providersPerComunaCountError as Error)) && (
            <ErrorOutlineOutlinedIcon />
          )}
          {usersPerComunaCount && providersPerComunaCount && (
            <UsuariosPrestadoresPorComunaGraph
              providersPerComunaCount={providersPerComunaCount}
              usersPerComunaCount={usersPerComunaCount}
            />
          )}
        {/* </KPIContainer>  */}
        {rows.length > 0 && (
          <DataGrid
            slots={{
              toolbar: GridToolbar,
            }}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: paginationModel,
              },
              sorting: {
                sortModel: [{ field: 'total', sort: 'desc' }],
              },
            }}
            rows={rows}
            getRowId={(row) => row.id}
            paginationMode="client"
            rowCount={rows.length}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 25]}
            loading={
              usersCountLoading ||
              prestadoresCountLoading ||
              providersPerComunaCountLoading ||
              usersPerComunaCountLoading
            }
          />
        )}
      </Container>
    </Wrapper>
  );
};

const KPIContainer = styled(Container)(() => ({
  borderRadius: '5%',
  padding: '1rem',
}));

const KPITitle = styled(Title)(() => ({
  fontSize: '1.5rem',
}));
