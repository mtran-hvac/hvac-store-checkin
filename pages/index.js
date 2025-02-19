import { useState } from "react";
import { useQueue } from "../context/QueueContext";

export default function Home() {
    const { addCustomer } = useQueue();
    const [name, setName] = useState("");
    const [reason, setReason] = useState("");
    const [orderNumber, setOrderNumber] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [unknownAccount, setUnknownAccount] = useState(false);

    const formatPhoneNumber = (value) => {
        value = value.replace(/\D/g, "");
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        if (value.length >= 7) {
            return `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
        } else if (value.length >= 4) {
            return `(${value.slice(0, 3)}) ${value.slice(3)}`;
        } else {
            return value;
        }
    };

    const handleCheckIn = () => {
        if (!name || !reason) return alert("Please enter all required fields!");

        if ((reason === "Pay for / Pick-Up Existing Order" || reason === "Return/Exchange") &&
            (!orderNumber || !/^1\d{6}$/.test(orderNumber))) {
            return alert("Please enter a valid 7-digit order number starting with 1.");
        }

        if (reason !== "Pay for / Pick-Up Existing Order" && reason !== "Return/Exchange" &&
            !unknownAccount && (!/^1\d{4}$/.test(accountNumber) || !phoneNumber)) {
            return alert("Please enter a valid 5-digit account number starting with 1 or provide a phone number.");
        }

        addCustomer(name, reason, orderNumber, accountNumber, phoneNumber, unknownAccount);
        setName("");
        setReason("");
        setOrderNumber("");
        setAccountNumber("");
        setPhoneNumber("");
        setUnknownAccount(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Customer Check-In</h2>
                <input
                    className="w-full p-2 border rounded-md mb-2"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <select
                    className="w-full p-2 border rounded-md mb-2"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                >
                    <option value="">Select a reason</option>
                    <option value="Pay for / Pick-Up Existing Order">Pay for / Pick-Up Existing Order</option>
                    <option value="Return/Exchange">Return/Exchange</option>
                    <option value="Check-Out">Check-Out</option>
                    <option value="Request new Quote / Check Pricing">Request new Quote / Check Pricing</option>
                    <option value="Warranty Claim">Warranty Claim</option>
                    <option value="Other Questions">Other Questions</option>
                </select>

                {(reason === "Pay for / Pick-Up Existing Order" || reason === "Return/Exchange") && (
                    <input
                        className="w-full p-2 border rounded-md mb-2"
                        placeholder="Enter 7-digit Order Number (Starts with 1)"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                    />
                )}

                {reason !== "Pay for / Pick-Up Existing Order" && reason !== "Return/Exchange" && (
                    <div className="w-full">
                        <input
                            className="w-full p-2 border rounded-md mb-2"
                            placeholder="Account Number - Leave Blank if you do not know it"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 5))}
                            disabled={unknownAccount}
                        />
                        <input
                            className="w-full p-2 border rounded-md mb-2"
                            placeholder="Phone Number on Account"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                            disabled={unknownAccount}
                        />
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={unknownAccount}
                                onChange={(e) => setUnknownAccount(e.target.checked)}
                            />
                            I do not know the account number and phone number / I do not have an account.
                        </label>
                    </div>
                )}

                <button
                    className="w-full bg-blue-500 text-white py-2 rounded-md mt-2 hover:bg-blue-600"
                    onClick={handleCheckIn}
                >
                    Check In
                </button>
            </div>
        </div>
    );
}
