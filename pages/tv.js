import { useQueue } from "../context/QueueContext";

export default function TVDisplay() {
    const { queue, nowServing } = useQueue();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
            <h1 className="text-4xl font-bold mb-6">📢 Now Serving</h1>

            {nowServing ? (
                <div className="text-center text-yellow-400 text-6xl font-bold py-4">
                    {nowServing.name}
                </div>
            ) : (
                <p className="text-2xl">No customers being served.</p>
            )}

            <h2 className="text-3xl font-bold mt-6">🔜 Next in Line</h2>
            {queue.length === 0 ? (
                <p className="text-xl">No one is in line.</p>
            ) : (
                <div className="w-full max-w-2xl">
                    <ul className="text-center text-3xl">
                        {queue.slice(0, 2).map((customer, index) => (
                            <li key={index} className="py-4 border-b border-gray-500">
                                <span className="font-bold text-yellow-400">{customer.position}.</span> {customer.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

