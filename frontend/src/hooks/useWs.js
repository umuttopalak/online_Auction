import { useEffect, useRef, useState } from "react";
import axios from "axios";

const useWs = (url) => {
    const [ws, setWs] = useState(null);
    const messageQueueRef = useRef([]);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const socket = new WebSocket(url);
        setWs(socket);
        // clean up function
        return () => {
            socket.close();
        };
    }, [url]);

    useEffect(() => {
        if (ws) {
            ws.onopen = () => {
                // Send any queued messages
                const queue = messageQueueRef.current;
                while (queue.length > 0) {
                    const message = queue.shift();
                    ws.send(JSON.stringify(message));
                }
            };

        }
    }, [ws]);

    useEffect(() => {
        if (ws) {
            ws.onmessage = (event) => {
                setMessages(JSON.parse(event.data))
            };

        }
    }, [ws]);


    const sendMessage = (message) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(message);
        } else if (ws && ws.readyState === WebSocket.CONNECTING) {
            messageQueueRef.current.push(message);
        } else {
            console.error('WebSocket connection not available');
        }
    };

    return { ws, sendMessage, messages };
};

export default useWs;