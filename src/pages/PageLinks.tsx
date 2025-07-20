export const PageLinks = () => {
	return (
		<div className="pageLinks">
			<h1 className="mb-3">My Language Learning Links</h1>
			<h2>Italian</h2>
			<ul>
				<li><b>italian-verbs-data</b>: <code>C:\edward\webs\italian\texts\itnotes.html</code> (<a target="_blank" href="https://tanguay.info/italian/texts/itnotes.html">online</a>)</li>
				<li>italian-info-and-links: <code>C:\edward\webs\italian\index.html</code> (<a target="_blank" href="https://tanguay.info/italian">online</a>)</li>
				<li><a target="_blank" href="https://interitalnotes.vercel.app/flashcards">Italian verb flashcards</a></li>
				<li><a target="_blank" href="https://conjugator.reverso.net/conjugation-italian.html">conjugate Italian verbs</a></li>
			</ul>

			<h2>Spanish</h2>
			<ul>
				<li><b>spanish-verb-data:</b> <code>C:\edward\projects\apps\langcore\public\es-verbs.html</code> (<a target="_blank" href="https://langcore.vercel.app/es-verbs.html">online</a>)
					<ul className="inner">
						<li>more verbs data files: <code>C:\edward\projects\apps\langcore\src\data\</code> (<a target="_blank" href="https://github.com/edwardtanguay/langcore/tree/dev/src/data">repo</a>)</li>
					</ul>
				</li>
				<li>spanish-info-and-links: <code>C:\edward\webs\spanish\index.html</code> (<a target="_blank" href="https://tanguay.info/spanish">online</a>)</li>
				<li><a target="_blank" href="https://langcore.vercel.app/spanishVerbs">Spanish verb site</a></li>
				<li><a target="_blank" href="https://www.123teachme.com/spanish_verb_conjugation/ir">conjugate Spanish verbs</a></li>
			</ul>
		</div>
	);
};
