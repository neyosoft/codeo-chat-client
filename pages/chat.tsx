import Image from "next/image";
import { io } from "socket.io-client";
import { useRouter } from "next/router";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

import { UserInfo } from "@/types/user";
import { ChatItem, ChatSession } from "@/types/chat";
import { CreateGroup } from "@/modals/CreateGroup";

const ENDPOINT = `${process.env.NEXT_PUBLIC_BACKENDURL}`;

export default function Chat() {
	const router = useRouter();
	const socketRef = useRef(io(ENDPOINT, { transports: ["websocket"] }));

	const [chat, setChat] = useState("");
	const [modal, setModal] = useState(false);
	const [groups, setGroups] = useState<string[]>([]);
	const [users, setUsers] = useState<UserInfo[]>([]);
	const [chatList, setChatList] = useState<ChatItem[]>([]);
	const [session, setSession] = useState<ChatSession | null>(null);

	const handleIncommingGroupChat = useCallback(
		(newChat: ChatItem) => {
			// console.log("There is a new group message", newChat);

			// only show message from the selected group
			if (session?.groupName === newChat.group) {
				setChatList((prevChats) => [...prevChats, newChat]);
			}
		},
		[session?.groupName]
	);

	useEffect(() => {
		if (!(router.query.name && router.query.phone)) {
			router.push("/");
		}

		socketRef.current.emit("setup", { name: router.query.name, phone: router.query.phone });

		socketRef.current.on("user-list", (userList: UserInfo[]) => {
			setUsers(userList.filter((member) => member.phone !== router.query.phone));
		});
		socketRef.current.on("groups", setGroups);
		socketRef.current.on("new-group-chat", handleIncommingGroupChat);
	}, [handleIncommingGroupChat, router]);

	const currentPhone = router.query.phone as string;

	const handleCreateGroup = (group: string) => {
		socketRef.current.emit("new-group", group);
		setModal(false);
	};

	const submitChat = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		socketRef.current.emit("group-message", { name: session?.groupName, message: chat });

		setChat("");
	};

	const startGroupSession = (group: string) => {
		// don't change anything if it's the same chat
		if (session?.groupName === group) return;

		if (session?.groupName) {
			socketRef.current.emit("leave", session.groupName);
		}

		setChatList([]);

		socketRef.current.emit("join", group);

		setSession({
			type: "group",
			groupName: group,
		});
	};

	const startUserSession = (member: UserInfo) => {
		const groupName = [member.phone, router.query?.phone].sort().join("-");

		// don't change anything if it's the same chat
		if (session?.groupName === groupName) return;

		if (session?.groupName) {
			socketRef.current.emit("leave", session.groupName);
		}

		setChatList([]);

		socketRef.current.emit("join", groupName);

		setSession({
			...member,
			groupName,
			type: "user",
		});
	};

	return (
		<main className="flex flex-col h-screen">
			<div className="p-5 bg-[#F7F8FC]">
				<h1 className="text-3xl text-center ">Welcome {router.query?.name}</h1>
			</div>
			<div className="flex flex-1 ">
				<aside className="bg-white w-[30%] min-w-[300px]">
					<div className="mt-4">
						<h3 className="text-center">Users</h3>

						<div className="flex flex-col gap-y-2 mt-2">
							{users.map((member) => (
								<div
									key={member.phone}
									className={`p-4 cursor-pointer flex items-center gap-x-4 border-x-[#EAEDEF] ${
										session?.type === "user" && session.phone === member.phone ? "bg-[#F0F2F5]" : ""
									} hover:bg-[#F0F2F5] `}
									onClick={() => startUserSession(member)}
								>
									<Image alt="User" width={50} height={50} src="/avatar.png" />
									<div>
										<p className="font-semibold">{member.name}</p>
										<p className="text-sm">{member.phone}</p>
									</div>
								</div>
							))}
						</div>
					</div>
					<div className="mt-8">
						<h3 className="text-center">Groups</h3>
						<div className="flex flex-col gap-y-1 mt-2">
							{groups.map((group) => (
								<div
									key={group}
									onClick={() => startGroupSession(group)}
									className={`items-center cursor-pointer p-2 border-x-[#EAEDEF] ${
										session?.type === "group" && session?.groupName === group ? "bg-[#F0F2F5]" : ""
									} hover:bg-[#F0F2F5]`}
								>
									+ {group}
								</div>
							))}
							<button className="px-4 py-1 text-sm" onClick={() => setModal(true)}>
								+ Add New Group
							</button>
						</div>
					</div>
				</aside>
				<div className="flex flex-col flex-1 bg-[#F1EDE7]">
					{!session ? (
						<div className="text-center text-lg flex flex-col flex-1 items-center justify-center">
							Kindly select someone or group to start chatting
						</div>
					) : (
						<div className="flex flex-col flex-1">
							<div className="flex flex-col items-start flex-1 p-4 gap-y-4">
								{chatList.map((chat) => (
									<div key={chat.id} className={`${chat.phone === currentPhone ? "self-end" : ""}`}>
										{session.type === "group" && chat.phone !== currentPhone && (
											<p className={`text-sm text-gray-600`}>{chat.name}</p>
										)}
										<div
											className={`px-4 py-2 rounded-md max-w-xl ${
												chat.phone === currentPhone ? "bg-[#E0FCD6]" : "bg-white"
											}`}
										>
											{chat.message}
										</div>
									</div>
								))}
							</div>
							<form onSubmit={submitChat}>
								<div>
									<input
										type="text"
										value={chat}
										placeholder="Enter chat here..."
										onChange={(e) => setChat(e.target.value)}
										className="px-4 py-2 block outline-none border w-full hover:outline-none"
									/>
								</div>
							</form>
						</div>
					)}
				</div>
			</div>

			<CreateGroup isOpen={modal} closeModal={() => setModal(false)} onCreate={handleCreateGroup} />
		</main>
	);
}
