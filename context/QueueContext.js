import { createContext, useContext, useEffect, useState } from "react";
import {
    addCustomerToDB,
    listenToQueueUpdates,
    removeFirstCustomer,
    setNowServingCustomer,
    listenToNowServing,
    clearQueue as clearQueueFromDB
} from "../utils/firebase";

const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
    const [queue, setQueue] = useState([]);
    const [nowServing, setNowServing] = useState(null);

    // Listen for queue updates and now serving updates
    useEffect(() => {
        const unsubscribeQueue = listenToQueueUpdates(setQueue);
        const unsubscribeNowServing = listenToNowServing(setNowServing);
        return () => {
            unsubscribeQueue();
            unsubscribeNowServing();
        };
    }, []);

    const addCustomer = async (name, reason, orderNumber, accountNumber, phoneNumber, unknownAccount) => {
        await addCustomerToDB(name, reason, orderNumber, accountNumber, phoneNumber, unknownAccount);
    };

    const serveNextCustomer = async () => {
        if (queue.length > 0) {
            const customer = queue[0];
            await setNowServingCustomer(customer);
            await removeFirstCustomer(customer.id);
        }
    };

    const clearQueue = async () => {
        await clearQueueFromDB();
        setQueue([]);
    };

    return (
        <QueueContext.Provider value={{ queue, nowServing, addCustomer, serveNextCustomer, clearQueue }}>
            {children}
        </QueueContext.Provider>
    );
};

export const useQueue = () => useContext(QueueContext);