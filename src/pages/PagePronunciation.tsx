import { useState, useEffect } from "react";
import pronFlashcards from "../../parseddata/pronunciations.json";

interface IPronunciation {
	language: string;
	front: string;
	pronunciation: string;
	back: string;
}

export const PagePronunciation = () => {
	const [cards, setCards] = useState<IPronunciation[]>([]);
	const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
	const [learnedIds, setLearnedIds] = useState<string[]>([]);

	// Initialize cards and learned state
	useEffect(() => {
		const storedLearned = localStorage.getItem("comprehensible_learned_cards");
		if (storedLearned) {
			setLearnedIds(JSON.parse(storedLearned));
		}

		const shuffled = [...(pronFlashcards as IPronunciation[])].sort(
			() => Math.random() - 0.5
		);
		setCards(shuffled);
	}, []);

	const handleMarkAsLearned = (language: string, front: string) => {
		const id = `${language}:${front}`;
		const newLearned = [...learnedIds, id];
		setLearnedIds(newLearned);
		localStorage.setItem("comprehensible_learned_cards", JSON.stringify(newLearned));
	};

	const handleResetLearned = () => {
		if (window.confirm("Are you sure you want to reset all cards to unlearned?")) {
			setLearnedIds([]);
			localStorage.removeItem("comprehensible_learned_cards");
		}
	};

	const languages = Array.from(new Set((pronFlashcards as IPronunciation[]).map(c => c.language))).sort();

	const filteredCards = cards
		.filter(c => !learnedIds.includes(`${c.language}:${c.front}`))
		.filter(c => selectedLanguage === "all" || c.language === selectedLanguage);

	return (
		<div className="space-y-6">
			<div className="flex flex-col md:flex-row gap-4 items-center justify-between p-6 bg-slate-800/40 rounded-3xl border border-slate-700/50 backdrop-blur-md shadow-2xl">
				<div className="text-center md:text-left">
					<h1 className="text-4xl font-black text-white tracking-tighter italic">
						PRONUNCIATION <span className="text-cyan-500">MASTER</span>
					</h1>
					<p className="text-slate-400 mt-1 font-medium">
						{filteredCards.length === 0 ? "You've learned everything!" : `Revealing ${filteredCards.length} unlearned cards`}
					</p>
				</div>

				<div className="flex gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-700/50">
					<button
						onClick={() => setSelectedLanguage("all")}
						className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${selectedLanguage === "all" ? "bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/20" : "text-slate-400 hover:text-white"}`}
					>
						ALL
					</button>
					{languages.map(lang => (
						<button
							key={lang}
							onClick={() => setSelectedLanguage(lang)}
							className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all uppercase ${selectedLanguage === lang ? "bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/20" : "text-slate-400 hover:text-white"}`}
						>
							{lang}
						</button>
					))}
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
				{filteredCards.map((card, index) => (
					<Flashcard
						key={`${card.language}-${card.front}-${index}`}
						card={card}
						onLearned={() => handleMarkAsLearned(card.language, card.front)}
					/>
				))}
			</div>

			{learnedIds.length > 0 && (
				<div className="flex justify-center pb-20">
					<button
						onClick={handleResetLearned}
						className="px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-bold border-2 border-red-900 rounded-2xl transition-all uppercase tracking-widest text-xs hover:scale-105 active:scale-95 shadow-2xl shadow-red-900/40"
					>
						Reset all {learnedIds.length} cards to unlearned
					</button>
				</div>
			)}
		</div>
	);
};

interface FlashcardProps {
	card: IPronunciation;
	onLearned: () => void;
}

const Flashcard = ({ card, onLearned }: FlashcardProps) => {
	const [isFlipped, setIsFlipped] = useState(false);

	return (
		<div
			onClick={() => setIsFlipped(!isFlipped)}
			className={`
        relative h-52 w-full cursor-pointer transition-all duration-300 transform
        ${isFlipped ? "bg-slate-800 border-cyan-500/50" : "bg-slate-700/80 hover:bg-slate-700 border-slate-600"}
        rounded-2xl border-2 shadow-xl overflow-hidden
        flex flex-col items-center justify-center p-8 text-center
        group hover:-translate-y-2 hover:shadow-cyan-500/20 hover:border-cyan-500/30
      `}
		>
			{!isFlipped ? (
				<div className="text-3xl font-bold text-white tracking-wide group-hover:scale-105 transition-transform duration-300">
					{card.front}
				</div>
			) : (
				<div className="flex flex-col items-center h-full justify-center space-y-4 animate-in fade-in zoom-in duration-300">
					<div className="bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/20">
						<span className="text-cyan-400 font-mono text-2xl font-bold">
							{card.pronunciation}
						</span>
					</div>
					<div className="text-slate-200 italic text-xl leading-tight font-light">
						{card.back}
					</div>
				</div>
			)}

			<div className="absolute top-3 right-3 flex items-center gap-2">
				<button
					onClick={(e) => {
						e.stopPropagation();
						onLearned();
					}}
					className="text-[10px] bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-emerald-950 font-bold px-3 py-1 rounded-lg border border-emerald-500/30 transition-all uppercase "
				>
					Mark as learned
				</button>
				<div className="text-[10px] text-slate-500 font-bold px-2 py-1 rounded-lg bg-slate-900/50 border border-slate-700 uppercase tracking-widest">
					{card.language}
				</div>
			</div>

			<div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
		</div>
	);
};


