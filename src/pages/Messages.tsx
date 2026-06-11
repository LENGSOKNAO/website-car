import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  MessageSquare,
  ChevronLeft,
  Loader,
  Search,
  Plus,
  Edit,
  Trash2,
  Check,
  CheckCheck,
  X,
  MoreVertical,
  Pencil,
  UserCheck,
  Send,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import Avatar from "@/components/ui/Avatar";
import type { Conversation, Message } from "@/lib/types";
import { cn, formatDateRelative } from "@/lib/utils";
import { triggerTyping } from "@/lib/pusher";
import "@/bootstrap";

export default function Messages() {
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionMenu, setActionMenu] = useState<{
    msg: any;
    x: number;
    y: number;
    menuWidth: number;
  } | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        actionMenu &&
        !(e.target as HTMLElement).closest("[data-action-menu]")
      ) {
        setActionMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [actionMenu]);

  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const typingTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const sellerParam = searchParams.get("seller");
  const listingParam = searchParams.get("listing");

  const groupedConversations = conversations.reduce((acc: any, conv: any) => {
    const otherId =
      String(conv.sender_id) === String(user?.id)
        ? conv.receiver_id
        : conv.sender_id;
    const other =
      String(conv.sender_id) === String(user?.id) ? conv.receiver : conv.sender;
    const existing = acc[otherId];
    if (
      !existing ||
      new Date(conv.last_message_at || conv.last_message?.created_at || 0) >
        new Date(
          existing.last_message_at || existing.last_message?.created_at || 0,
        )
    ) {
      acc[otherId] = { ...conv, other, otherId };
    }
    return acc;
  }, {});

  useEffect(() => {
    const initialUnread: Record<string, number> = {};
    conversations.forEach((conv: any) => {
      if (
        conv.last_message &&
        String(conv.last_message.sender_id) !== String(user?.id) &&
        !conv.last_message.read_at
      ) {
        const otherId =
          String(conv.sender_id) === String(user?.id)
            ? conv.receiver_id
            : conv.sender_id;
        initialUnread[otherId] = (initialUnread[otherId] || 0) + 1;
      }
    });
    setUnreadCounts(initialUnread);
  }, [conversations, user?.id]);

  const totalUnread = Object.values(unreadCounts).reduce(
    (sum: number, count: any) => sum + count,
    0,
  );

  const uniqueConversations = Object.values(groupedConversations);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    api
      .conversations()
      .then((res) => {
        const raw = res?.data?.data ?? res?.data ?? res ?? [];
        setConversations(
          Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [],
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && allUsers.length === 0) {
      api
        .users()
        .then((res) => {
          const raw = res?.data?.data ?? res?.data ?? res ?? [];
          setAllUsers(
            Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [],
          );
        })
        .catch(() => {});
    }
  }, [isAuthenticated, allUsers.length]);

  useEffect(() => {
    if (!selectedConv) {
      setMessages([]);
      return;
    }
    setMsgLoading(true);
    api
      .conversationMessages(selectedConv)
      .then((res) => {
        const raw = res?.data?.data ?? res?.data ?? res ?? [];
        const fetched = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
            ? raw.data
            : [];
        setMessages((prev) => {
          const existing = new Set(prev.map((m) => m.id));
          const merged = [...prev];
          for (const m of fetched) {
            if (!existing.has(m.id)) merged.push(m);
          }
          return merged;
        });
      })
      .catch(() => setMessages([]))
      .finally(() => setMsgLoading(false));
  }, [selectedConv]);

  // Set up real-time updates using Echo/Pusher
  useEffect(() => {
    if (!selectedConv || !window.Echo) {
      if (!window.Echo) {
        console.warn("Echo not available. Real-time updates disabled.");
      }
      return;
    }

    const conversationId = selectedConv;
    const echo = window.Echo;
    const channel = echo.private(`App.Models.Conversation.${conversationId}`);

    // Listen for the MessageCreated event
    channel.listen(".MessageCreated", (e: any) => {
      const msg = e.message ?? e;
      if (msg) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
    });

    // Listen for MessageRead event
    channel.listen(".MessageRead", (e: any) => {
      if (e.message_id) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === e.message_id && String(m.sender_id) !== String(user?.id)
              ? { ...m, read_at: e.read_at }
              : m,
          ),
        );

        // Update unread counts in conversation list
        setUnreadCounts((prev) => {
          const updated = { ...prev };
          const conv = conversations.find((c) => c.id === conversationId);
          if (conv) {
            const otherId =
              String(conv.sender_id) === String(user?.id)
                ? conv.receiver_id
                : conv.sender_id;
            if (updated[otherId] > 0) {
              updated[otherId] = Math.max(0, updated[otherId] - 1);
            }
          }
          return updated;
        });
      }
    });

    // Listen for typing whispers (client events)
    channel.listenForWhisper(
      "typing",
      (e: { user_id: string; typing: boolean }) => {
        if (String(e.user_id) === String(user?.id)) return;
        setTypingUsers((prev) => {
          if (e.typing) {
            return prev.includes(e.user_id) ? prev : [...prev, e.user_id];
          }
          return prev.filter((id) => id !== e.user_id);
        });
      },
    );

    // Clean up on unmount
    return () => {
      echo.leave(`App.Models.Conversation.${conversationId}`);
    };
  }, [selectedConv, user?.id]);

  // Polling fallback for when real-time isn't working
  useEffect(() => {
    if (!selectedConv) return;

    let pollingInterval: ReturnType<typeof setInterval> | null = null;
    let isMounted = true;
    let lastKnownMessageCount = messages.length;
    let errorCount = 0;
    const MAX_ERRORS_BEFORE_BACKOFF = 3;

    const fetchNewMessages = async () => {
      if (!isMounted) return;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || ""}/api/v1/conversations/${selectedConv}/messages`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          errorCount = 0;

          if (isMounted && data) {
            const newMessages = Array.isArray(data.data)
              ? data.data
              : Array.isArray(data)
                ? data
                : [];

            if (newMessages.length !== lastKnownMessageCount) {
              setMessages(newMessages);
              lastKnownMessageCount = newMessages.length;

              if (isMounted && bottomRef.current) {
                requestAnimationFrame(() => {
                  if (isMounted && bottomRef.current) {
                    bottomRef.current.scrollIntoView({ behavior: "smooth" });
                  }
                });
              }
            }
          }
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        if (isMounted) {
          errorCount++;
          console.warn(
            `Failed to fetch new messages (error #${errorCount}):`,
            error,
          );
          if (errorCount >= MAX_ERRORS_BEFORE_BACKOFF) {
            console.warn(
              "Multiple consecutive errors fetching messages. Continuing to try...",
            );
          }
        }
      }
    };

    pollingInterval = setInterval(fetchNewMessages, 5000);

    return () => {
      isMounted = false;
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [selectedConv, messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (selectedConv) {
      api.markConversationRead(selectedConv).catch(() => {});
    }
  }, [selectedConv]);

  useEffect(() => {
    clearTimeout(searchTimer.current);
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    searchTimer.current = setTimeout(() => {
      const q = searchQuery.trim().toLowerCase();
      setSearchResults(
        allUsers.filter(
          (u: any) =>
            String(u.id) !== String(user?.id) &&
            (u.full_name ?? u.name ?? u.email ?? "").toLowerCase().includes(q),
        ),
      );
      setSearching(false);
    }, 200);
    return () => clearTimeout(searchTimer.current);
  }, [searchQuery, user?.id, allUsers]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInput(value);
    if (selectedConv && value.trim()) {
      triggerTyping(selectedConv);
      clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => {
        triggerTyping(selectedConv, false);
      }, 2000);
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || sending) return;
    if (selectedUser && !selectedConv) {
      setSending(true);
      try {
        const res = await api.sendMessage({
          receiver_id: selectedUser.id,
          listing_id: listingParam || undefined,
          content: input.trim(),
        });
        const msg = res?.data?.data ?? res?.data ?? res;
        if (msg?.conversation_id) {
          setSelectedConv(msg.conversation_id);
          setSelectedUser(null);
          setSearchQuery("");
          setSearchResults([]);
          const convRes = await api.conversations();
          const raw = convRes?.data?.data ?? convRes?.data ?? convRes ?? [];
          setConversations(
            Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [],
          );
        }
        setInput("");
      } catch (e: any) {
        console.error("Send message error:", e?.message || e);
      }
      setSending(false);
    } else if (selectedConv) {
      setSending(true);
      try {
        const res = await api.replyConversation(selectedConv, {
          content: input.trim(),
        });
        const msg = res?.data?.data ?? res?.data;
        if (msg)
          setMessages((prev) => {
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
        setInput("");
      } catch (e: any) {
        console.error("Reply error:", e?.message || e, e?.response);
      }
      setSending(false);
    }
  }

  async function handleEdit(msg: any) {
    setEditingId(msg.id);
    setEditContent(msg.content);
  }

  async function saveEdit(msgId: string) {
    try {
      const res = await api.editMessage(msgId, { content: editContent.trim() });
      const updated = res?.data?.data ?? res?.data ?? res;
      if (updated) {
        setMessages((prev) => prev.map((m) => (m.id === msgId ? updated : m)));
      }
      setEditingId(null);
      setEditContent("");
    } catch (e: any) {
      console.error("Edit error:", e?.message || e);
    }
  }

  async function cancelEdit() {
    setEditingId(null);
    setEditContent("");
  }

  async function handleDelete(msgId: string) {
    if (!window.confirm("Delete this message?")) return;
    setDeletingId(msgId);
    try {
      await api.deleteMessage(msgId);
      setMessages((prev) => prev.filter((m) => m.id !== msgId));
    } catch (e: any) {
      console.error("Delete error:", e?.message || e);
    }
    setDeletingId(null);
  }

  function getUserName(u: any) {
    return u?.full_name || u?.name || "Unknown";
  }
  function getUserAvatar(u: any) {
    return u?.avatar_url || u?.avatar || null;
  }

  function handleSelectUser(u: any) {
    const existing = conversations.find(
      (c) =>
        String(c.sender_id) === String(u.id) ||
        String(c.receiver_id) === String(u.id),
    );
    if (existing) {
      setSelectedConv(existing.id);
      setSelectedUser(null);
    } else {
      setSelectedConv(null);
      setMessages([]);
      setSelectedUser(u);
    }
    setSearchQuery("");
    setSearchResults([]);
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-6">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Sign in to view messages
          </h2>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-full transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const selectedConvData = conversations.find((c) => c.id === selectedConv);
  const otherUser = selectedConvData
    ? String(selectedConvData.sender_id) === String(user?.id)
      ? selectedConvData.receiver
      : selectedConvData.sender
    : selectedUser;

  return (
    <div className="h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 shrink-0">
        <h1 className="text-lg font-bold text-gray-900">Messages</h1>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div
          className={cn(
            "w-full md:w-80 lg:w-96 border-r border-gray-200 bg-white flex flex-col shrink-0",
            selectedConv && "hidden md:flex",
          )}
        >
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 text-gray-900 placeholder-gray-400"
              />
              {searching && (
                <Loader className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 animate-spin" />
              )}
            </div>
          </div>

          {searchQuery.trim() && searchResults.length > 0 ? (
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              <div className="px-4 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Search Results
              </div>
              {searchResults.map((u: any) => (
                <button
                  key={u.id}
                  onClick={() => handleSelectUser(u)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <Avatar
                    name={getUserName(u)}
                    src={getUserAvatar(u)}
                    size="sm"
                    className="w-10 h-10 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {getUserName(u)}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {u.email || ""}
                    </p>
                  </div>
                  <Plus className="w-4 h-4 text-gray-400 shrink-0" />
                </button>
              ))}
            </div>
          ) : searchQuery.trim() && !searching ? (
            <div className="flex-1 flex items-center justify-center p-6 text-center">
              <p className="text-sm text-gray-400">No users found</p>
            </div>
          ) : loading ? (
            <div className="flex-1 p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-gray-100" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-100 rounded w-24" />
                    <div className="h-2.5 bg-gray-50 rounded w-40" />
                  </div>
                </div>
              ))}
            </div>
          ) : uniqueConversations.length === 0 && !sellerParam ? (
            <div className="flex-1 flex items-center justify-center p-6 text-center">
              <div>
                <MessageSquare className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p className="text-sm text-gray-500">
                  No conversations yet. Search for users above.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {uniqueConversations.map((conv: any) => (
                <button
                  key={conv.id}
                  onClick={() => {
                    setSelectedConv(conv.id);
                    setSelectedUser(null);
                  }}
                  className={cn(
                    "w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-gray-50",
                    selectedConv === conv.id && "bg-blue-50",
                  )}
                >
                  <Avatar
                    name={getUserName(conv.other) || "U"}
                    src={getUserAvatar(conv.other)}
                    size="sm"
                    className="w-10 h-10 shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {getUserName(conv.other)}
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        {conv.last_message?.created_at && (
                          <span className="text-[10px] text-gray-400 shrink-0">
                            {formatDateRelative(conv.last_message.created_at)}
                          </span>
                        )}
                      </div>
                    </div>
{conv.last_message && (
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {conv.last_message?.content || conv.subject || "No messages"}
                      </p>
                    )}
                    {conv.listing && (
                      <p className="text-[10px] text-blue-500 mt-0.5 truncate">
                        {conv.listing.make?.name || ""}{" "}
                        {conv.listing.model?.name || ""}
                      </p>
                    )}
                  </div>
                </button>
              ))}
              {typingUsers.length > 0 && (
                <div className="flex justify-start px-2">
                  <div className="flex items-center gap-1 text-xs text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-1.5">
                    <div className="flex gap-0.5">
                      <span
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                    <span>
                      {typingUsers.length === 1 ? "typing..." : "are typing..."}
                    </span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <div
          className={cn(
            "flex-1 flex flex-col bg-gray-50 ",
            !selectedConv && !selectedUser && !sellerParam && "hidden md:flex",
          )}
        >
          {otherUser ? (
            <>
              <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shrink-0">
                <button
                  onClick={() => {
                    setSelectedConv(null);
                    setSelectedUser(null);
                    setMessages([]);
                  }}
                  className="md:hidden p-1 -ml-1 text-gray-500 hover:text-gray-700"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <Avatar
                  name={getUserName(otherUser) || "U"}
                  src={getUserAvatar(otherUser)}
                  size="sm"
                  className="w-8 h-8"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {getUserName(otherUser)}
                  </p>
                  {selectedConvData?.listing && (
                    <p className="text-[11px] text-gray-500">
                      {selectedConvData.listing.make?.name || ""}{" "}
                      {selectedConvData.listing.model?.name || ""} &middot;{" "}
                      {selectedConvData.listing.year || ""}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {msgLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader className="w-5 h-5 text-gray-300 animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center py-12 text-center">
                    <p className="text-sm text-gray-400">
                      Send a message to start the conversation.
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMine = String(msg.sender_id) === String(user?.id);
                    const isEditing = editingId === msg.id;
                    return (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex",
                          isMine ? "justify-end" : "justify-start",
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[75%] px-3.5 py-2.5 rounded-lg text-sm relative",
                            isMine
                              ? "bg-gray-900 text-white rounded-br-sm"
                              : "bg-white border border-gray-200 text-gray-900 rounded-bl-sm",
                          )}
                          onDoubleClick={(e) => {
                            if (isMine) {
                              const menuWidth = 120;
                              const x =
                                e.clientX + menuWidth > window.innerWidth
                                  ? window.innerWidth - menuWidth - 10
                                  : e.clientX;
                              setActionMenu({
                                msg,
                                x,
                                y: e.clientY,
                                menuWidth,
                              });
                            }
                          }}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            if (isMine) {
                              const menuWidth = 120;
                              const x =
                                e.clientX + menuWidth > window.innerWidth
                                  ? window.innerWidth - menuWidth - 10
                                  : e.clientX;
                              setActionMenu({
                                msg,
                                x,
                                y: e.clientY,
                                menuWidth,
                              });
                            }
                          }}
                        >
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:border-blue-500"
                                autoFocus
                              />
                              <button
                                onClick={() => saveEdit(msg.id)}
                                disabled={
                                  !editContent.trim() || deletingId === msg.id
                                }
                                className="p-1.5 text-green-500 hover:bg-green-50 rounded"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <p className="leading-relaxed">{msg.content}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <p
                                  className={cn(
                                    "text-[10px]",
                                    isMine ? "text-gray-400" : "text-gray-400",
                                  )}
                                >
                                  {formatDateRelative(msg.created_at)}
                                </p>
                                {isMine && (
                                  <span className="flex items-center ml-1">
                                    {msg.read_at ? (
                                      <CheckCheck className="w-4 h-4 text-blue-500" />
                                    ) : (
                                      <Check className="w-4 h-4 text-gray-400" />
                                    )}
                                  </span>
                                )}
                                {msg.edited_at && (
                                  <span className="ml-1 text-[10px] text-gray-400">
                                    &middot; Edited
                                  </span>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                        {isMine && actionMenu?.msg?.id === msg.id && (
                          <div
                            data-action-menu
                            className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px]"
                            style={{
                              left:
                                actionMenu.x + actionMenu.menuWidth >
                                (typeof window !== "undefined"
                                  ? window.innerWidth
                                  : 1920)
                                  ? undefined
                                  : actionMenu.x,
                              right:
                                actionMenu.x + actionMenu.menuWidth >
                                (typeof window !== "undefined"
                                  ? window.innerWidth
                                  : 1920)
                                  ? (typeof window !== "undefined"
                                      ? window.innerWidth
                                      : 1920) - actionMenu.x
                                  : undefined,
                              top: actionMenu.y,
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(actionMenu.msg);
                                setActionMenu(null);
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(actionMenu.msg.id);
                                setActionMenu(null);
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              <form
                onSubmit={handleSend}
                className="bg-white border-t border-gray-200 px-4 py-3 shrink-0"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder={
                      selectedUser && !selectedConv
                        ? "Send a message to start..."
                        : "Type a message..."
                    }
                    className="flex-1 px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 text-gray-900 placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || sending}
                    className="shrink-0 w-9 h-9 rounded-lg bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-6">
              <div>
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm text-gray-500">
                  Search for users or select a conversation
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
