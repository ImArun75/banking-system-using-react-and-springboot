import axios from 'axios';

const SYSTEM1_API = 'http://localhost:8081';
const SYSTEM2_API = 'http://localhost:8082';

export type TransactionType = 'withdraw' | 'topup';

export interface TransactionRequest {
  cardNumber: string;
  pin: string;
  amount: number;
  type: TransactionType;
}

export interface TransactionResponse {
  success: boolean;
  message: string;
  balance: number;
  transactionId: number | null;
}

export interface Transaction {
  id: number;
  cardNumber: string;
  type: string;
  amount: number;
  timestamp: string;
  status: string;
  reason: string | null;
}

export const processTransaction = async (
  request: TransactionRequest
): Promise<TransactionResponse> => {
  const res = await axios.post(`${SYSTEM1_API}/transaction`, request);
  return res.data;
};

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const res = await axios.get(`${SYSTEM2_API}/transactions/all`);
  return res.data;
};

export const getCardTransactions = async (
  cardNumber: string
): Promise<Transaction[]> => {
  const res = await axios.get(`${SYSTEM2_API}/transactions/card/${cardNumber}`);
  return res.data;
};

export const getCardInfo = async (cardNumber: string) => {
  const res = await axios.get(`${SYSTEM2_API}/card/${cardNumber}`);
  return res.data;
};
