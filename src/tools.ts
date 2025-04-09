/**
 * Removes text from the end of a string.
 *
 * qstr.chopRight('book-001', '-001');
 *
 * 'book'
 */
export const chopRight = (main: string, textToChop: string) => {
	if (main.endsWith(textToChop)) {
		const len = textToChop.length;
		const mainLen = main.length;
		if (len <= mainLen) {
			return main.substring(0, mainLen - len);
		}
	}
	return main;
};

export const chopLeft = (main: string, textToChop: string) => {
	if (main.startsWith(textToChop)) {
		const len = textToChop.length;
		const mainLen = main.length;
		if (len <= mainLen) {
			return main.substring(len, mainLen);
		}
	}
	return main;
};

export const convertSecondsToTimeDisplay = (seconds: number): string => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;

	const secondsStr = remainingSeconds.toString().padStart(2, "0");

	//   return minutes > 0 ? `${minutes}:${secondsStr}` : `:${secondsStr}`;
	return `${minutes}:${secondsStr}`;
};

export const unproxyItem = (proxyItem: unknown) => {
	return JSON.parse(JSON.stringify(proxyItem));
}
