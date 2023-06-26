import * as React from "react";

const pageStyles = {
	height: "100vh",
	backgroundColor: "slategray",
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
	fontSize: 50,
};
const logoStyles = {
	color: "tomato",
};
const paragraphStyles = {
	marginBottom: 48,
};
const inputStyles = {};

const IndexPage = () => {
	return (
		<main style={pageStyles}>
			<h1 style={headingStyles}>
				Lexi<span style={logoStyles}>plex</span>
			</h1>
			<h2>Today's clue:</h2>
			<p>
				When you refuse to participate in applying fake tanner to your stomach?
			</p>
			<form class="w-full max-w-sm">
				<div class="flex items-center border-b border-slate-300 py-2">
					<input
						class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
						type="text"
						placeholder="Your answer here..."
						aria-label="Full name"
					/>
				</div>
			</form>{" "}
		</main>
	);
};

export default IndexPage;

export const Head = () => <title>Home Page</title>;
