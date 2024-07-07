interface Transactions {
  eventType?: string;
  amount: number;
  eventTime?: number;
  txnId: string;
  description: string;
  initialTime?: number;
  finalTime?: number;
}

interface userDataType {
  name: string;
  availableCredit: number;
  payableBalance: number;
  pendingTransactions?: any;
  settledTransactions?: any;
}

interface transactionDetails {
  title: string;
  info: string;
  type: string;
}

interface JSONDataType {
  creditLimit: number;
  events: Array<Transactions>;
}

export type { Transactions, userDataType, transactionDetails, JSONDataType };
