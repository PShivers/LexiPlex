import * as React from "react";
import { useState, useEffect } from "react";
import Modal from "../components/modal";
import CongratulationsModal from "../components/congratulationsModal";
const puzzles = require("../../utils/puzzles");

//#region Styles
const pageStyles = {
	minHeight: "100vh",
	fontFamily: "-apple-system, Roboto, sans-serif, serif",
};

const logoStyles = {
	color: "tomato",
};

const tileRowStyles = {
	minHeight: "25.6px",
};

const letterStyles = {
	minWidth: "10%",
	minHeight: "10%",
};
//#endregion Styles

const IndexPage = () => {
	//#region hooks
	const puzzle = puzzles[1];
	const [isModalVisible, setModalVisible] = useState(false);
	const [hintsRemaining, setHintsRemaining] = useState(3);
	const [hintsDisabled, setHintsDisabled] = useState(false);
	const [disabledButtons, setDisabledButtons] = useState([]);
	const [answer, setAnswer] = useState("");
	const [showCongratulationsModal, setShowCongratulationsModal] =
		useState(false);
	const [showWrongAnswerFeedback, setShowWrongAnswerFeedback] = useState(false);
	const [solution, setSolution] = useState(
		puzzle.answer.split(" ").map((word) =>
			Array.from(word).map((letter) => ({
				letter: letter.toUpperCase(),
				guessed: false,
			}))
		)
	);
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		setDarkMode(document.documentElement.classList.contains("dark"));
	}, []);
	//#endregion hooks

	//#region components to be broken out
	const tiles = solution.map((word, wordIndex) => (
		<div
			key={wordIndex}
			style={tileRowStyles}
			className="flex justify-center h-full mb-2 md:mt-0 md:mr-3"
		>
			{word.map((position, index) => (
				<div key={index} style={tileRowStyles}>
					<div
						key={index}
						data-value={position.letter}
						className="bg-white dark:bg-gray-700 text-blue-500 dark:text-blue-400 font-bold rounded border border-slate-300 dark:border-gray-600 w-6 min-h-full text-center"
					>
						{position.guessed ? position.letter : null}
					</div>
				</div>
			))}
		</div>
	));

	const qwerty = [
		["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
		["A", "S", "D", "F", "G", "H", "J", "K", "L"],
		["Z", "X", "C", "V", "B", "N", "M"],
	];

	const letters = qwerty.map((row, rowIndex) => (
		<div key={rowIndex} className="mb-2 flex justify-center w-full sm:w-1/2">
			{row.map((letter, index) => (
				<div
					className="flex justify-center items-center"
					key={index}
					style={letterStyles}
				>
					<button
						key={index}
						data-value={letter}
						style={letterStyles}
						className={
							disabledButtons.includes(letter) || hintsDisabled === true
								? "w-8 bg-blue-500 text-white font-bold border border-blue-500 rounded md:text-2xl opacity-50"
								: "w-8 bg-blue-500 text-white font-bold border border-blue-700 rounded md:text-2xl drop-shadow-2xl hover:bg-blue-700"
						}
						onClick={() => handleLetterClick(letter)}
						disabled={
							disabledButtons.includes(letter) || hintsDisabled === true
						}
					>
						{letter}
					</button>
				</div>
			))}
		</div>
	));

	//#endregion

	//#region handlers
	const toggleDarkMode = () => {
		const newMode = !darkMode;
		setDarkMode(newMode);
		if (newMode) {
			document.documentElement.classList.add("dark");
			localStorage.setItem("darkMode", "true");
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("darkMode", "false");
		}
	};

	const handleInfoClick = () => {
		setModalVisible(true);
	};

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

		setHintsRemaining((prevHintsRemaining) => {
			const newHintsRemaining = prevHintsRemaining - 1;
			if (newHintsRemaining === 0) {
				setHintsDisabled(true);
			}
			return newHintsRemaining;
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (answer.toLowerCase() === puzzle.answer.toLowerCase()) {
			setShowCongratulationsModal(true);
		} else {
			setShowWrongAnswerFeedback(true);

			setTimeout(() => {
				setShowWrongAnswerFeedback(false);
			}, 1000);
		}
	};
	//#endregion handlers

	return (
		<main
			style={pageStyles}
			className="flex flex-col items-center md:p-5 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
		>
			<header className="w-full text-center flex flex-row items-center justify-between mb-3 md:mb-8 md:justify-center border-bottom-solid border-2 border-slate-600 dark:border-gray-600 border-x-0 drop-shadow-lg px-2 md:px-7">
				<div className="flex items-center justify-start grow-[1]">
					<button
						className="cursor-pointer bg-transparent border-none p-0"
						onClick={toggleDarkMode}
						aria-label="Toggle dark mode"
					>
						{darkMode ? (
							// mdi-white-balance-sunny
							<svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
								<path d="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z" />
							</svg>
						) : (
							// mdi-weather-night
							<svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
								<path d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.84 3.34,14.64 6.35,17.66C9.37,20.67 14.17,20.78 17.33,17.97Z" />
							</svg>
						)}
					</button>
				</div>
				<h1 className="text-5xl md:text-8xl grow-[2] drop-shadow-lg">
					Lexi
					<span className="text-tomato" style={logoStyles}>
						plex
					</span>
				</h1>
				<div className="flex items-center justify-end grow-[1]">
					<div className="svg-wrapper">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-6 h-6 w-full cursor-pointer"
							onClick={handleInfoClick}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
							/>
						</svg>
					</div>
				</div>
			</header>

			<h2 className="text-2xl md:text-3xl">Today's clue:</h2>
			<p className="w-11/12 text-center text-3xl md:text-4xl mb-3">
				{puzzle.clue}
			</p>

			<div className="flex flex-col w-11/12 md:flex-row flex-wrap justify-center mt-3">
				{tiles}
			</div>

			<form className="w-11/12 max-w-sm mb-3 mt-3" onSubmit={handleSubmit}>
				<div className="flex items-center border-b border-slate-500 dark:border-gray-500 py-2">
					<input
						className={`appearance-none bg-transparent border-none w-full text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 mr-3 py-1 px-2 leading-tight focus:outline-none ${
							showWrongAnswerFeedback ? "wrong-answer" : ""
						}`}
						type="text"
						placeholder="Your answer here..."
						aria-label="Answer"
						onChange={(e) => setAnswer(e.target.value)}
					/>
					<button
						className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-0 px-1 rounded"
						type="submit"
					>
						Submit
					</button>
				</div>
			</form>
			<p>Hints remaining: {hintsRemaining}</p>
			<div className="flex flex-col justify-center w-11/12 lg:w-3/4 items-center mt-3">
				{letters}
			</div>
			{isModalVisible && <Modal closeModal={() => setModalVisible(false)} />}
			{showCongratulationsModal && (
				<CongratulationsModal
					closeModal={() => setShowCongratulationsModal(false)}
				/>
			)}
			<style>
				{`
  .wrong-answer {
    animation: wrong-answer-animation 1s linear;
  }

  @keyframes wrong-answer-animation {
    0% {
      color: inherit;
    }
    5% {
      color: red;
    }
    100% {
      color: inherit;
    }
  }
  `}
			</style>
		</main>
	);
};

export default IndexPage;

export const Head = () => <title>Lexiplex</title>;
