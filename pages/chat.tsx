import { io } from "socket.io-client";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useRef, useState } from "react";

import { UserInfo } from "@/types/user";
import { ChatItem, ChatSession } from "@/types/chat";

const ENDPOINT = `${process.env.NEXT_PUBLIC_BACKENDURL}`;

export default function Chat() {
	const router = useRouter();
	const socketRef = useRef<any>();

	const [chat, setChat] = useState("");
	const [users, setUsers] = useState<UserInfo[]>([]);
	const [chatList, setChatList] = useState<ChatItem[]>([]);

	const [session, setSession] = useState<ChatSession | null>();

	const init = async () => {
		if (!(router.query.name && router.query.phone)) {
			return router.push("/");
		}

		socketRef.current = io(ENDPOINT, { transports: ["websocket"] });

		socketRef.current.emit("setup", { name: router.query.name, phone: router.query.phone });

		socketRef.current.on("user-list", (userList: UserInfo[]) => {
			setUsers(userList.filter((member) => member.phone !== router.query.phone));
		});
		socketRef.current.on("new-group-chat", (newChat: ChatItem) => {
			console.log("There is a new group message", newChat);

			setChatList((prevChats) => [...prevChats, newChat]);
		});
	};

	useEffect(() => {
		init();
	}, []);

	const submitChat = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		socketRef.current.emit("group-message", { name: session?.groupName, message: chat });

		setChat("");
	};

	return (
		<main className="flex flex-col h-screen">
			<div className="p-5 bg-neutral-500">
				<h1 className="text-3xl text-white text-center ">Welcome {router.query?.name}</h1>
			</div>
			<div className="flex flex-1 ">
				<aside className="bg-[#F7F8FC] min-w-[300px] p-4">
					<div>
						<h3 className="text-center">Users</h3>

						<div className="flex flex-col gap-y-3 mt-2">
							{users.map((member) => (
								<div
									key={member.phone}
									className="cursor-pointer"
									onClick={() => {
										const groupName = [member.phone, router.query?.phone].sort().join("-");

										socketRef.current.emit("join", groupName);

										setSession({
											...member,
											groupName,
											type: "user",
										});
									}}
								>
									<p className="font-semibold">{member.name}</p>
									<p className="text-sm">{member.phone}</p>
								</div>
							))}
						</div>
					</div>
					<div className="mt-8">
						<h3 className="text-center">Groups</h3>
					</div>
				</aside>
				<div className="flex flex-col flex-1">
					{!session ? (
						<div className="text-center text-lg flex flex-col flex-1 items-center justify-center">
							Kindly select someone or group to start chatting
						</div>
					) : (
						<div className="flex flex-col flex-1">
							<div className="flex flex-col flex-1 p-4 gap-y-4">
								{chatList.map((chat) => (
									<div key={chat.message}>
										<div className={`${chat.phone === router.query.phone ? "text-right" : ""}`}>
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
		</main>
	);
}
