import { OutputArea } from "../components/OutputArea";

export const PageWelcome = () => {

	return (
		<div className="space-y-6">
			{/* Maintenance Note */}
			<div className="bg-amber-950 border-2 border-amber-600 rounded-2xl px-6 pt-2 pb-3 flex items-center gap-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-700 w-full md:w-[36rem]">
				<div className="bg-amber-600 w-16 h-16 shrink-0 flex items-center justify-center rounded-3xl shadow-inner">
					<span className="text-3xl drop-shadow-md leading-none">⚠️</span>
				</div>
				<div className="flex-1">
					<h3 className="text-amber-400 font-extrabold text-base uppercase tracking-widest mb-1">Maintenance Notice</h3>
					<p className="text-amber-100 font-medium leading-relaxed">
						The audio files are currently being moved to another server and will be available again soon.
					</p>
				</div>
			</div>
			<OutputArea />
		</div>
	);
};
