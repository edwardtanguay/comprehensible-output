import { useState } from "react";
import phrasesRaw from "../../parseddata/compoutPhrases.json";
import { Phrase } from "../types";

export const PageFlashcards = () => {
	const phrases = (phrasesRaw as Phrase[])
		.sort((a, b) => (a.when_recorded > b.when_recorded ? -1 : 1))
		.slice(0, 10);

	return (
		<div className="flex flex-col items-center gap-6 p-6">
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
	const langClass = `flashcard-${phrase.target_language}`;

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
				<div className={`absolute inset-0 ${langClass} border border-slate-700/30 rounded-xl p-6 flex flex-col justify-center items-center shadow-xl backface-hidden transition-all`}>
					<h2 className="text-xl font-medium text-slate-200 text-center px-4 leading-relaxed">
						{phrase.source_phrase}
					</h2>
				</div>

				{/* Back */}
				<div className={`absolute inset-0 ${langClass} bg-gradient-to-br from-black/20 to-transparent border border-white/5 rounded-xl p-6 flex flex-col justify-center items-center shadow-2xl backface-hidden rotate-y-180`}>
					<h2 className="text-2xl font-bold text-white text-center px-4 leading-tight drop-shadow-md">
						{phrase.target_phrase}
					</h2>
				</div>
			</div>
		</div>
	);
};
