"use client";

import { useChat } from "@/hooks/useChat";
import { userLoggerAtom } from "@/jotai/auth/auth.jotai";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { MdChat, MdClose, MdArrowBack, MdSend } from "react-icons/md";
import { TConversation } from "@/types/global/chat.type";

// ─── helpers ────────────────────────────────────────────────────────────────

const timeLabel = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    return isToday
        ? d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
        : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
};

const avatar = (name: string, photo?: string | null) =>
    photo ? (
        <img src={photo} alt={name} className="w-full h-full object-cover rounded-full" />
    ) : (
        <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
            {name?.charAt(0)?.toUpperCase()}
        </span>
    );

// ─── ConversationList ────────────────────────────────────────────────────────

const ConversationList = ({
    conversations,
    myId,
    onSelect,
}: {
    conversations: TConversation[];
    myId: string;
    onSelect: (conv: TConversation) => void;
}) => (
    <ul className="flex flex-col overflow-y-auto custom-scrollbar flex-1">
        {conversations.length === 0 && (
            <li className="py-10 text-center text-sm text-gray-400">Nenhuma conversa</li>
        )}
        {conversations.map((conv) => (
            <li
                key={conv.conversationId}
                onClick={() => onSelect(conv)}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 border-b border-gray-100 dark:border-white/5 last:border-0"
            >
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 overflow-hidden border border-gray-200 dark:border-gray-700">
                    {avatar(conv.otherUserName ?? "?", conv.otherUserPhoto)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90 truncate">
                            {conv.otherUserName ?? "Usuário"}
                        </p>
                        <span className="text-[10px] text-gray-400 shrink-0 ml-1">
                            {timeLabel(conv.lastMessageAt)}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{conv.lastMessage}</p>
                </div>
                {conv.unreadCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white shrink-0">
                        {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                    </span>
                )}
            </li>
        ))}
    </ul>
);

// ─── MessageWindow ───────────────────────────────────────────────────────────

const MessageWindow = ({
    myId,
    myName,
    myPhoto,
}: {
    myId: string;
    myName: string;
    myPhoto: string;
}) => {
    const {
        messages,
        activeChatUser,
        typingUser,
        sendMessage,
        notifyTyping,
        notifyStopTyping,
        closeChat,
    } = useChat();

    const [text, setText] = useState("");
    const bottomRef  = useRef<HTMLDivElement>(null);
    const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!text.trim() || !activeChatUser) return;
        await sendMessage(activeChatUser.id, text.trim());
        setText("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleTyping = (val: string) => {
        setText(val);
        if (!activeChatUser) return;
        notifyTyping(activeChatUser.id);
        if (typingTimer.current) clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(() => notifyStopTyping(activeChatUser.id), 2000);
    };

    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-white/5">
                <button
                    onClick={closeChat}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                    <MdArrowBack size={20} />
                </button>
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 overflow-hidden border border-gray-200 dark:border-gray-700">
                    {avatar(activeChatUser?.name ?? "?", activeChatUser?.photo)}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white/90 truncate">
                        {activeChatUser?.name}
                    </p>
                    {typingUser && (
                        <p className="text-[10px] text-brand-500 animate-pulse">digitando...</p>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-2 flex flex-col gap-2">
                {messages.map((msg) => {
                    const isMine = msg.senderId === myId;
                    return (
                        <div
                            key={msg.id}
                            className={`flex items-end gap-1.5 ${isMine ? "flex-row-reverse" : "flex-row"}`}
                        >
                            {!isMine && (
                                <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 overflow-hidden border border-gray-200 dark:border-gray-700 self-end">
                                    {avatar(msg.senderName, msg.senderPhoto)}
                                </div>
                            )}
                            <div
                                className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-relaxed break-words ${
                                    isMine
                                        ? "bg-brand-500 text-white rounded-br-sm"
                                        : "bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white/90 rounded-bl-sm"
                                }`}
                            >
                                {msg.content}
                                <span className={`block text-[9px] mt-0.5 text-right ${isMine ? "text-white/60" : "text-gray-400"}`}>
                                    {timeLabel(msg.createdAt)}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-3 py-2 border-t border-gray-100 dark:border-white/5">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => handleTyping(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Digite uma mensagem..."
                    className="flex-1 h-9 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 text-sm text-gray-800 dark:text-white/90 placeholder:text-gray-400 focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-500/10"
                />
                <button
                    onClick={handleSend}
                    disabled={!text.trim()}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white disabled:opacity-40 hover:bg-brand-600 transition-colors shrink-0"
                >
                    <MdSend size={18} />
                </button>
            </div>
        </div>
    );
};

// ─── ChatWidget (main) ───────────────────────────────────────────────────────

export const ChatWidget = () => {
    const [userLogger] = useAtom(userLoggerAtom);
    const myId = localStorage?.getItem("telemovviId") ?? "";

    const {
        conversations,
        activeChatUser,
        chatOpen,
        unreadCount,
        openChat,
        closeChat,
        isConnected,
    } = useChat();

    const [panelOpen, setPanelOpen] = useState(false);

    const handleSelectConversation = (conv: TConversation) => {
        if (!conv.otherUserId) return;
        openChat(
            {
                id:    conv.otherUserId,
                name:  conv.otherUserName ?? "Usuário",
                photo: conv.otherUserPhoto ?? "",
            },
            conv.conversationId
        );
    };

    return (
        <>
            {/* Floating button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setPanelOpen((p) => !p)}
                    className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-white shadow-theme-xl hover:bg-brand-600 transition-colors"
                >
                    {panelOpen ? <MdClose size={24} /> : <MdChat size={24} />}
                    {unreadCount > 0 && !panelOpen && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-error-500 text-[10px] font-bold">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Panel */}
            {panelOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-[340px] h-[500px] rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-theme-xl flex flex-col overflow-hidden">
                    {/* Panel header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/5 bg-brand-500">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-white">Chat</h3>
                            <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-success-400" : "bg-gray-400"}`} title={isConnected ? "Conectado" : "Desconectado"} />
                        </div>
                        <button onClick={() => setPanelOpen(false)} className="text-white/70 hover:text-white">
                            <MdClose size={18} />
                        </button>
                    </div>

                    {/* Content */}
                    {chatOpen && activeChatUser ? (
                        <MessageWindow myId={myId} myName={userLogger.name} myPhoto={userLogger.photo} />
                    ) : (
                        <ConversationList
                            conversations={conversations}
                            myId={myId}
                            onSelect={handleSelectConversation}
                        />
                    )}
                </div>
            )}
        </>
    );
};