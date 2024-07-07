"use client";
import Image from "next/image";
import "./page.css";
import font from "../utils/fonts";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import {
  JSONData,
  userDataDefault,
  transactionDetailsDefault,
} from "../utils/defaults";
import { Transactions, userDataType, transactionDetails } from "../utils/types";


interface SortedTxns {
  [key: string]: Array<Transactions>;
}


function SortTxns(events: Array<Transactions>) {
  const sortedEvents: SortedTxns  = {};
  for (let event of events) {
    if (!event.eventTime) return;
    if (event.eventTime in sortedEvents) {
      sortedEvents[event.eventTime].push(event);
    } else {
      sortedEvents[event.eventTime] = [event];
    }
  }
  return sortedEvents;
}

function formatDollar(amount: number) {
  if (amount >= 0)
    return <div className={clsx("positive", "cash")}>{`$ ${amount}`} </div>;
  return (
    <div className={clsx("negative", "cash")}>{`-$ ${Math.abs(amount)}`}</div>
  );
}

function HandleData() {
  const creditLimit = JSONData["creditLimit"],
    events = JSONData["events"];
  const payableBalance = 0,
    availableCredit = creditLimit;

  const pendingTransactions = {};
  const settledTransactions = [];

  return ["Adarsh", creditLimit, payableBalance, SortTxns(events)];
}

export default function Home() {
  const [userData, setUserData] = useState<userDataType>(userDataDefault);
  const [details, setDetails] = useState<transactionDetails>(
    transactionDetailsDefault,
  );
  const [events, setEvents] = useState<SortedTxns>();
  const [time, setTime] = useState(0);

  function updateState(property: string, value: any) {
    setUserData((data: any) => {
      const newData = { ...data };
      newData[property] = value;
      return newData;
    });
  }

  async function handleEvent(events: Array<Transactions>) {
    let lock = false;
    for (const event of events) {
      while (lock) await new Promise((resolve) => setTimeout(resolve, 100)); // Wait if locked
      lock = true; // Acquire lock
      try {
        const { eventType, amount, txnId, eventTime } = event;
        switch (eventType) {
          case "TXN_AUTHED": {
            let updatedPendingTransaction = { ...userData.pendingTransactions };
            updatedPendingTransaction[txnId] = event;
            updateState("pendingTransactions", updatedPendingTransaction);
            updateState("availableCredit", userData.availableCredit - amount);
            setDetails({
              title: event.description,
              info: "Transaction Authorized, not settled yet",
              type: eventType,
            });
            break;
          }

          case "TXN_SETTLED": {
            event["initialTime"] =
              userData.pendingTransactions[txnId].eventTime;
            event["finalTime"] = eventTime;
            delete event["eventTime"];
            updateState("settledTransactions", [
              event,
              ...userData.settledTransactions,
            ]);
            let AC = userData.availableCredit;
            AC += userData.pendingTransactions[txnId]["amount"];
            AC -= amount;
            updateState("availableCredit", AC);
            updateState("payableBalance", amount + userData.payableBalance);
            let updatedPendingTransaction = userData.pendingTransactions;
            setDetails({
              title: userData.pendingTransactions[txnId].description,
              info: "Transaction Settled. This amount includes tips, excludes holds.",
              type: eventType,
            });
            delete updatedPendingTransaction[txnId];
            updateState("pendingTransactions", updatedPendingTransaction);
            break;
          }

          case "TXN_AUTH_CLEARED": {
            updateState(
              "availableCredit",
              userData.availableCredit +
                userData.pendingTransactions[txnId]["amount"],
            );
            let updatedPendingTransaction = userData.pendingTransactions;
            setDetails({
              title: userData.pendingTransactions[txnId].description,
              info: "Transaction Cleared. This is a cancelled transaction.",
              type: eventType,
            });
            delete updatedPendingTransaction[txnId];
            updateState("pendingTransactions", updatedPendingTransaction);
            break;
          }

          case "PAYMENT_INITIATED": {
            let updatedPendingTransaction = { ...userData.pendingTransactions };
            updatedPendingTransaction[txnId] = event;
            updateState("pendingTransactions", updatedPendingTransaction);
            updateState("payableBalance", userData.payableBalance + amount);
            setDetails({
              title: "Payment Initiated",
              info: "Payment to repay credit is initiated",
              type: eventType,
            });
            break;
          }

          case "PAYMENT_POSTED": {
            let settedTxn = userData.pendingTransactions[txnId];
            settedTxn["initialTime"] = settedTxn.eventTime;
            settedTxn["finalTime"] = eventTime;
            settedTxn["eventType"] = "PAYMENT_POSTED";
            delete settedTxn.eventTime;
            updateState("settledTransactions", [
              settedTxn,
              ...userData.settledTransactions,
            ]);
            updateState(
              "availableCredit",
              userData.availableCredit - settedTxn["amount"],
            );
            let updatedPendingTransaction = userData.pendingTransactions;
            setDetails({
              title: "Payment Posted",
              info: "Payment to creditor is confirmed",
              type: eventType,
            });
            delete updatedPendingTransaction[txnId];
            updateState("pendingTransactions", updatedPendingTransaction);
            break;
          }

          case "PAYMENT_CANCELED": {
            updateState(
              "payableBalance",
              userData.payableBalance -
                userData.pendingTransactions[txnId].amount,
            );
            let updatedPendingTransaction = userData.pendingTransactions;
            setDetails({
              title: "Payment Canceled",
              info: "Payment to creditor is canceled",
              type: eventType,
            });
            delete updatedPendingTransaction[txnId];
            updateState("pendingTransactions", updatedPendingTransaction);
            break;
          }
        }
      } finally {
        lock = false;
      }
    }
  }

  useEffect(() => {
    const Simulator = setInterval(() => {
      setTime((time) => time + 1);
    }, 2000);
    return () => clearInterval(Simulator);
  }, []);

  useEffect(() => {
    if (events && time in events) {
      handleEvent(events[time]);
    }
  }, [time]);

  useEffect(() => {
    const [name, availableCredit, payableBalance, events] = HandleData();
    setUserData((userData: userDataType) => {
      return { ...userData, name: name as string, availableCredit:  availableCredit as number, payableBalance: payableBalance as number };
    });
    setEvents(events as SortedTxns)
  }, []);

  return (
    <main className={clsx(font.Fuscat)}>
      <header className={clsx("header")}>
        <div className={clsx("")}>
          <div className={clsx("title")}>Hi {userData["name"]}!</div>
          <div className={clsx("caption")}>Welcome back to Pomelo 👋</div>
        </div>
        <div className={clsx("info")}>
          <div>
            Available Credit:{" "}
            <span className={clsx("number")}>
              {formatDollar(userData["availableCredit"])}
            </span>
          </div>
          <div>
            Payable Balance:{" "}
            <span className={clsx("number")}>
              {formatDollar(userData["payableBalance"])}
            </span>
          </div>
        </div>
      </header>
      <div className={clsx("txn")}>
        <div className={clsx("cont")}>
          <div className={clsx("title")}>Pending Transactions:</div>
          <div className={clsx("list")}>
            {userData.pendingTransactions &&
              Object.keys(userData.pendingTransactions)?.map(
                (txn_key: string, idx: number) => {
                  return (
                    <div
                      className={clsx("items", idx == 0 && "fade-in")}
                      key={idx}
                    >
                      <div>
                        {idx + 1}.{" "}
                        {userData.pendingTransactions[txn_key].description}{" "}
                      </div>
                      <div>
                        {formatDollar(
                          userData.pendingTransactions[txn_key].amount,
                        )}{" "}
                      </div>
                    </div>
                  );
                },
              )}
          </div>
        </div>
        <div className={clsx("cont")}>
          <div className={clsx("title")}>Settled Transactions:</div>
          <div className={clsx("list")}>
            {userData.settledTransactions?.map(
              (txn: Transactions, idx: number) => {
                return (
                  <div
                    className={clsx("items", idx == 0 && "fade-in")}
                    key={idx}
                  >
                    <div>
                      {idx + 1}. {txn.description}{" "}
                    </div>
                    <>{formatDollar(txn.amount)} </>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>
      <div className={clsx("details")}>
        <div className={clsx("timer")}>Time: {time && <>{time}</>}</div>
        <div className={clsx("title")}>
          {details && details.title && <>{details.title}</>}
        </div>
        <div className={clsx("info")}>
          {details && details.info && <>{details.info}</>}
        </div>
        <div className={clsx("type")}>
          {details && details.type && <>{details.type}</>}
        </div>
      </div>
      <Image
        src="./add-txn.svg"
        className={clsx("add-txn")}
        alt="Add Txn"
        height={50}
        width={50}
      />
    </main>
  );
}
