export const PageAbout = () => {
	return (
		<>
			<p className="mb-2">
				This app uses AI to create a story from the words and phrases that I look up at Google Translate each day. I then record myself reading the story aloud, then listen to it multiple times afterward during the following days like a podcast.
			</p>	
			<p className="mb-4">
				The story is created with AI by combining the words and phrases into a creative, coherent narrative, which helps me to learn and internalize the language I am currently looking up and learning. In the process, I practice the four skills of language learning: reading, writing, listening, and speaking.
			</p>
			<ul className="list-disc ml-6">
				<li className="mb-3">
					<a
						className="underline"
						href="https://github.com/edwardtanguay/comprehensible-output"
					>
						GitHub repository
					</a>
				</li>
				<li className="mb-3">
					<a
						className="underline"
						href="https://comprehensible-output.vercel.app"
					>
					Live site
					</a>
				</li>
				<li className="mb-3">
					<a
						className="underline"
						href="http://localhost:3221"
					>
					Local site
					</a>
				</li>
			</ul>
		</>
	);
};
