interface Transactions {
  eventType?: string;
  amount: number;
  eventTime: number;
  txnId: string;
  description: string;
}

interface userData {
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

export { Transactions, userData, transactionDetails };
