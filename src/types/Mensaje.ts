export type Mensaje = {
  timestamp: string;
  id: string;
  message: string;
  providerId: string;
  sentBy: 'user' | 'provider';
  userId: string;
};
