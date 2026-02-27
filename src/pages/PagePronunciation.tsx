import { useState, useEffect } from "react";
import { HiOutlineSpeakerWave, HiCheck, HiCheckCircle } from "react-icons/hi2";
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
	const [laterIds, setLaterIds] = useState<string[]>([]);
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

	const handleMarkAsLater = (language: string, front: string) => {
		const id = `${language}:${front}`;
		setLaterIds([...laterIds, id]);
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
		c => !learnedIds.includes(`${c.language}:${c.front}`) &&
			!laterIds.includes(`${c.language}:${c.front}`)
	);

	const learnedCount = cardsInLanguage.filter(
		c => learnedIds.includes(`${c.language}:${c.front}`)
	).length;

	return (
		<div className="space-y-6">
			<div className="flex flex-col md:flex-row gap-4 items-center justify-between p-6 bg-slate-800/40 rounded-3xl border border-slate-700/50 backdrop-blur-md shadow-2xl">
				<div className="text-center md:text-left">
					<h1 className="text-4xl font-black text-white tracking-tighter italic">
						PRONUNCIATION <span className="text-cyan-500">MASTER</span>
					</h1>
					<div className="flex items-center justify-center md:justify-start gap-4 mt-2">
						<div className="flex flex-col items-center bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-700/50 shadow-inner min-w-[70px]">
							<div className="h-7 flex items-center">
								<span className="text-2xl font-black text-cyan-400 leading-none">{learnedCount}</span>
							</div>
							<div className="flex items-center gap-1 mt-1">
								<HiCheck className="text-[10px] text-slate-500" />
								<span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">learned</span>
							</div>
						</div>

						<div className="flex gap-4 bg-slate-900/40 px-4 py-2 rounded-xl border border-slate-700/30">
							<div className="flex flex-col items-center min-w-[50px]">
								<div className="h-7 flex items-center">
									<span className="text-xl font-bold text-slate-200 leading-none">
										{cardsInLanguage.filter(c => !learnedIds.includes(`${c.language}:${c.front}`)).length}
									</span>
								</div>
								<span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-1">to learn</span>
							</div>
							<div className="h-8 w-px bg-slate-700/50 self-center" />
							<div className="flex flex-col items-center min-w-[50px]">
								<div className="h-7 flex items-center">
									<span className="text-lg font-black text-slate-900 bg-slate-400 px-1.5 rounded-md leading-none">
										{filteredCards.length}
									</span>
								</div>
								<span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-1">session</span>
							</div>
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
						onLearnLater={() => handleMarkAsLater(card.language, card.front)}
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
	onLearnLater: () => void;
	onFlip: () => void;
}

const Flashcard = ({ card, flipCount, onLearned, onLearnLater, onFlip }: FlashcardProps) => {
	const [isFlipped, setIsFlipped] = useState(false);
	const [isExiting, setIsExiting] = useState(false);
	const [isLearnedAction, setIsLearnedAction] = useState(false);

	const handleFlip = () => {
		if (isExiting) return;
		if (!isFlipped) {
			onFlip();
		}
		setIsFlipped(!isFlipped);
	};

	const handleOpenTranslate = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (isExiting) return;
		const url = `https://translate.google.com/?sl=${card.language}&tl=en&text=${encodeURIComponent(card.front)}&op=translate`;
		window.open(url, "_blank");
	};

	const handleAction = (e: React.MouseEvent, action: () => void, isLearned: boolean = false) => {
		e.stopPropagation();
		if (isExiting) return;
		setIsExiting(true);
		if (isLearned) setIsLearnedAction(true);
		setTimeout(() => {
			action();
		}, 1000);
	};

	return (
		<div
			onClick={handleFlip}
			className={`
        relative h-52 w-full transition-all duration-1000 transform
        ${isExiting ? "opacity-10 scale-95 grayscale pointer-events-none translate-y-4" : "cursor-pointer hover:-translate-y-2 hover:shadow-cyan-500/20 hover:border-cyan-500/30"}
        ${isFlipped ? "bg-slate-800 border-cyan-500/50" : "bg-slate-700/80 hover:bg-slate-700 border-slate-600"}
        rounded-2xl border-2 shadow-xl overflow-hidden
        flex flex-col items-center justify-center p-8 text-center
        group
      `}
		>
			{!isFlipped ? (
				<div className={`text-3xl font-bold tracking-wide group-hover:scale-105 transition-transform duration-300 ${getLangStyles(card.language).text} ${isLearnedAction ? "opacity-0" : ""}`}>
					{card.front}
				</div>
			) : (
				<div className={`flex flex-col items-center h-full justify-center space-y-1 animate-in fade-in zoom-in duration-300 ${isLearnedAction ? "opacity-0" : ""}`}>
					<div className="px-4 py-1">
						<span className={`font-mono text-lg font-bold ${getLangStyles(card.language).text}`}>
							{card.pronunciation}
						</span>
					</div>
					<div className="text-slate-200 italic text-xl leading-tight font-light">
						{card.back}
					</div>
				</div>
			)}

			<div className={`absolute top-3 left-3 flex items-center gap-1 bg-slate-900/40 px-2 py-0.5 rounded-md border border-slate-700/50 transition-opacity duration-300 ${isExiting ? "opacity-0" : ""}`}>
				<span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter leading-none">Views:</span>
				<span className={`text-[12px] font-black leading-none ${getLangStyles(card.language).text} ${flipCount === 0 ? "opacity-30" : "opacity-100"}`}>
					{flipCount}
				</span>
			</div>

			<div className={`absolute top-3 right-3 flex items-center gap-2 transition-opacity duration-300 ${isExiting ? "opacity-0" : ""}`}>
				<button
					onClick={(e) => handleAction(e, onLearned, true)}
					className="text-[10px] bg-slate-900/50 text-slate-400 hover:text-white font-bold px-3 py-1 rounded-lg border border-slate-700 hover:bg-slate-800 transition-all uppercase flex items-center gap-1"
				>
					<HiCheck className="text-slate-500" />
					Mark as learned
				</button>
			</div>

			{isLearnedAction && (
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
					<HiCheckCircle className="text-slate-500/80 text-[180px] animate-in zoom-in-75 fade-in duration-1000 fill-mode-forwards opacity-0" />
				</div>
			)}

			<div className={`absolute bottom-3 left-3 flex items-center gap-2 transition-opacity duration-300 ${isExiting ? "opacity-0" : ""}`}>
				<div className={`text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-900/50 border uppercase tracking-widest ${getLangStyles(card.language).text} ${getLangStyles(card.language).border}`}>
					{card.language}
				</div>
			</div>

			<div className={`absolute bottom-3 right-3 flex items-center gap-2 transition-opacity duration-300 ${isExiting ? "opacity-0" : ""}`}>
				<button
					onClick={handleOpenTranslate}
					className="p-1.5 bg-slate-900/50 hover:bg-cyan-500 text-slate-400 hover:text-slate-900 rounded-lg border border-slate-700 transition-all shadow-lg"
					title="Listen and translate"
				>
					<HiOutlineSpeakerWave className="text-sm" />
				</button>
				<button
					onClick={(e) => handleAction(e, onLearnLater)}
					className="text-[10px] font-bold px-3 py-1 rounded-lg border transition-all uppercase bg-slate-900/50 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-white"
				>
					Learn Later
				</button>
			</div>

			<div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
		</div>
	);
};



