import { BankAccount } from '@/api/cuentaBancaria';
import { Text, Title } from '@/components/StyledComponents';
import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import { formatCLP } from '@/utils/formatCLP';

type ProviderBankDetailsProps = {
  amountToPay: number;
  providerBankDetails: BankAccount | undefined;
  providerEmail: string;
};

export const ProviderBankDetails = ({
  amountToPay,
  providerBankDetails,
  providerEmail,
}: ProviderBankDetailsProps) => {
  if (!providerBankDetails?.id) null;
  return (
    <>
      <Title variant="h5">Detalles Bancarios</Title>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <Text variant="body1">Titular:</Text>
            </TableCell>
            <TableCell>
              <Text variant="body1">{providerBankDetails?.titular}</Text>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Text variant="body1">RUT:</Text>
            </TableCell>
            <TableCell>
              <Text variant="body1">{providerBankDetails?.rut}</Text>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Text variant="body1">RUT:</Text>
            </TableCell>
            <TableCell>
              <Text variant="body1">{providerEmail}</Text>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Text variant="body1">Banco:</Text>
            </TableCell>
            <TableCell>
              <Text variant="body1">{providerBankDetails?.banco}</Text>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Text variant="body1">Tipo de Cuenta:</Text>
            </TableCell>
            <TableCell>
              <Text variant="body1">{providerBankDetails?.tipoCuenta}</Text>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Text variant="body1">Número de Cuenta:</Text>
            </TableCell>
            <TableCell>
              <Text variant="body1">{providerBankDetails?.numeroCuenta}</Text>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Text variant="body1">Monto a Pagar:</Text>
            </TableCell>
            <TableCell>
              <Text variant="body1">{formatCLP(amountToPay)}</Text>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};
