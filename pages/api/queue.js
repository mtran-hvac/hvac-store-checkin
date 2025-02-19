let queue = []; // Temporary in-memory queue

export default function handler(req, res) {
    if (req.method === "GET") {
        return res.status(200).json(queue); // Return queue data
    }

    if (req.method === "POST") {
        const { name, reason } = req.body;
        if (!name || !reason) {
            return res.status(400).json({ error: "Name and reason are required." });
        }
        queue.push({ name, reason, position: queue.length + 1 });
        return res.status(201).json({ message: "Customer added to queue.", queue });
    }

    if (req.method === "DELETE") {
        queue.shift(); // Remove the first customer
        return res.status(200).json({ message: "Customer served.", queue });
    }

    return res.status(405).json({ error: "Method Not Allowed" });
}
