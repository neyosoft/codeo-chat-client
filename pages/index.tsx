import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

const contacts = [
	"08132338203",
	"08038021699",
	"08032339283",
	"09088334488",
	"09033445566",
	"09032223344",
	"09034565432",
	"08077884455",
	"08077884422",
	"08077884433",
];

export default function Home() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		router.push(`/chat?name=${name}&phone=${phoneNumber}`);
	};

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="w-[500px] border p-8">
				<h1 className="text-3xl text-center font-medium">Welcome to Codeo chat</h1>

				<p className="text-gray-600 text-sm mt-2">
					To continue using the application, please provide your name and phone number
				</p>

				<form onSubmit={handleSubmit}>
					<div className="mt-5">
						<div>
							<label htmlFor="name">
								<span className="block mb-2 text-sm font-medium text-gray-900">Name</span>
								<input
									required
									id="name"
									type="text"
									name="name"
									value={name}
									placeholder="Enter name"
									onChange={(e) => setName(e.target.value)}
									className="ring-2 px-2 py-2 block w-full rounded-sm"
								/>
							</label>
						</div>
						<div className="mt-4">
							<label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900">
								Select phone number
							</label>
							<select
								id="phone"
								required
								name="phone"
								onChange={(e) => setPhoneNumber(e.target.value)}
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
							>
								<option value="">-- Select ---</option>
								{contacts.map((phone) => (
									<option key={phone} value={phone}>
										{phone}
									</option>
								))}
							</select>
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
