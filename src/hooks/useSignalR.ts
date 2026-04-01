"use client";

import * as signalR from "@microsoft/signalr";
import { useEffect, useRef, useState } from "react";

type UseSignalROptions = {
    hubUrl: string;
    onConnected?: (connection: signalR.HubConnection) => void;
    onDisconnected?: () => void;
};

export const useSignalR = ({ hubUrl, onConnected, onDisconnected }: UseSignalROptions) => {
    const connectionRef = useRef<signalR.HubConnection | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("telemovviToken") ?? "";
        if (!token) return;

        // Flag para evitar atualização de estado após desmontagem
        let isMounted = true;

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${process.env.NEXT_PUBLIC_API_URL}${hubUrl}?access_token=${token}`, {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets,
            })
            .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
            .configureLogging(signalR.LogLevel.Warning)
            .build();

        connectionRef.current = connection;

        connection.onreconnecting(() => {
            if (isMounted) setIsConnected(false);
        });

        connection.onreconnected(() => {
            if (isMounted) {
                setIsConnected(true);
                onConnected?.(connection);
            }
        });

        connection.onclose(() => {
            if (isMounted) {
                setIsConnected(false);
                onDisconnected?.();
            }
        });

        // Inicia a conexão e só registra os handlers se ainda estiver montado
        connection
            .start()
            .then(() => {
                if (!isMounted) {
                    // Componente desmontou enquanto conectava — para silenciosamente
                    connection.stop();
                    return;
                }
                setIsConnected(true);
                onConnected?.(connection);
            })
            .catch((err) => {
                // Ignora o erro de AbortError (causado pelo StrictMode / desmontagem rápida)
                if (isMounted && err?.name !== "AbortError") {
                    console.error(`[SignalR] ${hubUrl} connection error:`, err);
                }
            });

        return () => {
            isMounted = false;
            // Só para se a conexão já estiver estabelecida ou conectando
            if (
                connection.state === signalR.HubConnectionState.Connected ||
                connection.state === signalR.HubConnectionState.Connecting ||
                connection.state === signalR.HubConnectionState.Reconnecting
            ) {
                connection.stop();
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hubUrl]);

    return { connection: connectionRef.current, isConnected };
};