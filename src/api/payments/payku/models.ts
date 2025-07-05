interface AdditionalParameters {
  identificador: string;
  banco: string;
  numero_cuenta: string;
}

interface Payment {
  start: string;
  end: string;
  media: string;
  transaction_id: number;
  payment_key: string;
  transaction_key: string | null;
  deposit_date: string;
  verification_key: string;
  authorization_code: string;
  last_4_digits: string;
  installments: number;
  card_type: string;
  additional_parameters: AdditionalParameters;
  currency: string;
}

interface Nullify {
  status: string;
}

interface GatewayResponse {
  status: string;
  message: string;
}

export interface PaykuTransaction {
  status: string;
  id: string;
  created_at: string;
  order: string;
  email: string;
  subject: string;
  amount: string;
  payment: Payment;
  nullify: Nullify;
  gateway_response: GatewayResponse;
}

export interface CreatedTransaction {
  status: string;
  id: string;
  url: string;
}
