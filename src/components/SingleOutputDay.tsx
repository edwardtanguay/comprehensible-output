import { OutputDay } from "../types";
import { SingleOutputItem } from "./SingleOutputItem";
import * as tools from "../tools";
import { FaMedal } from "react-icons/fa";
import { MdConstruction } from "react-icons/md";
import { FaMicrophone } from "react-icons/fa";

interface Props {
	outputDay: OutputDay;
}

export const SingleOutputDay = ({ outputDay }: Props) => {
	return (
		<div
			key={outputDay.date}
			className={`day-${outputDay.status} p-2 mb-4 rounded w-full md:w-[36rem]`}
		>
			<h2 className="flex justify-between items-center w-full md:w-[35rem]">
				<p>{outputDay.date}</p>
				{outputDay.status === "finished" && (
					<p>
						<FaMedal />
					</p>
				)}
				{outputDay.status === "working" && (
					<p>
						<MdConstruction />
					</p>
				)}
				{outputDay.status === "readyToRecord" && (
					<p>
						<FaMicrophone />
					</p>
				)}
				<p className="flex gap-1 items-center">
					{outputDay.totalIncludesEstimates ? "~" : ""}
					{tools.convertSecondsToTimeDisplay(outputDay.totalSeconds)}
				</p>
			</h2>
			{outputDay.frontendOutputItems.map((frontendOutputItem) => {
				return (
					<div key={frontendOutputItem.suuid}>
						<SingleOutputItem
							key={frontendOutputItem.suuid}
							outputItem={frontendOutputItem}
						/>
					</div>
				);
			})}
		</div>
	);
};
