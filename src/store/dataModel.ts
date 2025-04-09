import rawOutputItems from "../../parseddata/outputItems.json";
import { FrontendOutputItem, OutputItemSchema } from "../types";

export const getOutputItems = () => {
	const frontendOutputItems: FrontendOutputItem[] = [];
	for (const rawOutputItem of rawOutputItems) {
		const parseResult = OutputItemSchema.safeParse(rawOutputItem);
		if (parseResult.success) {
			const {
				suuid,
				language,
				date,
				title,
				htmlBody,
				audioFileName,
				kind,
				audioSeconds,
				estimatedAudioSeconds,
			} = parseResult.data;
			const frontendFlashcard: FrontendOutputItem = {
				suuid: suuid.trim(),
				language: language.trim(),
				date: date.trim(),
				title: title.trim(),
				htmlBody: htmlBody.trim(),
				isOpen: false,
				audioFileName: audioFileName.trim(),
				kind: kind.trim(),
				audioSeconds: audioSeconds,
				estimatedAudioSeconds: estimatedAudioSeconds,
			};
			frontendOutputItems.push(frontendFlashcard);
		} else {
			let r = "";
			r += `INVALID FLASHCARD IN IMPORT: ${JSON.stringify(
				rawOutputItem,
				null,
				2
			)}\n`;
			parseResult.error.errors.forEach((err) => {
				r += `Error in field "${err.path.join(".")}" - ${
					err.message
				}\n`;
			});
			console.error(r);
		}
	}
	return frontendOutputItems.sort((a, b) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});
};
