import { createStore } from "easy-peasy";
import { mainModel, MainModel } from "./models/mainModel";
import { outputItemModel, OutputItemModel } from "./models/outputItemModel";

export type StoreModel = {
	mainModel: MainModel;
	outputItemModel: OutputItemModel;
};

export const store = createStore<StoreModel>({
	mainModel,
	outputItemModel,
});
