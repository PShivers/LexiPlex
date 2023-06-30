import * as React from "react";
import { useState } from "react";
import Modal from "../components/modal"; // Import your modal component here

const puzzles = require("../../utils/puzzles");

// TODO: add check on submit to see if it is right
// TODO: get modal to fit iphone se
// TODO: add logic when clicking btn to check if puzzle isSolved
// TODO: add logic so that a user can't win if they got there using hints alone
// TODO: add congratulations modal upon completion of puzzle.
// TODO: TIMER?
// TODO: add dark mode toggle
// TODO: get tiles and letters to fit on mobile well
// TODO: add toggle between alpha and qwerty

//#region Styles
const pageStyles = {
	minHeight: "100vh",
	backgroundColor: "#f5f5f5",
	color: "#242424",
	fontFamily: "-apple-system, Roboto, sans-serif, serif",
};

const logoStyles = {
	color: "tomato",
};
//#endregion Styles

const IndexPage = () => {
	const [isModalVisible, setModalVisible] = useState(false);

	const handleSVGClick = () => {
		setModalVisible(true);
	};

	const [puzzle, setPuzzle] = useState(
		puzzles[Math.floor(Math.random() * puzzles.length)]
	);
	const [hintCount, setHintCount] = useState(0);
	const [disabledButtons, setDisabledButtons] = useState([]);

	const [solution, setSolution] = useState(
		puzzle.answer.split(" ").map((word) =>
			Array.from(word).map((letter) => ({
				letter: letter.toUpperCase(),
				guessed: false,
			}))
		)
	);

	const tiles = solution.map((word, wordIndex) => (
		<div
			key={wordIndex}
			className="flex justify-center h-full mt-2 md:mt-0 mr-3 ml-3"
		>
			{word.map((position, index) => (
				<div
					key={index}
					data-value={position.letter}
					className="bg-white text-blue-500 font-bold py-2 px-4 rounded border border-slate-300"
					style={{
						margin: 1,
						minWidth: 41,
						minHeight: 41,
					}}
				>
					{position.guessed ? position.letter : null}
				</div>
			))}
		</div>
	));

	// const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
	const qwerty = [
		["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
		["A", "S", "D", "F", "G", "H", "J", "K", "L"],
		["Z", "X", "C", "V", "B", "N", "M"],
	];

	const letters = qwerty.map((row, rowIndex) => (
		<div key={rowIndex} className="flex justify-center">
			{row.map((letter, index) => (
				<button
					key={index}
					data-value={letter}
					className={
						disabledButtons.includes(letter)
							? "bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 m-1"
							: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded m-1 drop-shadow-2xl"
					}
					onClick={() => handleLetterClick(letter)}
					disabled={disabledButtons.includes(letter)}
				>
					{letter}
				</button>
			))}
		</div>
	));

	const handleLetterClick = (letter) => {
		const updatedSolution = solution.map((word) =>
			word.map((position) => {
				if (position.letter === letter) {
					return {
						...position,
						guessed: true,
					};
				}
				return position;
			})
		);

		setSolution(updatedSolution);
		setDisabledButtons((prevDisabledButtons) => [
			...prevDisabledButtons,
			letter,
		]);
		setHintCount((prevHintCount) => prevHintCount + 1);
	};

	return (
		<main style={pageStyles} className="flex flex-col items-center md:p-20">
			<header className="w-full text-center flex flex-row items-center justify-between mb-3 md:mb-8 md:justify-center border-bottom-solid border-2 border-slate-600 border-x-0 drop-shadow-lg">
				<div className="grow-[1]"></div>
				<h1 className="text-5xl md:text-8xl grow-[2] drop-shadow-lg	">
					Lexi
					<span className="text-tomato" style={logoStyles}>
						plex
					</span>
				</h1>
				<div className="flex items-center grow-[1]">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-6 h-6 ml-auto cursor-pointer"
						onClick={handleSVGClick}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
						/>
					</svg>
				</div>
			</header>

			<h2 className="text-xl md:text-3xl">Today's clue:</h2>
			<p className="text-center text-xl	md:text-3xl mb-3">{puzzle.clue}</p>
			<div className="flex flex-col flex-shrink md:flex-row flex-wrap justify-center mt-3">
				{tiles}
			</div>
			<form className="w-full max-w-sm mb-3 mt-3">
				<div className="flex items-center border-b border-slate-500 py-2">
					<input
						className="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
						type="text"
						placeholder="Your answer here..."
						aria-label="Answer"
					/>
				</div>
			</form>
			<p>Hints used: {hintCount}</p>
			<div className="flex flex-col flex-shrink justify-center items-center mt-3 ml-3 mr-3">
				{letters}
			</div>
			{isModalVisible && <Modal closeModal={() => setModalVisible(false)} />}
		</main>
	);
};

export default IndexPage;

export const Head = () => <title>Lexiplex</title>;
