import { JSONDataType } from "./types";


const JSONData: JSONDataType = {
  creditLimit: 1000,
  events: [
    {
      eventType: "TXN_AUTHED",
      description: "Andy's Cafe",
      eventTime: 1,
      txnId: "t1",
      amount: 123,
    },
    {
      eventType: "TXN_SETTLED",
      description: "Andy's Cafe",
      eventTime: 2,
      txnId: "t1",
      amount: 456,
    },
    {
      eventType: "PAYMENT_INITIATED",
      description: "Payment Initialied",
      eventTime: 3,
      txnId: "p1",
      amount: -456,
    },
    {
      eventType: "PAYMENT_POSTED",
      description: "Payment Settled",
      eventTime: 4,
      txnId: "p1",
      amount: 0,
    },
    {
      eventType: "TXN_AUTHED",
      description: "Avis Car Rental",
      eventTime: 5,
      txnId: "t2",
      amount: 356,
    },
    {
      eventType: "TXN_SETTLED",
      description: "Avis Car Rental",
      eventTime: 6,
      txnId: "t2",
      amount: 156,
    },
    {
      eventType: "TXN_AUTHED",
      description: "Netflix Subscription",
      eventTime: 7,
      txnId: "t3",
      amount: 10,
    },
    {
      eventType: "TXN_AUTH_CLEARED",
      description: "Netflix Subscription",
      eventTime: 8,
      txnId: "t3",
      amount: 0
    },
    {
      eventType: "PAYMENT_INITIATED",
      description: "Payment Initialied",
      eventTime: 9,
      txnId: "p2",
      amount: -156,
    },
    {
      eventType: "PAYMENT_POSTED",
      description: "Payment Settled",
      eventTime: 10,
      txnId: "p2",
      amount: 0
    },
  ],
};

const userDataDefault = {
  name: "Adarsh",
  availableCredit: 1000,
  payableBalance: 0,
  pendingTransactions: {},
  settledTransactions: [],
};

const transactionDetailsDefault = {
  title: "",
  info: "",
  type: "",
};

export { JSONData, userDataDefault, transactionDetailsDefault };
