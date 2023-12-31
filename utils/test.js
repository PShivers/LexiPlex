const fs = require("fs");

const dictionary = require("./en-dictionary");

// const dictionary = ["flagrant", "briefest", "flag", "rant", "brie", "fest"];
function isValidSubword(word, dictionary) {
	const excludedWords = ["ment", "able", "less", "ness", "ing", "sci", "nate"];
	if (
		word.length > 2 &&
		dictionary.includes(word) &&
		!excludedWords.includes(word)
	) {
		return true;
	} else {
		return false;
	}
}
function buildWordList(dictionary) {
	const wordsWithLegitimateSubwords = [];

	for (let i = 0; i < 1000; i++) {
		wordsWithLegitimateSubwords.push(
			...findLegitimateSubwords(dictionary[i], dictionary)
		);
	}

	return wordsWithLegitimateSubwords;
}

function findLegitimateSubwords(word, dictionary) {
	const objsForReturn = [];

	for (let i = 1; i < word.length - 1; i++) {
		const before = word.substring(0, i);
		const after = word.substring(i);

		if (
			isValidSubword(before, dictionary) &&
			isValidSubword(after, dictionary)
		) {
			const newEntry = { word: word, subWord1: before, subWord2: after };
			objsForReturn.push(newEntry);
		}
	}

	return objsForReturn;
}

const content = JSON.stringify(buildWordList(dictionary), null, 2);

fs.writeFile("1000.json", content, "utf8", (err) => {
	if (err) {
		console.error("Error writing file:", err);
		return;
	}
	console.log("File created successfully.");
});
