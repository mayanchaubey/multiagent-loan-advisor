export type LoanStatus = 'approved' | 'rejected' | 'conditional';

export interface LoanResult {
  status: LoanStatus;
  title: string;
  message: string;
  advice?: string;
}

export interface Message {
  id: string;
  type: 'user' | 'bot' | 'result';
  content: string;
  timestamp: Date;
  result?: LoanResult;
}

export type Step = 'income' | 'emi' | 'amount' | 'tenure' | 'processing' | 'done';

export interface LoanData {
  income: string;
  emi: string;
  amount: string;
  tenure: string;
}
