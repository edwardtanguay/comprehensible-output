package main

import (
	"comprehensible-output/utils"
	"fmt"
	"math/rand"
	"os"
	"sort"
	"strings"
	"time"
)

func Reverse[T any](s []T) {
	for i, j := 0, len(s)-1; i < j; i, j = i+1, j-1 {
		s[i], s[j] = s[j], s[i]
	}
}

func Randomize[T any](input []T) []T {
	rand.Seed(time.Now().UnixNano())

	type weighted struct {
		value  T
		weight float64
	}

	decorated := make([]weighted, len(input))
	for i, val := range input {
		decorated[i] = weighted{value: val, weight: rand.Float64()}
	}

	sort.Slice(decorated, func(i, j int) bool {
		return decorated[i].weight < decorated[j].weight
	})

	shuffled := make([]T, len(input))
	for i, w := range decorated {
		shuffled[i] = w.value
	}

	return shuffled
}

func main() {

	rand.Seed(time.Now().UnixNano())

	mode := "normal"
	if len(os.Args) == 2 {
		mode = os.Args[1]
	}

	fmt.Println("USAGE: npm run cfg = (normal) create prompt files with last 50 phrases")
	fmt.Println("USAGE: npm run cfg random = create prompt files with 50 random phrases")
	fmt.Printf("mode is %s\n", mode)

	filenames := utils.GetFileNamesFromDirectoryThatContainText(getRelativeGoogleTranslateDataDirectory(), "googtran-")

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

	for _, filename := range filenames {
		pathAndFileName := fmt.Sprintf("../../../data/google-translate-phrases/%s", filename)

		statsLine002Items := []StatsLineItem{}

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

			if language != "English" {
				flashcardsByLanguage[language] = append(flashcardsByLanguage[language], flashcards...)
				if len(flashcards) != 0 {
					statsLine002Items = append(statsLine002Items, StatsLineItem{
						Language:        language,
						NumberOfPhrases: len(flashcards),
					})
				}
			}

		}
		sort.Slice(statsLine002Items, func(i, j int) bool {
			return statsLine002Items[i].NumberOfPhrases > statsLine002Items[j].NumberOfPhrases
		})
		// stat line 002
		parts := []string{}
		for _, item := range statsLine002Items {
			if item.NumberOfPhrases == 0 {
				parts = append(parts, fmt.Sprintf("%s", getLanguageCode(item.Language)))
			} else {
				parts = append(parts, fmt.Sprintf("%s(%d)", getLanguageCode(item.Language), item.NumberOfPhrases))
			}
		}
		fmt.Printf("%s = %s\n", filename, strings.Join(parts, ", "))
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
		// fmt.Println("number of flashcards: ", len(flashcardsByLanguage[language]))
		if mode == "random" {
			flashcardsByLanguage[language] = Randomize(flashcardsByLanguage[language])
		}
		createPromptTexts(flashcardsByLanguage[language], numberOfPhrases, numberOfWords, language)
	}
	sort.Slice(statsLine001Items, func(i, j int) bool {
		return statsLine001Items[i].NumberOfPhrases > statsLine001Items[j].NumberOfPhrases
	})

	var parts []string

	// message
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

}
