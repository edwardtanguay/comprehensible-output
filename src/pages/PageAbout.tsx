export const PageAbout = () => {
	return (
		<>
			<p className="mb-3">
				This is application is a tool for the comprehensible output method of language learning. It organizes multi-lingual texts that a language learner writes, records and listens to, which provides practice in both creating texts and understanding texts. This app works well using it locally on a laptop or desktop computer, and then reading and listening to the texts on a smartphone or tablet.
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
