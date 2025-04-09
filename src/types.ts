import { z } from "zod";

export const OutputItemSchema = z.object({
	suuid: z
		.string()
		.trim()
		.length(6, "suuid must be exactly 6 characters long")
		.regex(
			/^[A-Za-z0-9]+$/,
			"suuid can only contain uppercase/lowercase letters and numbers"
		)
		.min(1, "suuid cannot be empty"),
	language: z
		.string()
		.trim()
		.length(2, "Language must be exactly 2 characters long"),
	date: z
		.string()
		.trim()
		.regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in yyyy-mm-dd format"),
	title: z.string().trim().min(2, "Must be at least 2 characters long"),
	htmlBody: z.string().trim().min(10, "Must be at least 5 characters long"),
	audioFileName: z.string(),
	kind: z.string(),
	audioSeconds: z.number(),
	estimatedAudioSeconds: z.number(),
});

export const FrontendOutputItemSchema = OutputItemSchema.extend({
	isOpen: z.boolean(),
});

export type OutputItem = z.infer<typeof OutputItemSchema>;
export type FrontendOutputItem = z.infer<typeof FrontendOutputItemSchema>;
export type OutputDay = {
	date: string;
	frontendOutputItems: FrontendOutputItem[];
	totalSeconds: number;
	totalIncludesEstimates: boolean;
	status: "working" | "readyToRecord" | "finished";
};
export const blankOutputDay: OutputDay = {
	date: "",
	frontendOutputItems: [],
	totalSeconds: 0,
	totalIncludesEstimates: false,
	status: "working",
};
