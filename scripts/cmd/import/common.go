package main

import (
	"comprehensible-output/utils"
	"sort"
)

func getImportDirectory() string {
	return "../../../import"
}

type RawGoogleTranslateItems struct {
	Language1 string `json:"language1"`
	Language2 string `json:"language2"`
	Phrase1   string `json:"phrase1"`
	Phrase2   string `json:"phrase2"`
}

type Flashcard struct {
	Language string `json:"language"`
	Front    string `json:"front"`
	Back     string `json:"back"`
}

type LanguageStatsItem struct {
	Language     string
	UsedPhrases  int
	NewPhrases   int
	TotalPhrases int
}

func getLanguageList() []string {
	return []string{"de", "fr", "it", "es", "nl", "pl", "ru", "el", "pt", "is"}
}

func getLanguageIndex(language string) int {
	languages := getLanguageList()
	for i, lang := range languages {
		if lang == language {
			return i
		}
	}
	return -1
}

func createFlashcardItems(rawItems []RawGoogleTranslateItems) ([]Flashcard, error) {
	var flashcards []Flashcard
	for _, item := range rawItems {
		var flashcard Flashcard
		if item.Language1 != "English" {
			flashcard = Flashcard{
				Language: item.Language1,
				Front:    item.Phrase2,
				Back:     item.Phrase1,
			}
		} else {
			flashcard = Flashcard{
				Language: item.Language2,
				Front:    item.Phrase1,
				Back:     item.Phrase2,
			}
		}
		flashcards = append(flashcards, flashcard)
	}
	return flashcards, nil
}

func calculatePhraseStats() []LanguageStatsItem {
	stats := []LanguageStatsItem{
		{
			Language:     "de",
			UsedPhrases:  0,
			NewPhrases:   0,
			TotalPhrases: 0,
		},
		{
			Language:     "fr",
			UsedPhrases:  0,
			NewPhrases:   0,
			TotalPhrases: 0,
		},
		{
			Language:     "it",
			UsedPhrases:  0,
			NewPhrases:   0,
			TotalPhrases: 0,
		},
		{
			Language:     "es",
			UsedPhrases:  0,
			NewPhrases:   0,
			TotalPhrases: 0,
		},
		{
			Language:     "nl",
			UsedPhrases:  0,
			NewPhrases:   0,
			TotalPhrases: 0,
		},
		{
			Language:     "pl",
			UsedPhrases:  0,
			NewPhrases:   0,
			TotalPhrases: 0,
		},
		{
			Language:     "ru",
			UsedPhrases:  0,
			NewPhrases:   0,
			TotalPhrases: 0,
		},
		{
			Language:     "el",
			UsedPhrases:  0,
			NewPhrases:   0,
			TotalPhrases: 0,
		},
		{
			Language:     "pt",
			UsedPhrases:  0,
			NewPhrases:   0,
			TotalPhrases: 0,
		},
		{
			Language:     "is",
			UsedPhrases:  0,
			NewPhrases:   0,
			TotalPhrases: 0,
		},
	}
	existingPhrases := utils.GetCompoutPhrases()
	for _, phrase := range existingPhrases {
		language := phrase.TargetLanguage
		languageIndex := getLanguageIndex(language)
		if languageIndex != -1 {
			if phrase.WhenUsed == "" {
				stats[languageIndex].NewPhrases++
			} else {
				stats[languageIndex].UsedPhrases++
			}
			stats[languageIndex].TotalPhrases++
		}
	}
	// Sort stats by TotalPhrases descending
	sort.Slice(stats, func(i, j int) bool {
		return stats[i].NewPhrases > stats[j].NewPhrases
	})
	return stats
}

func getPhraseStatsLines() []string {
	stats := calculatePhraseStats()
	lines := []string{}
	lines = append(lines, "Create story creation prompts for any language with \"npm run cp <language>\", e.g. \"npm run cp fr\".")
	lines = append(lines, "Stories are created with 50 phrases by default, but you can specify any number above 50 for longer stories, e.g. \"npm run cp it 70\".")
	lines = append(lines, "New phrases are used for the stories first, after that, the rest are taken randomly from the used phrases.")
	lines = append(lines, "")
	for _, stat := range stats {
		extra := ""
		extra = " ---create-prompt-for-story---> \"npm run cp " + stat.Language + "\""
		lines = append(lines, stat.Language+" = "+utils.PadZerosLeft(stat.NewPhrases, 3)+" new of "+utils.PadZerosLeft(stat.TotalPhrases, 5)+extra)
	}
	return lines
}
