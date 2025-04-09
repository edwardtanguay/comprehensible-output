import { useTypedStoreState } from "../store/hooks";
import { SingleOutputDay } from "./SingleOutputDay";
// import { SingleOutputItem } from "./SingleOutputItem";

export const OutputArea = () => {
	const { outputDays } = useTypedStoreState((state) => state.outputItemModel);

	return (
		<div>
			{outputDays.map((outputDay) => (
				<SingleOutputDay key={outputDay.date} outputDay={outputDay} />
			))}
		</div>
	);
};
