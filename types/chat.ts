interface GroupChatSession {
	type: "group";
	groupName: string;
}

interface UserChatSession {
	type: "user";
	name: string;
	phone: string;
	groupName: string;
}

export interface ChatItem {
	message: string;
	name: string;
	phone: string;
}

export type ChatSession = GroupChatSession | UserChatSession;
