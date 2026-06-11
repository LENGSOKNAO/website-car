import Pusher from "pusher-js";

const PUSHER_KEY = import.meta.env.VITE_PUSHER_KEY || "";
const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER || "ap1";

let pusherInstance: Pusher | null = null;

export function getPusher(): Pusher | null {
  if (!pusherInstance && PUSHER_KEY) {
    pusherInstance = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
      forceTLS: true,
      authEndpoint: `${import.meta.env.VITE_API_URL || ""}/api/v1/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    });
  }
  return pusherInstance;
}

export function subscribeToConversation(conversationId: string, callbacks: {
  onMessageCreated?: (message: any) => void;
  onMessageRead?: (data: { message_id: string; user_id: string }) => void;
  onTypingStarted?: (data: { user_id: string; user_name: string }) => void;
  onTypingStopped?: (data: { user_id: string }) => void;
}) {
  const pusher = getPusher();
  if (!pusher) return () => {};

  const channel = pusher.subscribe(`private-App.Models.Conversation.${conversationId}`);

  if (callbacks.onMessageCreated) {
    channel.bind("MessageCreated", callbacks.onMessageCreated);
  }
  if (callbacks.onMessageRead) {
    channel.bind("MessageRead", callbacks.onMessageRead);
  }
  if (callbacks.onTypingStarted) {
    channel.bind("TypingStarted", callbacks.onTypingStarted);
  }
  if (callbacks.onTypingStopped) {
    channel.bind("TypingStopped", callbacks.onTypingStopped);
  }

  return () => {
    if (callbacks.onMessageCreated) channel.unbind("MessageCreated", callbacks.onMessageCreated);
    if (callbacks.onMessageRead) channel.unbind("MessageRead", callbacks.onMessageRead);
    if (callbacks.onTypingStarted) channel.unbind("TypingStarted", callbacks.onTypingStarted);
    if (callbacks.onTypingStopped) channel.unbind("TypingStopped", callbacks.onTypingStopped);
    pusher.unsubscribe(`private-conversation.${conversationId}`);
  };
}

export function subscribeToPresence(callbacks: {
  onUserOnline?: (user: any) => void;
  onUserOffline?: (user: any) => void;
}) {
  const pusher = getPusher();
  if (!pusher) return () => {};

  const channel = pusher.subscribe("presence-users");

  if (callbacks.onUserOnline) {
    channel.bind("UserOnline", callbacks.onUserOnline);
  }
  if (callbacks.onUserOffline) {
    channel.bind("UserOffline", callbacks.onUserOffline);
  }

  channel.bind("pusher:member_added", (member: any) => {
    if (callbacks.onUserOnline) callbacks.onUserOnline(member.info);
  });

  channel.bind("pusher:member_removed", (member: any) => {
    if (callbacks.onUserOffline) callbacks.onUserOffline(member.info);
  });

  return () => {
    if (callbacks.onUserOnline) channel.unbind("UserOnline", callbacks.onUserOnline);
    if (callbacks.onUserOffline) channel.unbind("UserOffline", callbacks.onUserOffline);
    channel.unbind("pusher:member_added");
    channel.unbind("pusher:member_removed");
    pusher.unsubscribe("presence-users");
  };
}

export function triggerTyping(conversationId: string, isTyping: boolean) {
  const pusher = getPusher();
  if (!pusher) return;

  const channel = pusher.channel(`private-App.Models.Conversation.${conversationId}`);
  if (channel) {
    channel.trigger("client-typing", {
      event: isTyping ? "typing" : "stop_typing",
      user_id: localStorage.getItem("user_id"),
    });
  }
}

export function disconnectPusher() {
  if (pusherInstance) {
    pusherInstance.disconnect();
    pusherInstance = null;
  }
}