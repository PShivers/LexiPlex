const React = require("react");

exports.onRenderBody = ({ setPreBodyComponents }) => {
	setPreBodyComponents([
		<script
			key="dark-mode-init"
			dangerouslySetInnerHTML={{
				__html: `
          (function() {
            var stored = localStorage.getItem('darkMode');
            var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (stored === 'true' || (stored === null && prefersDark)) {
              document.documentElement.classList.add('dark');
            }
          })();
        `,
			}}
		/>,
	]);
};
