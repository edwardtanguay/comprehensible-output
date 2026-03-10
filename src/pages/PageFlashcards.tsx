import { useState } from "react";
import phrasesRaw from "../../parseddata/compoutPhrases.json";
import { Phrase } from "../types";

export const PageFlashcards = () => {
	const phrases = (phrasesRaw as Phrase[])
		.sort((a, b) => (a.when_recorded > b.when_recorded ? -1 : 1))
		.slice(0, 10);

	return (
		<div className="flex flex-col items-center gap-6 p-6">
			<h1 className="text-3xl font-bold text-slate-100 mb-4">Latest 10 Flashcards</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
				{phrases.map((phrase, index) => (
					<Flashcard key={index} phrase={phrase} />
				))}
			</div>
		</div>
	);
};

const Flashcard = ({ phrase }: { phrase: Phrase }) => {
	const [isFlipped, setIsFlipped] = useState(false);

	return (
		<div
			className="group perspective-1000 h-48 cursor-pointer"
			onClick={() => setIsFlipped(!isFlipped)}
		>
			<div
				className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? "rotate-y-180" : ""
					}`}
			>
				{/* Front */}
				<div className="absolute inset-0 bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col justify-center items-center shadow-xl backface-hidden ring-1 ring-slate-700 hover:ring-slate-500 transition-all">
					<h2 className="text-xl font-medium text-slate-200 text-center px-4 leading-relaxed">
						{phrase.source_phrase}
					</h2>
				</div>

				{/* Back */}
				<div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-indigo-950 border border-blue-500/30 rounded-xl p-6 flex flex-col justify-center items-center shadow-2xl backface-hidden rotate-y-180">
					<h2 className="text-2xl font-bold text-white text-center px-4 leading-tight drop-shadow-md">
						{phrase.target_phrase}
					</h2>
				</div>
			</div>
		</div>
	);
};
