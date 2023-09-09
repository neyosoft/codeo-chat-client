import { UserInfo } from "@/types/user";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const ENDPOINT = `${process.env.NEXT_PUBLIC_BACKENDURL}`;

export default function Chat() {
	const router = useRouter();
	const socketRef = useRef<any>();

	const [users, setUsers] = useState<UserInfo[]>([]);

	const init = async () => {
		if (!(router.query.name && router.query.phone)) {
			return router.push("/");
		}

		socketRef.current = io(ENDPOINT, { transports: ["websocket"] });

		socketRef.current.emit("setup", { name: router.query.name, phone: router.query.phone });

		socketRef.current.on("user-list", setUsers);
	};

	useEffect(() => {
		init();
	}, []);

	return (
		<main className="flex flex-col h-screen">
			<div className="">
				<h1 className="text-3xl text-center p-5">Welcome {router.query?.name}</h1>
			</div>
			<div className="flex flex-1 ">
				<aside className="bg-gray-200 min-w-[250px] p-4">
					<div>
						<h3 className="text-center">Users</h3>

						<div className="flex flex-col gap-y-3">
							{users.map((user) => (
								<div key={user.phone}>
									<p>{user.name}</p>
									<p>{user.phone}</p>
								</div>
							))}
						</div>
					</div>
					<div className="mt-8">
						<h3 className="text-center">Groups</h3>
					</div>
				</aside>
				<div className="flex flex-col flex-1 ">
					<div>
						<input type="text" placeholder="Enter chat here..." className="right-2 flex flex-1" />
					</div>
				</div>
			</div>
		</main>
	);
}
