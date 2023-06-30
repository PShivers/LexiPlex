import React from "react";

const Modal = ({ closeModal }) => {
	return (
		// <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center modal-overlay drop-shadow-xl backdrop-blur-sm	">
		<div className="fixed w-full h-full flex items-center justify-center modal-overlay drop-shadow-xl backdrop-blur-sm	">
			<div className="text-center bg-white p-6 rounded max-w-xs	modal">
				<h3 className="text-xl font-bold mb-4">How To Play</h3>
				<p className="mb-4">
					Lexiplex is a word puzzle game where you are given a clue and the
					answer will be made of 3 words, with two of the words making up the
					third.
				</p>
				<p className="mb-4">
					For example: If the clue is <b>"That handlebar has gotta hurt!"</b>{" "}
					the answer would be <b>"Mustache Must Ache"</b>.
				</p>
				<p className="mb-4">
					If you are stuck and need a hint simply click any of the letters on
					the bottom of the screen and you will see any occurences of the letter
					in the blank tiles Wheel of Fortune style.
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
