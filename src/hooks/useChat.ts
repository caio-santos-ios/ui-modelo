"use client";

import * as signalR from "@microsoft/signalr";
import {
    activeChatUserAtom,
    chatMessagesAtom,
    chatOpenAtom,
    conversationsAtom,
    typingUserAtom,
    unreadChatCountAtom,
} from "@/jotai/global/chat.jotai";
import { api } from "@/service/api.service";
import { configApi } from "@/service/config.service";
import { TChatMessage, TChatUser } from "@/types/global/chat.type";
import { useAtom } from "jotai";
import { useCallback, useRef } from "react";
import { useSignalR } from "./useSignalR";

export const useChat = () => {
    const [conversations, setConversations]   = useAtom(conversationsAtom);
    const [messages, setMessages]             = useAtom(chatMessagesAtom);
    const [activeChatUser, setActiveChatUser] = useAtom(activeChatUserAtom);
    const [chatOpen, setChatOpen]             = useAtom(chatOpenAtom);
    const [unreadCount, setUnreadCount]       = useAtom(unreadChatCountAtom);
    const [typingUser, setTypingUser]         = useAtom(typingUserAtom);

    const connectionRef  = useRef<signalR.HubConnection | null>(null);
    const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchConversations = useCallback(async () => {
        try {
            const { data } = await api.get("/chat/conversations", configApi());
            setConversations(data?.result?.data ?? []);
        } catch {}
    }, [setConversations]);

    const fetchMessages = useCallback(
        async (conversationId: string, page = 1) => {
            try {
                const { data } = await api.get(
                    `/chat/messages/${conversationId}?page=${page}&pageSize=50`,
                    configApi()
                );
                const msgs: TChatMessage[] = data?.result?.data ?? [];
                setMessages(page === 1 ? msgs : (prev) => [...msgs, ...prev]);
            } catch {}
        },
        [setMessages]
    );

    const onConnected = useCallback(
        async (conn: signalR.HubConnection) => {
            connectionRef.current = conn;

            conn.off("ReceiveMessage");
            conn.off("MessageSent");
            conn.off("ConversationRead");
            conn.off("UserTyping");
            conn.off("UserStopTyping");

            conn.on("ReceiveMessage", (msg: TChatMessage) => {
                setMessages((prev) => {
                    if (prev.some((m) => m.id === msg.id)) return prev;
                    return [...prev, msg];
                });
                setConversations((prev) =>
                    prev.map((c) =>
                        c.conversationId === msg.conversationId
                            ? { ...c, lastMessage: msg.content, lastMessageAt: msg.createdAt }
                            : c
                    )
                );
                setUnreadCount((prev) => prev + 1);
            });

            conn.on("MessageSent", (msg: TChatMessage) => {
                setMessages((prev) => {
                    if (prev.some((m) => m.id === msg.id)) return prev;
                    return [...prev, msg];
                });
                setConversations((prev) =>
                    prev.map((c) =>
                        c.conversationId === msg.conversationId
                            ? { ...c, lastMessage: msg.content, lastMessageAt: msg.createdAt }
                            : c
                    )
                );
            });

            conn.on("ConversationRead", (convId: string) => {
                setConversations((prev) =>
                    prev.map((c) =>
                        c.conversationId === convId ? { ...c, unreadCount: 0 } : c
                    )
                );
            });

            conn.on("UserTyping", ({ senderName }: { senderName: string }) => {
                setTypingUser(senderName);
                if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
                typingTimerRef.current = setTimeout(() => setTypingUser(null), 3000);
            });

            conn.on("UserStopTyping", () => {
                setTypingUser(null);
            });

            fetchConversations();

            try {
                const { data } = await api.get("/chat/unread-count", configApi());
                setUnreadCount(data?.result?.data ?? 0);
            } catch {}
        },
        [fetchConversations, setConversations, setMessages, setTypingUser, setUnreadCount]
    );


    const { isConnected } = useSignalR({ hubUrl: "/hubs/chat", onConnected });

    const openChat = useCallback(
        async (user: TChatUser, conversationId: string) => {
            setActiveChatUser(user);
            setChatOpen(true);
            await fetchMessages(conversationId);
            await connectionRef.current?.invoke("MarkConversationAsRead", conversationId);
            // setUnreadCount((prev) => Math.max(0, prev - 1));
            const conv = conversations.find(c => c.conversationId === conversationId);
            const unread = conv?.unreadCount ?? 0;
            // setUnreadCount((prev) => Math.max(0, prev - unread));
            const Conv = conversations.find(c => c.conversationId === conversationId);
            const Unread = Conv?.unreadCount ?? 0;
            setUnreadCount((prev) => Math.max(0, prev - Unread));
        },
        [fetchMessages, setActiveChatUser, setChatOpen, setUnreadCount]
    );

    const closeChat = useCallback(() => {
        setChatOpen(false);
        setActiveChatUser(null);
        setMessages([]);
    }, [setActiveChatUser, setChatOpen, setMessages]);

    const sendMessage = useCallback(async (receiverId: string, content: string) => {
        if (!content.trim() || !connectionRef.current) return;
        await connectionRef.current.invoke("SendMessage", { receiverId, content });
    }, []);

    const notifyTyping = useCallback((receiverId: string) => {
        connectionRef.current?.invoke("Typing", receiverId);
    }, []);

    const notifyStopTyping = useCallback((receiverId: string) => {
        connectionRef.current?.invoke("StopTyping", receiverId);
    }, []);

    return {
        conversations,
        messages,
        activeChatUser,
        chatOpen,
        unreadCount,
        typingUser,
        isConnected,
        openChat,
        closeChat,
        sendMessage,
        notifyTyping,
        notifyStopTyping,
        fetchConversations,
    };
};