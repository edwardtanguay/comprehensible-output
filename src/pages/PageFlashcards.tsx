import { useState, useEffect, useMemo } from "react";
import phrasesRaw from "../../parseddata/compoutPhrases.json";
import { Phrase, PhraseProgressMap, PhraseStatus } from "../types";
import { HiVolumeUp } from "react-icons/hi";
import { useSearchParams } from "react-router-dom";

const LOCAL_STORAGE_KEY = "flashcard_progress_v1";

const allPhrases = (phrasesRaw as Phrase[]).map((p, i) => ({
	...p,
	id: p.id || `${p.source_phrase}-${p.target_language}-${i}`, // Simple fallback ID
}));

const languageNames: Record<string, string> = {
	it: "Italian",
	de: "German",
	nl: "Dutch",
	es: "Spanish",
	fr: "French",
	en: "English",
	pl: "Polish",
};

export const PageFlashcards = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const [progressMap, setProgressMap] = useState<PhraseProgressMap>(() => {
		const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
		return saved ? JSON.parse(saved) : {};
	});

	const [selectedLanguage, setSelectedLanguage] = useState<string>(() => searchParams.get("lang") || "all");
	const [sortOrder, setSortOrder] = useState<"newest" | "random">(() => (searchParams.get("sort") as "newest" | "random") || "newest");
	const [showRetakes, setShowRetakes] = useState<boolean>(() => searchParams.get("retakes") !== "false");
	const [randomSeed] = useState(() => Math.random().toString());

	useEffect(() => {
		const newParams = new URLSearchParams(searchParams);
		newParams.set("lang", selectedLanguage);
		newParams.set("sort", sortOrder);
		newParams.set("retakes", showRetakes.toString());
		setSearchParams(newParams, { replace: true });
	}, [selectedLanguage, sortOrder, showRetakes, setSearchParams]);

	useEffect(() => {
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progressMap));
	}, [progressMap]);

	const languageCounts = useMemo(() => {
		return allPhrases.reduce((acc, p) => {
			acc[p.target_language] = (acc[p.target_language] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);
	}, []);

	const languages = useMemo(() => {
		return Object.keys(languageCounts).sort((a, b) => languageCounts[b] - languageCounts[a]);
	}, [languageCounts]);

	const filteredByLanguage = useMemo(() => {
		return selectedLanguage === "all"
			? allPhrases
			: allPhrases.filter(p => p.target_language === selectedLanguage);
	}, [selectedLanguage]);

	const visiblePhrases = useMemo(() => {
		const now = new Date();
		return filteredByLanguage
			.filter((phrase) => {
				const progress = progressMap[phrase.id!];
				if (!progress) return true;

				const lastAction = new Date(progress.lastActionDate);
				const diffMs = now.getTime() - lastAction.getTime();

				// "deleted": never show
				if (progress.status === "deleted") return false;

				// "learned" & "parked": never test again (remove from training stack)
				if (progress.status === "learned" || progress.status === "parked") return false;

				// "retake": show if page loaded after specified duration
				const isRetake = progress.status?.startsWith("retake_");
				if (isRetake && !showRetakes) return false;

				if (progress.status === "retake_1m") return diffMs >= 60 * 1000;
				if (progress.status === "retake_1h") return diffMs >= 60 * 60 * 1000;
				if (progress.status === "retake_1d") return diffMs >= 24 * 60 * 60 * 1000;

				// "toBeFixed": show if page loaded after 24 hours
				if (progress.status === "toBeFixed") {
					return diffMs >= 24 * 60 * 60 * 1000;
				}

				return true;
			})
			.sort((a, b) => {
				const progressA = progressMap[a.id!];
				const progressB = progressMap[b.id!];
				const isRetakeA = progressA?.status?.startsWith("retake_") ? 1 : 0;
				const isRetakeB = progressB?.status?.startsWith("retake_") ? 1 : 0;

				// Priority 1: Retakes first
				if (isRetakeA !== isRetakeB) {
					return isRetakeB - isRetakeA;
				}

				// Priority 2: Chosen sort order
				if (sortOrder === "newest") {
					return a.when_recorded > b.when_recorded ? -1 : 1;
				} else {
					// Deterministic random based on ID + session seed
					const hash = (str: string) => {
						const salted = str + randomSeed;
						let h = 0;
						for (let i = 0; i < salted.length; i++) h = (Math.imul(31, h) + salted.charCodeAt(i)) | 0;
						return h;
					};
					return hash(a.id!) - hash(b.id!);
				}
			})
			.slice(0, 10);
	}, [filteredByLanguage, progressMap, sortOrder, showRetakes, randomSeed]);

	const handleStatusChange = (phraseId: string, status: PhraseStatus) => {
		setProgressMap((prev) => ({
			...prev,
			[phraseId]: {
				status,
				lastActionDate: new Date().toISOString(),
			},
		}));
	};

	// Optimize counts by iterating over allPhrases once and checking progressMap
	const { learnedCount, parkedCount, deletedCount, retakeCount } = useMemo(() => {
		let learned = 0, parked = 0, deleted = 0, retake = 0;
		allPhrases.forEach(phrase => {
			if (selectedLanguage !== "all" && phrase.target_language !== selectedLanguage) return;
			const p = progressMap[phrase.id!];
			if (!p) return;
			if (p.status === "learned") learned++;
			else if (p.status === "parked") parked++;
			else if (p.status === "deleted") deleted++;
			else if (p.status?.startsWith("retake_")) retake++;
		});
		return { learnedCount: learned, parkedCount: parked, deletedCount: deleted, retakeCount: retake };
	}, [progressMap, selectedLanguage]);

	const toLearnCount = filteredByLanguage.length - learnedCount - parkedCount - deletedCount - retakeCount;

	return (
		<div className="flex flex-col items-center gap-6 p-6">
			<div className="w-full max-w-5xl">
				<div className="flex gap-4 mb-4">
					<select
						value={selectedLanguage}
						onChange={(e) => setSelectedLanguage(e.target.value)}
						className="flex-1 p-2.5 bg-slate-900 text-slate-200 border border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium shadow-lg cursor-pointer appearance-none"
						style={{
							backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
							backgroundRepeat: 'no-repeat',
							backgroundPosition: 'right 0.75rem center',
							backgroundSize: '1rem'
						}}
					>
						<option value="all">all languages ({allPhrases.length})</option>
						{languages.map(lang => (
							<option key={lang} value={lang}>
								{(languageNames[lang] || lang)} ({languageCounts[lang]})
							</option>
						))}
					</select>

					<select
						value={sortOrder}
						onChange={(e) => setSortOrder(e.target.value as "newest" | "random")}
						className="flex-1 p-2.5 bg-slate-900 text-slate-200 border border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium shadow-lg cursor-pointer appearance-none"
						style={{
							backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
							backgroundRepeat: 'no-repeat',
							backgroundPosition: 'right 0.75rem center',
							backgroundSize: '1rem'
						}}
					>
						<option value="newest">newest first</option>
						<option value="random">random</option>
					</select>
				</div>

				<div className="flex justify-between items-center px-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
					<div className="flex-1 text-left">{learnedCount} learned</div>
					<div className="flex-1 text-center">{toLearnCount} waiting</div>
					<div className="flex-1 text-right flex items-center justify-end gap-2 text-xs">
						<label className="flex items-center gap-2 cursor-pointer group">
							<div className="relative inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									checked={showRetakes}
									onChange={(e) => setShowRetakes(e.target.checked)}
									className="sr-only peer"
								/>
								<div className="w-7 h-4 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-slate-800 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-yellow-400"></div>
							</div>
							<span className="opacity-70 group-hover:opacity-100 transition-opacity text-yellow-400/90 font-bold">retaking</span>
						</label>
						<span className="w-4 text-right text-yellow-400/80 font-mono">{retakeCount}</span>
					</div>
				</div>
			</div>

			{visiblePhrases.length === 0 ? (
				<div className="text-slate-400 mt-20 text-xl font-medium">✨ All caught up! Come back later.</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 w-full max-w-5xl">
					{visiblePhrases.map((phrase) => (
						<Flashcard
							key={phrase.id}
							phrase={phrase}
							isRetake={progressMap[phrase.id!]?.status?.startsWith("retake_")}
							onStatusChange={(status) => handleStatusChange(phrase.id!, status)}
						/>
					))}
				</div>
			)}
		</div>
	);
};

const Flashcard = ({ phrase, isRetake, onStatusChange }: { phrase: Phrase; isRetake?: boolean; onStatusChange: (status: PhraseStatus) => void }) => {
	const [isFlipped, setIsFlipped] = useState(false);
	const langClass = `flashcard-${phrase.target_language}`;

	return (
		<div className="group perspective-1000 h-48 rounded-xl flex flex-col">
			<div
				className="relative h-full cursor-pointer transform-style-3d transition-all duration-500"
				onClick={() => setIsFlipped(!isFlipped)}
				style={{ transform: isFlipped ? "rotateY(180deg)" : "none" }}
			>
				{/* Front */}
				<div className={`absolute inset-0 ${langClass} border border-slate-700/30 rounded-xl p-6 flex flex-col justify-center items-center shadow-xl backface-hidden transition-all`}>
					{isRetake && (
						<div className="absolute bottom-3 left-3 pl-2 border-l-2 border-yellow-400 text-yellow-400 text-[11px] italic font-medium tracking-wide drop-shadow-sm">
							retaking
						</div>
					)}
					<h2 className="text-xl font-medium text-slate-200 text-center px-4 leading-relaxed">
						{phrase.source_phrase}
					</h2>
				</div>

				{/* Back */}
				<div className={`absolute inset-0 ${langClass}-back border border-black/5 rounded-xl p-3 flex flex-col justify-between items-center shadow-2xl backface-hidden rotate-y-180`}>
					{/* Row 1: delete, park, fix, learned */}
					<div className="flex flex-wrap gap-1.5 justify-center">
						<ActionButton label="delete" color="bg-red-700/90" onClick={() => onStatusChange("deleted")} />
						<ActionButton label="park" color="bg-blue-600/90" onClick={() => onStatusChange("parked")} />
						<ActionButton label="fix" color="bg-yellow-600/90" onClick={() => onStatusChange("toBeFixed")} />
						<ActionButton label="learned" color="bg-green-600/90" onClick={() => onStatusChange("learned")} />
					</div>

					<h2 className="text-2xl font-bold text-center px-4 leading-tight drop-shadow-md pb-2">
						{phrase.target_phrase}
					</h2>

					{/* Row 2: retake 1 day, retake 1 hour, retake 1 minute */}
					<div className="flex flex-wrap gap-1.5 justify-center">
						<ActionButton label="retake 1d" color="bg-orange-600/90" onClick={() => onStatusChange("retake_1d")} />
						<ActionButton label="retake 1h" color="bg-orange-500/90" onClick={() => onStatusChange("retake_1h")} />
						<ActionButton label="retake 1m" color="bg-orange-400/90" onClick={() => onStatusChange("retake_1m")} />
					</div>

					{/* Audio/Speaker Button */}
					<button
						onClick={(e) => {
							e.stopPropagation();
							const url = `https://translate.google.com/?sl=auto&tl=${phrase.target_language}&text=${encodeURIComponent(phrase.target_phrase)}&op=translate`;
							window.open(url, "_blank");
						}}
						className="absolute bottom-2 right-2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all hover:scale-110 active:scale-90"
						title="Listen on Google Translate"
					>
						<HiVolumeUp size={18} />
					</button>
				</div>
			</div>

		</div>
	);
};

const ActionButton = ({ label, color, onClick }: { label: string; color: string; onClick: () => void }) => (
	<button
		onClick={(e) => {
			e.stopPropagation();
			onClick();
		}}
		className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-md hover:brightness-110 active:scale-95 transition-all uppercase tracking-tighter ${color}`}
	>
		{label}
	</button>
);
