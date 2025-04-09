package main

import (
	"comprehensible-output/utils"
	"fmt"
	"strings"
)

func createFlashcardItems(rawItems []RawGoogleTranslateItems, languageName string) ([]Flashcard, error) {
	var flashcards []Flashcard
	for _, item := range rawItems {
		var flashcard Flashcard
		if item.Language1 == languageName {
			flashcard = Flashcard{
				Language: languageName,
				Front:    item.Phrase2,
				Back:     item.Phrase1,
			}
		} else {
			flashcard = Flashcard{
				Language: languageName,
				Front:    item.Phrase1,
				Back:     item.Phrase2,
			}
		}
		flashcards = append(flashcards, flashcard)
	}
	return flashcards, nil
}

func createPromptTexts(flashcards []Flashcard, numberOfPhrases int, numberOfWords int, languageAbbreviation string, languageName string) {
	var lines []string
	count := 1
	var meanings []string
	var phrases []string
	// fmt.Printf("Creating prompts for %s and %s with %d phrases and paragraph length of %d\n", languageName, languageAbbreviation, numberOfPhrases, numberOfWords)
	for _, card := range flashcards {
		meanings = append(meanings, card.Back+" ("+card.Front+")")
		phrases = append(phrases, card.Back)
		if count%numberOfPhrases == 0 {
			line := fmt.Sprintf("%s\n\nCreate a title (first letter uppercase, the rest lowercase) and story about any topic in %s with %d words which uses the phrases, and vary the tenses past, present, conditional and future: \"%s\"\n\n-------------------------------", "- "+strings.Join(meanings, "\n- "), languageName, numberOfWords, strings.Join(phrases, "\", \""))
			lines = append(lines, line)
			lines = append(lines, "")
			meanings = []string{}
			phrases = []string{}
		}
		count++
	}
	// save lines to file
	utils.SaveLinesToFile(fmt.Sprintf("../../../dev/gt-prompts-%s.txt", languageAbbreviation), lines)
	fmt.Printf("Saved prompts to file: ../../../dev/gt-prompts-%s.txt\n", languageAbbreviation)
}
