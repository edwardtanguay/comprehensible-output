import { useState, useEffect } from "react";
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import pronFlashcards from "../../parseddata/pronunciations.json";

interface IPronunciation {
	language: string;
	front: string;
	pronunciation: string;
	back: string;
}

const languageConfig: Record<string, { text: string; bg: string; shadow: string; border: string }> = {
	es: { text: "text-red-500", bg: "bg-red-500", shadow: "shadow-red-500/20", border: "border-red-500/30" },
	fr: { text: "text-blue-400", bg: "bg-blue-500", shadow: "shadow-blue-500/20", border: "border-blue-500/30" },
	it: { text: "text-emerald-500", bg: "bg-emerald-500", shadow: "shadow-emerald-500/20", border: "border-emerald-500/30" },
	nl: { text: "text-orange-500", bg: "bg-orange-500", shadow: "shadow-orange-500/20", border: "border-orange-500/30" }
};

const getLangStyles = (lang: string) => {
	const config = languageConfig[lang.toLowerCase()];
	return config || { text: "text-cyan-500", bg: "bg-cyan-500", shadow: "shadow-cyan-500/20", border: "border-cyan-500/30" };
};

export const PagePronunciation = () => {
	const [cards, setCards] = useState<IPronunciation[]>([]);
	const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
	const [learnedIds, setLearnedIds] = useState<string[]>([]);
	const [flipCounts, setFlipCounts] = useState<Record<string, number>>({});

	// Initialize cards and learned state
	useEffect(() => {
		const storedLearned = localStorage.getItem("comprehensible_learned_cards");
		if (storedLearned) {
			setLearnedIds(JSON.parse(storedLearned));
		}

		const storedFlips = localStorage.getItem("comprehensible_flip_counts");
		if (storedFlips) {
			setFlipCounts(JSON.parse(storedFlips));
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

	const handleIncrementFlip = (language: string, front: string) => {
		const id = `${language}:${front}`;
		const newCounts = {
			...flipCounts,
			[id]: (flipCounts[id] || 0) + 1
		};
		setFlipCounts(newCounts);
		localStorage.setItem("comprehensible_flip_counts", JSON.stringify(newCounts));
	};

	const handleResetLearned = () => {
		if (window.confirm("Are you sure you want to reset all cards and statistics?")) {
			setLearnedIds([]);
			setFlipCounts({});
			localStorage.removeItem("comprehensible_learned_cards");
			localStorage.removeItem("comprehensible_flip_counts");
		}
	};

	const languages = Array.from(new Set((pronFlashcards as IPronunciation[]).map(c => c.language))).sort();

	const cardsInLanguage = selectedLanguage === "all"
		? cards
		: cards.filter(c => c.language === selectedLanguage);

	const filteredCards = cardsInLanguage.filter(
		c => !learnedIds.includes(`${c.language}:${c.front}`)
	);

	const learnedCount = cardsInLanguage.length - filteredCards.length;
	const totalCount = cardsInLanguage.length;

	return (
		<div className="space-y-6">
			<div className="flex flex-col md:flex-row gap-4 items-center justify-between p-6 bg-slate-800/40 rounded-3xl border border-slate-700/50 backdrop-blur-md shadow-2xl">
				<div className="text-center md:text-left">
					<h1 className="text-4xl font-black text-white tracking-tighter italic">
						PRONUNCIATION <span className="text-cyan-500">MASTER</span>
					</h1>
					<div className="flex items-center justify-center md:justify-start gap-3 mt-2">
						<div className="flex items-baseline gap-1 bg-slate-900/60 px-3 py-1 rounded-xl border border-slate-700/50 shadow-inner">
							<span className="text-2xl font-black text-cyan-400 leading-none">{learnedCount}</span>
							<span className="text-xs text-slate-500 font-bold uppercase tracking-tight">learned</span>
						</div>
						<div className="h-4 w-px bg-slate-700/50" />
						<div className="flex items-baseline gap-1">
							<span className="text-xl font-bold text-slate-200 leading-none">{totalCount}</span>
							<span className="text-xs text-slate-500 font-bold uppercase tracking-tight">total</span>
						</div>
					</div>
				</div>

				<div className="flex gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-700/50">
					<button
						onClick={() => setSelectedLanguage("all")}
						className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${selectedLanguage === "all" ? "bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/20" : "text-slate-400 hover:text-white"}`}
					>
						ALL
					</button>
					{languages.map(lang => {
						const styles = getLangStyles(lang);
						return (
							<button
								key={lang}
								onClick={() => setSelectedLanguage(lang)}
								className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all uppercase ${selectedLanguage === lang ? `${styles.bg} text-slate-900 shadow-lg ${styles.shadow}` : `${styles.text} opacity-60 hover:opacity-100`}`}
							>
								{lang}
							</button>
						);
					})}
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
				{filteredCards.map((card, index) => (
					<Flashcard
						key={`${card.language}-${card.front}-${index}`}
						card={card}
						flipCount={flipCounts[`${card.language}:${card.front}`] || 0}
						onLearned={() => handleMarkAsLearned(card.language, card.front)}
						onFlip={() => handleIncrementFlip(card.language, card.front)}
					/>
				))}
			</div>

			{(learnedIds.length > 0 || Object.keys(flipCounts).length > 0) && (
				<div className="flex justify-center pb-20">
					<button
						onClick={handleResetLearned}
						className="px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-bold border-2 border-red-900 rounded-2xl transition-all uppercase tracking-widest text-xs hover:scale-105 active:scale-95 shadow-2xl shadow-red-900/40"
					>
						Reset all stats and learning progress
					</button>
				</div>
			)}
		</div>
	);
};

interface FlashcardProps {
	card: IPronunciation;
	flipCount: number;
	onLearned: () => void;
	onFlip: () => void;
}

const Flashcard = ({ card, flipCount, onLearned, onFlip }: FlashcardProps) => {
	const [isFlipped, setIsFlipped] = useState(false);
	const [isDimmed, setIsDimmed] = useState(false);

	const handleFlip = () => {
		if (isDimmed) return;
		if (!isFlipped) {
			onFlip();
		}
		setIsFlipped(!isFlipped);
	};

	const handleOpenTranslate = (e: React.MouseEvent) => {
		e.stopPropagation();
		const url = `https://translate.google.com/?sl=${card.language}&tl=en&text=${encodeURIComponent(card.front)}&op=translate`;
		window.open(url, "_blank");
	};

	const handleKeepLearning = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsDimmed(!isDimmed);
	};

	return (
		<div
			onClick={handleFlip}
			className={`
        relative h-52 w-full transition-all duration-300 transform
        ${isDimmed ? "opacity-20 translate-y-0 scale-95 grayscale cursor-default" : "cursor-pointer hover:-translate-y-2 hover:shadow-cyan-500/20 hover:border-cyan-500/30"}
        ${isFlipped ? "bg-slate-800 border-cyan-500/50" : "bg-slate-700/80 hover:bg-slate-700 border-slate-600"}
        rounded-2xl border-2 shadow-xl overflow-hidden
        flex flex-col items-center justify-center p-8 text-center
        group
      `}
		>
			{!isFlipped ? (
				<div className={`text-3xl font-bold tracking-wide group-hover:scale-105 transition-transform duration-300 ${getLangStyles(card.language).text}`}>
					{card.front}
				</div>
			) : (
				<div className="flex flex-col items-center h-full justify-center space-y-1 animate-in fade-in zoom-in duration-300">
					<div className="px-4 py-1">
						<span className="text-cyan-400 font-mono text-lg font-bold">
							{card.pronunciation}
						</span>
					</div>
					<div className="text-slate-200 italic text-xl leading-tight font-light">
						{card.back}
					</div>
				</div>
			)}

			{flipCount > 0 && !isDimmed && (
				<div className="absolute top-3 left-3 flex items-center gap-1 bg-slate-900/40 px-2 py-0.5 rounded-md border border-slate-700/50">
					<span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter leading-none">Views:</span>
					<span className="text-[12px] text-cyan-500 font-black leading-none">{flipCount}</span>
				</div>
			)}

			<div className="absolute top-3 right-3 flex items-center gap-2">
				{!isDimmed && (
					<button
						onClick={(e) => {
							e.stopPropagation();
							onLearned();
						}}
						className="text-[10px] bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-emerald-950 font-bold px-3 py-1 rounded-lg border border-emerald-500/30 transition-all uppercase "
					>
						Mark as learned
					</button>
				)}
			</div>

			<div className="absolute bottom-3 left-3 flex items-center gap-2">
				{!isDimmed && (
					<div className={`text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-900/50 border uppercase tracking-widest ${getLangStyles(card.language).text} ${getLangStyles(card.language).border}`}>
						{card.language}
					</div>
				)}
			</div>

			<div className="absolute bottom-3 right-3 flex items-center gap-2">
				{!isDimmed && (
					<button
						onClick={handleOpenTranslate}
						className="p-1.5 bg-slate-900/50 hover:bg-cyan-500 text-slate-400 hover:text-slate-900 rounded-lg border border-slate-700 transition-all shadow-lg"
						title="Listen and translate"
					>
						<HiOutlineSpeakerWave className="text-sm" />
					</button>
				)}
				<button
					onClick={handleKeepLearning}
					className={`text-[10px] font-bold px-3 py-1 rounded-lg border transition-all uppercase ${isDimmed ? "bg-cyan-500 text-slate-950 border-cyan-400" : "bg-slate-900/50 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-white"}`}
				>
					{isDimmed ? "Restore" : "Learn Later"}
				</button>
			</div>

			{!isDimmed && (
				<div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
			)}
		</div>
	);
};



