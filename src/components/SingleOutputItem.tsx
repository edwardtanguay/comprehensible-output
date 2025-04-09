import { PiSpeakerHighFill } from "react-icons/pi";
import { FaMicrophone } from "react-icons/fa";
import { SlBookOpen } from "react-icons/sl";
import * as tools from "../tools";
import { FrontendOutputItem } from "../types";
import { useTypedStoreActions } from "../store/hooks";

interface Props {
	outputItem: FrontendOutputItem;
}

export const SingleOutputItem = ({ outputItem }: Props) => {
	const { toggleFrontendOutputItemThunk } = useTypedStoreActions(
		(actions) => actions.outputItemModel
	);

	return (
		<div className="mt-2 w-full md:w-[35rem]" key={outputItem.suuid}>
			<div
				className={`header-${outputItem.language} kind-${outputItem.kind} text-slate-200 p-2 rounded-t cursor-pointer flex justify-between items-center`}
				onClick={() => toggleFrontendOutputItemThunk(outputItem)}
			>
				{outputItem.kind === "reading" ? (
					<div className="flex gap-2 items-center">
						<SlBookOpen className="mt-1" /> {outputItem.title}
					</div>
				) : (
					<div>{outputItem.title}</div>
				)}
				<div className="flex gap-2 items-center">
					{outputItem.audioSeconds > 0 ? (
						<p className="text-gray-100 text-xs">
							{tools.convertSecondsToTimeDisplay(
								outputItem.audioSeconds
							)}
						</p>
					) : (
						<p className="text-gray-400 italic text-xs">
							~
							{tools.convertSecondsToTimeDisplay(
								outputItem.estimatedAudioSeconds
							)}
						</p>
					)}
					{outputItem.audioFileName !== "" ? (
						<button
							className="bg-slate-800 hover:bg-slate-900 text-slate-200 px-2 py-1 rounded border-gray-600 border"
							onClick={(e) => {
								e.stopPropagation();
								window.open(
									`audio/${outputItem.audioFileName}`,
									"_blank"
								);
							}}
						>
							<PiSpeakerHighFill />
						</button>
					) : (
						<FaMicrophone className="mr-2 mt-1 text-gray-400" />
					)}
				</div>
			</div>
			{outputItem.isOpen && (
				<div
					className={`bg-slate-300 p-2 rounded-b htmlBody bodykind-${outputItem.kind}`}
					dangerouslySetInnerHTML={{ __html: outputItem.htmlBody }}
				/>
			)}
		</div>
	);
};
