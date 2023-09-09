import { useRouter } from "next/router";
import { useState } from "react";

export default function Home() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");

	const handleSubmit = (e: any) => {
		e.preventDefault();

		router.push(`/chat?name=${name}&phone=${phoneNumber}`);
	};

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="w-[500px] border p-8">
				<h1 className="text-3xl text-center">Welcome to Codeo chat</h1>

				<p className="text-gray-600 text-sm mt-2">
					To continue using the application, please provide your name and phone number
				</p>

				<form onSubmit={handleSubmit}>
					<div className="mt-5">
						<div>
							<label htmlFor="name">
								<span className="text-gray-700 text-sm">Name</span>
								<input
									required
									id="name"
									type="text"
									name="name"
									value={name}
									placeholder="Enter name"
									onChange={(e) => setName(e.target.value)}
									className="ring-2 px-2 py-1 mt-1 block w-full"
								/>
							</label>
						</div>
						<div className="mt-4">
							<label htmlFor="phone">
								<span className="text-gray-700 text-sm">Phone number</span>
								<select
									required
									name="phone"
									id="phone"
									onChange={(e) => setPhoneNumber(e.target.value)}
									className="ring-2 px-2 py-1 mt-1 block w-full"
								>
									<option value="">-- Select ---</option>
									<option value="08132338203">08132338203</option>
									<option value="08038021699">08038021699</option>
								</select>
							</label>
						</div>

						<button
							type="submit"
							className="mt-6 bg-green-500 px-4 py-2 text-white rounded-sm hover:bg-green-700"
						>
							Get Started
						</button>
					</div>
				</form>
			</div>
		</main>
	);
}
