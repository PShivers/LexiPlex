import * as React from "react";
import { useState, useEffect, useRef } from "react";
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

const tileStyles = {
	minHeight: "72px",
};
//#endregion Styles

const IndexPage = () => {
	const puzzle = puzzles[1];

	// Structure 1: solution[0] = compound word, solution[1] = subword1, solution[2] = subword2
	// Structure 2: solution[2] = compound word, solution[0] = subword1, solution[1] = subword2
	const compoundRowIdx = puzzle.structure === 1 ? 0 : 2;
	const subword1RowIdx = puzzle.structure === 1 ? 1 : 0;
	const subword2RowIdx = puzzle.structure === 1 ? 2 : 1;

	// Maps (wordIndex, letterIndex) → index in the compound word
	const getCompoundIndex = (wordIdx, letterIdx, sol) => {
		const sw1Len = sol[subword1RowIdx].length;
		if (puzzle.structure === 1) {
			return wordIdx === 2 ? letterIdx + sw1Len : letterIdx;
		} else {
			return wordIdx === 1 ? letterIdx + sw1Len : letterIdx;
		}
	};

	//#region state
	const [isModalVisible, setModalVisible] = useState(false);
	const initialHints = compoundLength <= 5 ? 1 : compoundLength <= 8 ? 2 : 3;
	const [hintsRemaining, setHintsRemaining] = useState(initialHints);
	const [hintsDisabled, setHintsDisabled] = useState(false);
	const [showCongratulationsModal, setShowCongratulationsModal] = useState(false);
	const [showWrongAnswerFeedback, setShowWrongAnswerFeedback] = useState(false);
	const [solution, setSolution] = useState(
		puzzle.answer.split(" ").map((word) =>
			Array.from(word).map((letter) => ({
				letter: letter.toUpperCase(),
				guessed: false,
			}))
		)
	);
	// typedLetters is a flat array indexed by compound word position
	const compoundLength = puzzle.answer.split(" ")[compoundRowIdx].length;
	const [typedLetters, setTypedLetters] = useState(
		Array(compoundLength).fill("")
	);
	const [cursor, setCursor] = useState(0);
	const [submitted, setSubmitted] = useState(false);
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		setDarkMode(document.documentElement.classList.contains("dark"));
	}, []);

	const stateRef = useRef();
	stateRef.current = { typedLetters, cursor, submitted, solution };
	//#endregion

	//#region keydown handler
	useEffect(() => {
		const handleKeyDown = (e) => {
			const { typedLetters, cursor, submitted, solution } = stateRef.current;
			const compoundLen = solution[compoundRowIdx].length;

			if (e.key === "Enter") {
				if (!submitted) handleSubmitRef.current();
				return;
			}

			if (e.key === "Backspace") {
				e.preventDefault();
				if (submitted) setSubmitted(false);

				// If current position is empty, move back one and clear that
				const targetIdx = !typedLetters[cursor]
					? Math.max(0, cursor - 1)
					: cursor;
				setTypedLetters(typedLetters.map((c, i) => (i === targetIdx ? "" : c)));
				setCursor(targetIdx);
				return;
			}

			if (/^[a-zA-Z]$/.test(e.key)) {
				if (submitted) setSubmitted(false);
				const char = e.key.toUpperCase();
				setTypedLetters(typedLetters.map((c, i) => (i === cursor ? char : c)));
				setCursor(Math.min(cursor + 1, compoundLen - 1));
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);
	//#endregion

	//#region submit (ref so keydown can call it without stale closures)
	const handleSubmitRef = useRef();
	handleSubmitRef.current = () => {
		const { typedLetters, solution } = stateRef.current;
		if (typedLetters.some((c) => c === "")) return;

		const isCorrect = solution[compoundRowIdx].every(
			(pos, i) => typedLetters[i] === pos.letter
		);

		setSubmitted(true);
		if (isCorrect) {
			setShowCongratulationsModal(true);
		} else {
			setShowWrongAnswerFeedback(true);
			setTimeout(() => setShowWrongAnswerFeedback(false), 600);
		}
	};
	//#endregion

	//#region tile helpers
	const allAnswerLetters = new Set(
		solution[compoundRowIdx].map((p) => p.letter)
	);

	const getTileClass = (compoundIndex, isAtCursor) => {
		const base = "font-bold rounded border w-[72px] h-[72px] text-4xl flex items-center justify-center m-1";
		const typedChar = typedLetters[compoundIndex];
		const correctLetter = solution[compoundRowIdx][compoundIndex].letter;
		const isGuessed = solution[compoundRowIdx][compoundIndex].guessed;

		if (submitted) {
			if (isGuessed || typedChar === correctLetter) {
				return `${base} bg-green-500 text-white border-green-600`;
			}
			if (typedChar && allAnswerLetters.has(typedChar)) {
				return `${base} bg-yellow-400 dark:bg-yellow-500 text-white border-yellow-500`;
			}
			if (typedChar) {
				return `${base} bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 border-gray-400 dark:border-gray-500`;
			}
		}

		const cursorRing = isAtCursor
			? " ring-2 ring-blue-400 dark:ring-blue-300 relative z-10"
			: "";
		return `${base} bg-white dark:bg-gray-700 text-blue-500 dark:text-blue-400 border-slate-300 dark:border-gray-600${cursorRing}`;
	};

	const renderTile = (compoundIndex, isAtCursor, pos) => {
		const typedChar = typedLetters[compoundIndex];
		const display = pos.guessed ? pos.letter : typedChar || null;
		return (
			<div key={compoundIndex} style={tileStyles}>
				<div className={getTileClass(compoundIndex, isAtCursor)}>
					{display}
				</div>
			</div>
		);
	};
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

	const handleInfoClick = () => setModalVisible(true);

	const handleHint = () => {
		const unrevealed = solution[compoundRowIdx]
			.map((pos, i) => i)
			.filter((i) => !solution[compoundRowIdx][i].guessed);
		if (unrevealed.length === 0) return;

		const targetIndex =
			unrevealed[Math.floor(Math.random() * unrevealed.length)];

		setSolution((prev) =>
			prev.map((word, wordIndex) =>
				word.map((pos, letterIndex) =>
					getCompoundIndex(wordIndex, letterIndex, prev) === targetIndex
						? { ...pos, guessed: true }
						: pos
				)
			)
		);

		setHintsRemaining((prev) => {
			const next = prev - 1;
			if (next === 0) setHintsDisabled(true);
			return next;
		});
	};
	//#endregion

	const sw1Len = solution[subword1RowIdx].length;

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
							<svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
								<path d="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z" />
							</svg>
						) : (
							<svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
								<path d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.84 3.34,14.64 6.35,17.66C9.37,20.67 14.17,20.78 17.33,17.97Z" />
							</svg>
						)}
					</button>
				</div>
				<h1 className="text-5xl md:text-8xl grow-[2] drop-shadow-lg">
					Lexi
					<span style={logoStyles}>plex</span>
				</h1>
				<div className="flex items-center justify-end grow-[1]">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-6 h-6 cursor-pointer"
						onClick={handleInfoClick}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
						/>
					</svg>
				</div>
			</header>

			<h2 className="text-2xl md:text-3xl">Today's clue:</h2>
			<p className="w-11/12 text-center text-3xl md:text-4xl mb-3">
				{puzzle.clue}
			</p>

			<div className={`flex flex-col items-center mt-3${showWrongAnswerFeedback ? " wrong-answer" : ""}`}>
				{/* Top row: compound word — user types here */}
				<div className="flex mb-2">
					{solution[compoundRowIdx].map((pos, i) =>
						renderTile(i, !submitted && cursor === i, pos)
					)}
				</div>

				{/* Bottom row: subword1 | gap | subword2 — auto-filled */}
				<div className="flex">
					<div className="flex mr-3">
						{solution[subword1RowIdx].map((pos, li) =>
							renderTile(li, false, pos)
						)}
					</div>
					<div className="flex">
						{solution[subword2RowIdx].map((pos, li) =>
							renderTile(li + sw1Len, false, pos)
						)}
					</div>
				</div>
			</div>

			<button
				className="mt-4 mb-2 flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-3 rounded"
				onClick={() => handleSubmitRef.current()}
			>
				Submit
			</button>

			<button
				className="mt-1 mb-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 border border-gray-400 dark:border-gray-500 text-sm text-gray-700 dark:text-gray-200 py-1 px-3 rounded disabled:opacity-40"
				onClick={handleHint}
				disabled={hintsDisabled}
			>
				Hint ({hintsRemaining} left)
			</button>

			{isModalVisible && <Modal closeModal={() => setModalVisible(false)} />}
			{showCongratulationsModal && (
				<CongratulationsModal
					closeModal={() => setShowCongratulationsModal(false)}
				/>
			)}
			<style>{`
  .wrong-answer {
    animation: wrong-answer-shake 0.5s ease-in-out;
  }
  @keyframes wrong-answer-shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-5px); }
    40%       { transform: translateX(5px); }
    60%       { transform: translateX(-5px); }
    80%       { transform: translateX(5px); }
  }
`}</style>
		</main>
	);
};

export default IndexPage;

export const Head = () => <title>Lexiplex</title>;
