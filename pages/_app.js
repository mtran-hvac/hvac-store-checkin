import "@/styles/globals.css";
import { QueueProvider } from "../context/QueueContext";

export default function App({ Component, pageProps }) {
    return (
        <QueueProvider>
            <Component {...pageProps} />
        </QueueProvider>
    );
}
