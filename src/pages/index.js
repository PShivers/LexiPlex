import * as React from "react";
import { useState } from "react";
const puzzles = require("../../utils/puzzles");
// TODO: ADD "HOW TO" MODAL

//#region Styles
const pageStyles = {
	height: "100vh",
	backgroundColor: "slategrey",
	color: "#232129",
	padding: 50,
	fontFamily: "-apple-system, Roboto, sans-serif, serif",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
};
const headingStyles = {
	marginTop: 0,
	marginBottom: 30,
	maxWidth: 320,
	fontSize: 80,
};
const logoStyles = {
	color: "tomato",
};
const tileStyles = {
	display: "flex",
	marginTop: 5,
};
const letterWrapperStyles = {
	display: "flex",
};
const letterStyles = {
	// backgroundColor: "lightgrey",
};
//#endregion Styles

const IndexPage = () => {
	const [puzzle, setPuzzle] = useState(
		puzzles[Math.floor(Math.random() * puzzles.length)]
	);
	const [disabledButtons, setDisabledButtons] = useState([]);
	const [solution, setSolution] = useState(
		Array.from(puzzle.answer).map((letter, index) => {
			return {
				letter: letter,
				guessed: false,
			};
		})
	);

	const tiles = solution.map((position, index) => {
		if (position.letter === " ") {
			return (
				<div
					key={index}
					data-value={position.letter}
					style={{ backgroundColor: "slategrey", margin: 1, padding: 10 }}
				>
					{position.letter}
				</div>
			);
		} else {
			return (
				<div
					key={index}
					data-value={position.letter}
					style={{
						backgroundColor: "lightgrey",
						margin: 1,
						padding: 10,
					}}
				>
					{position.guessed ? position.letter : null}
				</div>
			);
		}
	});

	const alphabet = "abcdefghijklmnopqrstuvwxyz";

	const handleLetterClick = (letter) => {
		const updatedSolution = solution.map((position) => {
			if (position.letter === letter) {
				return {
					...position,
					guessed: true,
				};
			}
			return position;
		});

		setSolution(updatedSolution);
		setDisabledButtons((prevDisabledButtons) => [
			...prevDisabledButtons,
			letter,
		]);
	};

	const letters = Array.from(alphabet).map((letter, index) => {
		return (
			<button
				key={index}
				data-value={letter}
				style={letterStyles}
				class={
					disabledButtons.includes(letter)
						? "bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50"
						: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
				}
				onClick={() => handleLetterClick(letter)}
				disabled={disabledButtons.includes(letter)}
			>
				{letter}
			</button>
		);
	});

	return (
		<main style={pageStyles}>
			<h1 style={headingStyles}>
				Lexi<span style={logoStyles}>plex</span>
			</h1>
			<h2>Today's clue:</h2>
			<p>{puzzle.clue}</p>
			<div style={tileStyles}>{tiles}</div>
			<form class="w-full max-w-sm">
				<div class="flex items-center border-b border-slate-300 py-2">
					<input
						class="appearance-none bg-transparent border-none w-full text-black-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
						type="text"
						placeholder="Your answer here..."
						aria-label="Answer"
					/>
				</div>
			</form>{" "}
			<p>Hints:</p>
			<p style={letterWrapperStyles}>{letters}</p>
		</main>
	);
};

export default IndexPage;

export const Head = () => <title>Lexiplex</title>;
