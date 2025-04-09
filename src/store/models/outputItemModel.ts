import { action, Action, thunk, Thunk } from "easy-peasy";
import {
	blankOutputDay,
	FrontendOutputItem as FrontendOutputItem,
	OutputDay,
} from "../../types";
import * as dataModel from "../dataModel";
import { StoreModel } from "../store";
import { unproxyItem } from "../../tools";
import * as config from "../../config";

export interface OutputItemModel {
	// state
	numberOfAnswersShown: number;
	frontendOutputItems: FrontendOutputItem[]; // TODO: change to OutputItem[]
	outputDays: OutputDay[];

	// actions
	incrementAnswersShown: Action<this>;
	setFrontendOutputItems: Action<this, FrontendOutputItem[]>;
	saveFrontendOutputItem: Action<this, FrontendOutputItem>; // TODO: change to set
	createOutputDays: Action<this>;

	// thunks
	loadOutputItemsThunk: Thunk<this>;
	toggleFrontendOutputItemThunk: Thunk<
		this,
		FrontendOutputItem,
		void,
		StoreModel
	>;
}

export const outputItemModel: OutputItemModel = {
	// state
	frontendOutputItems: [],
	numberOfAnswersShown: 0,
	outputDays: [],

	// actions
	incrementAnswersShown: action((state) => {
		state.numberOfAnswersShown++;
	}),
	setFrontendOutputItems: action((state, outputItems) => {
		state.frontendOutputItems = structuredClone(outputItems);
	}),
	saveFrontendOutputItem: action((state, frontendOutputItem) => {
		const index = state.frontendOutputItems.findIndex(
			(s) => s.suuid === frontendOutputItem.suuid
		);
		if (index !== -1) {
			state.frontendOutputItems[index] =
				structuredClone(frontendOutputItem);
		}
	}),
	createOutputDays: action((state) => {
		const tempFrontendOutputItems = structuredClone(
			unproxyItem(state.frontendOutputItems)
		);
		tempFrontendOutputItems.push(blankOutputDay); // hack: code below ignores the last item
		let holdDate = tempFrontendOutputItems[0]?.date;
		let holdOutputDay: OutputDay = structuredClone(blankOutputDay);
		holdOutputDay.date = holdDate;
		let index = -1;
		for (const proxyItem of tempFrontendOutputItems) {
			index++;
			const item = JSON.parse(JSON.stringify(proxyItem));
			if (
				holdDate !== item.date ||
				index === tempFrontendOutputItems.length - 1
			) {
				state.outputDays.push(structuredClone(holdOutputDay));
				holdOutputDay = structuredClone(blankOutputDay);
				holdOutputDay.date = item.date;
				holdOutputDay.frontendOutputItems.push(item);
				holdDate = item.date;
			} else {
				holdOutputDay.frontendOutputItems.push(item);
			}
		}
		// calculate total seconds
		for (const outputDay of state.outputDays) {
			let totalSeconds = 0;
			for (const frontendOutputItem of outputDay.frontendOutputItems) {
				totalSeconds += frontendOutputItem.audioSeconds;
				totalSeconds += frontendOutputItem.estimatedAudioSeconds;
				if (frontendOutputItem.estimatedAudioSeconds > 0) {
					outputDay.totalIncludesEstimates = true;
				}
			}
			if (totalSeconds < config.numberOfSecondsPerDayGoal()) {
				outputDay.status = "working";
			} else if (totalSeconds >= config.numberOfSecondsPerDayGoal()) {
				if (!outputDay.totalIncludesEstimates) {
					outputDay.status = "finished";
				} else {
					outputDay.status = "readyToRecord";
				}
			}
			outputDay.totalSeconds = totalSeconds;

			// add empty days for each day that is missing between today and the last day in the array
			if (state.outputDays.length > 0) {
				const today = new Date();
				today.setHours(0, 0, 0, 0);
				const lastDay = new Date(
					state.outputDays[state.outputDays.length - 1].date
				);
				lastDay.setHours(0, 0, 0, 0);

				const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day
				const daysMissing =
					Math.round(
						Math.abs((today.getTime() - lastDay.getTime()) / oneDay)
					) + 1;

				for (let i = 1; i <= daysMissing; i++) {
					const missingDate = new Date(lastDay);
					missingDate.setDate(lastDay.getDate() + i);

					const dateStr = missingDate.toISOString().split("T")[0];
					const dateExists = state.outputDays.some(
						(day) => day.date === dateStr
					);
					if (!dateExists) {
						const blankDay: OutputDay =
							structuredClone(blankOutputDay);
						blankDay.date = dateStr;
						blankDay.status = "working";
						blankDay.totalSeconds = 0;
						blankDay.totalIncludesEstimates = false;

						state.outputDays.push(blankDay);
					}
				}
			}

			// sort outputDays by date descending
			state.outputDays.sort((a, b) => {
				return new Date(b.date).getTime() - new Date(a.date).getTime();
			});
		}
	}),

	// thunks
	loadOutputItemsThunk: thunk((actions) => {
		(async () => {
			const _frontendOutputItems = dataModel.getOutputItems();
			actions.setFrontendOutputItems(_frontendOutputItems);
			actions.createOutputDays();
		})();
	}),
	toggleFrontendOutputItemThunk: thunk(
		(actions, frontendOutputItem, helpers) => {
			frontendOutputItem.isOpen = !frontendOutputItem.isOpen;
			if (frontendOutputItem.isOpen) {
				actions.incrementAnswersShown();
				helpers
					.getStoreActions()
					.mainModel.setMessage(
						`Number of times an answer was shown: ${
							helpers.getState().numberOfAnswersShown
						}`
					);
			}
			actions.saveFrontendOutputItem(frontendOutputItem);
		}
	),
};
