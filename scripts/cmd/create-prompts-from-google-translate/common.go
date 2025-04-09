package main

type RawGoogleTranslateItems struct {
	Language1 string `json:"language1"`
	Language2 string `json:"language2"`
	Phrase1   string `json:"phrase1"`
	Phrase2   string `json:"phrase2"`
}

type Flashcard struct {
	Language    string `json:"language"`
	Front       string `json:"front"`
	Back        string `json:"back"`
}

func getLanguageWord(code string) string {
	switch code {
	case "en":
		return "English"
	case "fr":
		return "French"
	case "es":
		return "Spanish"
	case "de":
		return "German"
	case "it":
		return "Italian"
	case "nl":
		return "Dutch"
	case "pl":
		return "Polish"
	default:
		return "Unknown"
	}
}
