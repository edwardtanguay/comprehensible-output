package main

import (
	"comprehensible-output/utils"
	"fmt"
	"math/rand"
	"sort"
	"strings"
	"time"
)

func main() {

	filenames := utils.GetFileNamesFromDirectoryThatContainText(getRelativeGoogleTranslateDataDirectory(), "googtran-")

	statsLine002Items := []StatsLineItem{}

	flashcardsByLanguage := map[string][]Flashcard{
		"German":    {},
		"French":    {},
		"Spanish":   {},
		"Italian":   {},
		"Dutch":     {},
		"Polish":    {},
		"Russian":   {},
		"Greek":     {},
		"Icelandic": {},
	}

	var languages []string
	for lang := range flashcardsByLanguage {
		languages = append(languages, lang)
	}

	for index, filename := range filenames {
		pathAndFileName := fmt.Sprintf("../../../data/google-translate-phrases/%s", filename)

		for _, language := range languages {

			var rawGoogleTranslateItems []RawGoogleTranslateItems
			rawGoogleTranslateItemsForLanguage, err := createRawGoogleTranslateItems(pathAndFileName, language)
			if err != nil {
				fmt.Println("Error:", err)
				return
			}
			rawGoogleTranslateItems = append(rawGoogleTranslateItems, rawGoogleTranslateItemsForLanguage...)

			flashcards, err := createFlashcardItems(rawGoogleTranslateItems, language)
			if err != nil {
				fmt.Println("Error:", err)
				return
			}

			// randomize
			rand.Seed(time.Now().UnixNano())
			rand.Shuffle(len(flashcards), func(i, j int) {
				flashcards[i], flashcards[j] = flashcards[j], flashcards[i]
			})

			if language != "English" {
				flashcardsByLanguage[language] = append(flashcardsByLanguage[language], flashcards...)
				if index == len(filenames)-1 {
					if len(flashcards) != 0 {
						statsLine002Items = append(statsLine002Items, StatsLineItem{
							Language:        language,
							NumberOfPhrases: len(flashcards),
						})
					}
				}
			}

		}
	}

	// get English phrases (not possible in googtran, so we get from phrases-en.txt)
	phrasePathAndFileName := "../../../data/phrases/phrases-en.txt"
	var englishFlashcards = []Flashcard{}
	if utils.FileExists(phrasePathAndFileName) {
		phraseLines := utils.GetLinesFromFile(phrasePathAndFileName)
		for _, phraseLine := range phraseLines {
			parts := strings.Split(phraseLine, ";")
			flashcard := Flashcard{
				Language: "English",
				Front:    parts[1],
				Back:     parts[0],
			}
			englishFlashcards = append(englishFlashcards, flashcard)
		}
	}
	flashcardsByLanguage["English"] = append(flashcardsByLanguage["English"], englishFlashcards...)

	// add exceptions
	languages = append(languages, "English")
	statsLine001Items := []StatsLineItem{}

	for _, language := range languages {

		// stats
		statsLine001Items = append(statsLine001Items, StatsLineItem{
			Language:        language,
			NumberOfPhrases: len(flashcardsByLanguage[language]),
		})

		// create prompt files
		numberOfPhrases := 50
		numberOfWords := 550
		createPromptTexts(flashcardsByLanguage[language], numberOfPhrases, numberOfWords, language)
	}
	sort.Slice(statsLine001Items, func(i, j int) bool {
		return statsLine001Items[i].NumberOfPhrases > statsLine001Items[j].NumberOfPhrases
	})
	sort.Slice(statsLine002Items, func(i, j int) bool {
		return statsLine002Items[i].NumberOfPhrases > statsLine002Items[j].NumberOfPhrases
	})

	var parts []string

	// message
	fmt.Println("All prompt files created, number of phrases:")
	fmt.Println("------------------------------------------------------")

	// stat line 001
	parts = []string{}
	for _, item := range statsLine001Items {
		if item.NumberOfPhrases == 0 {
			parts = append(parts, fmt.Sprintf("%s", getLanguageCode(item.Language)))
		} else {
			parts = append(parts, fmt.Sprintf("%s(%d)", getLanguageCode(item.Language), item.NumberOfPhrases))
		}
	}
	fmt.Printf("TOTAL: %s", strings.Join(parts, ", "))
	fmt.Println()

	// stat line 002
	parts = []string{}
	for _, item := range statsLine002Items {
		if item.NumberOfPhrases == 0 {
			parts = append(parts, fmt.Sprintf("%s", getLanguageCode(item.Language)))
		} else {
			parts = append(parts, fmt.Sprintf("%s(%d)", getLanguageCode(item.Language), item.NumberOfPhrases))
		}
	}
	fmt.Printf("LAST FILE: %s", strings.Join(parts, ", "))

}
