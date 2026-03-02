import React from "react";

const Modal = ({ closeModal }) => {
	return (
		<div className="fixed w-full h-full flex items-center justify-center modal-overlay drop-shadow-xl backdrop-blur-sm">
			<div className="text-center bg-white dark:bg-gray-800 dark:text-gray-100 p-6 rounded max-w-xs modal">
				<h3 className="text-xl font-bold mb-4">How To Play</h3>
				<p className="mb-4">
					Lexiplex is a word puzzle game where you are given a clue and must
					find a compound word that splits into two smaller words.
				</p>
				<p className="mb-4">
					For example: If the clue is <b>"That handlebar has gotta hurt!"</b>{" "}
					the answer would be <b>MUSTACHE</b>, made up of <b>MUST</b> +{" "}
					<b>ACHE</b>.
				</p>
				<p className="mb-4">
					Type your answer using your keyboard. The top row is where you type
					the compound word; the bottom row shows how it splits into two parts.
					Press <b>Enter</b> or click <b>Submit</b> to check your answer.
				</p>
				<p className="mb-4">
					Stuck? Click the <b>Hint</b> button to reveal a random letter. Shorter
					words get fewer hints; longer words get more.
				</p>
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3"
					onClick={closeModal}
				>
					Got it!
				</button>
			</div>
		</div>
	);
};

export default Modal;
