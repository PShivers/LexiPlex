import React from "react";

const CongratulationsModal = ({ closeModal }) => {
	return (
		// <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center modal-overlay drop-shadow-xl backdrop-blur-sm	">
		<div className="fixed w-full h-full flex items-center justify-center modal-overlay drop-shadow-xl backdrop-blur-sm	">
			<div className="flex flex-col justify-center text-center bg-white p-6 rounded max-w-xs	modal">
				<h3 className="text-xl font-bold mb-4">Congratulations!</h3>
				<p className="mb-4">You have solved the puzzle!</p>
				<p className="mb-4">Come back tomorrow for another puzzle</p>
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3"
					onClick={closeModal}
				>
					Close
				</button>
			</div>
		</div>
	);
};

export default CongratulationsModal;
