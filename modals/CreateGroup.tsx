import * as React from "react";

interface CreateGroupProps {
	isOpen: boolean;
	onCreate: (group: string) => void;
	closeModal: () => void;
}

export const CreateGroup = ({ isOpen, onCreate, closeModal }: CreateGroupProps) => {
	const [group, setGroup] = React.useState("");
	const [error, setError] = React.useState("");

	if (!isOpen) return null;

	const handleCreateGroup = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");

		if (group.length >= 3) {
			const theGroup = group;
			setGroup("");
			onCreate(theGroup);
		} else {
			setError("Please provide valid group");
		}
	};

	return (
		<div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 transition-opacity duration-300 ease-in-out">
			<div className="bg-white p-8 rounded-lg shadow-lg relative w-1/3">
				<button onClick={closeModal} className="absolute top-4 right-4 text-gray-800 hover:text-gray-900">
					&times;
				</button>
				<form onSubmit={handleCreateGroup}>
					<h2 className="text-xl font-semibold">Create group</h2>
					<input
						value={group}
						type="text"
						placeholder="Enter group name"
						onChange={(e) => setGroup(e.target.value)}
						className="block mt-4 border px-4 py-2 w-full"
					/>
					{!!error && <p className="text-red-600 text-sm mt-1">{error}</p>}
					<button
						type="submit"
						className="mt-4 bg-green-500 px-4 py-2 text-white rounded-sm hover:bg-green-700"
					>
						Create
					</button>
				</form>
			</div>
		</div>
	);
};
