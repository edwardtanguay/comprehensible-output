import { useState, useEffect } from "react";
import phrasesRaw from "../../parseddata/compoutPhrases.json";
import { Phrase, PhraseProgressMap, PhraseStatus } from "../types";

const LOCAL_STORAGE_KEY = "flashcard_progress_v1";

export const PageFlashcards = () => {
	const [progressMap, setProgressMap] = useState<PhraseProgressMap>(() => {
		const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
		return saved ? JSON.parse(saved) : {};
	});

	useEffect(() => {
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progressMap));
	}, [progressMap]);

	const allPhrases = (phrasesRaw as Phrase[]).map((p, i) => ({
		...p,
		id: p.id || `${p.source_phrase}-${p.target_language}-${i}`, // Simple fallback ID
	}));

	const now = new Date();

	const visiblePhrases = allPhrases
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
			if (progress.status === "retake_1m") return diffMs >= 60 * 1000;
			if (progress.status === "retake_1h") return diffMs >= 60 * 60 * 1000;
			if (progress.status === "retake_1d") return diffMs >= 24 * 60 * 60 * 1000;

			// "toBeFixed": show if page loaded after 24 hours
			if (progress.status === "toBeFixed") {
				return diffMs >= 24 * 60 * 60 * 1000;
			}

			return true;
		})
		.sort((a, b) => (a.when_recorded > b.when_recorded ? -1 : 1))
		.slice(0, 10);

	const handleStatusChange = (phraseId: string, status: PhraseStatus) => {
		setProgressMap((prev) => ({
			...prev,
			[phraseId]: {
				status,
				lastActionDate: new Date().toISOString(),
			},
		}));
	};

	const learnedCount = Object.values(progressMap).filter(p => p.status === "learned").length;
	const parkedCount = Object.values(progressMap).filter(p => p.status === "parked").length;
	const deletedCount = Object.values(progressMap).filter(p => p.status === "deleted").length;
	const retakeCount = Object.values(progressMap).filter(p =>
		p.status === "retake_1m" || p.status === "retake_1h" || p.status === "retake_1d"
	).length;
	const toLearnCount = allPhrases.length - learnedCount - parkedCount - deletedCount;

	return (
		<div className="flex flex-col items-center gap-6 p-6">
			<div className="w-full max-w-5xl flex justify-between px-2 text-slate-700 text-xs font-bold uppercase tracking-widest">
				<div className="flex-1 text-left">{learnedCount} learned</div>
				<div className="flex-1 text-center">{toLearnCount} to learn</div>
				<div className="flex-1 text-right">retake {retakeCount}</div>
			</div>

			{visiblePhrases.length === 0 ? (
				<div className="text-slate-400 mt-20 text-xl font-medium">✨ All caught up! Come back later.</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 w-full max-w-5xl">
					{visiblePhrases.map((phrase) => (
						<Flashcard
							key={phrase.id}
							phrase={phrase}
							onStatusChange={(status) => handleStatusChange(phrase.id!, status)}
						/>
					))}
				</div>
			)}
		</div>
	);
};

const Flashcard = ({ phrase, onStatusChange }: { phrase: Phrase; onStatusChange: (status: PhraseStatus) => void }) => {
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
