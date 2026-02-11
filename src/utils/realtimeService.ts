export type RealtimeMessageType =
    | "CURSOR_MOVE"
    | "ITEM_ADDED"
    | "ITEM_MOVED"
    | "ITEM_REMOVED"
    | "DRAWING_ADDED"
    | "DRAWING_REMOVED"
    | "BOARD_CLEARED"
    | "USER_JOINED";

export interface RealtimeMessage {
    type: RealtimeMessageType;
    payload: any;
    senderId: string;
    timestamp: number;
}

const CHANNEL_NAME = "vltactic_board_sync";

class RealtimeService {
    private channel: BroadcastChannel | null = null;
    private listeners: Set<(msg: RealtimeMessage) => void> = new Set();
    private userId: string;

    constructor() {
        this.userId = Math.random().toString(36).substring(2, 9);
        if (typeof window !== "undefined") {
            this.channel = new BroadcastChannel(CHANNEL_NAME);
            this.channel.onmessage = (event) => {
                const msg = event.data as RealtimeMessage;
                if (msg.senderId !== this.userId) {
                    this.listeners.forEach((l) => l(msg));
                }
            };
        }
    }

    getUserId() {
        return this.userId;
    }

    send(type: RealtimeMessageType, payload: any) {
        if (!this.channel) return;
        const msg: RealtimeMessage = {
            type,
            payload,
            senderId: this.userId,
            timestamp: Date.now(),
        };
        this.channel.postMessage(msg);
    }

    subscribe(callback: (msg: RealtimeMessage) => void) {
        this.listeners.add(callback);
        return () => {
            this.listeners.delete(callback);
        };
    }
}

export const realtimeService = new RealtimeService();
