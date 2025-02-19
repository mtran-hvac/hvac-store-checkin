import { useQueue } from "../context/QueueContext";

export default function Dashboard() {
    const { queue, serveNextCustomer, clearQueue, removeCustomer } = useQueue();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Employee Dashboard</h2>
                {queue.length === 0 ? (
                    <p className="text-gray-600">No customers in queue.</p>
                ) : (
                    <ul className="border p-4 rounded-md bg-white shadow-md">
                        {queue.map((customer, index) => (
                            <li key={index} className="py-4 border-b flex justify-between items-center">
                                <div>
                                    <p><strong>{index + 1}. {customer.name}</strong></p>
                                    <p>Reason: {customer.reason}</p>
                                    {(customer.reason === "Pay for / Pick-Up Existing Order" || customer.reason === "Return/Exchange") && (
                                        <p>Order Number: {customer.orderNumber}</p>
                                    )}
                                    {customer.reason !== "Pay for / Pick-Up Existing Order" && customer.reason !== "Return/Exchange" && (
                                        <>
                                            <p>Account Number: {customer.accountNumber || "N/A"}</p>
                                            <p>Phone Number on Account: {customer.phoneNumber || "N/A"}</p>
                                            {customer.unknownAccount && (
                                                <p className="text-red-500">Customer does not know account details</p>
                                            )}
                                        </>
                                    )}
                                </div>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                    onClick={() => removeCustomer(customer.id)}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                <button
                    className="w-full bg-red-500 text-white py-2 rounded-md mt-4 hover:bg-red-600"
                    onClick={serveNextCustomer}
                    disabled={queue.length === 0}
                >
                    Serve Next Customer
                </button>
                <button
                    className="w-full bg-gray-500 text-white py-2 rounded-md mt-4 hover:bg-gray-600"
                    onClick={clearQueue}
                    disabled={queue.length === 0}
                >
                    Clear Queue
                </button>
            </div>
        </div>
    );
}

