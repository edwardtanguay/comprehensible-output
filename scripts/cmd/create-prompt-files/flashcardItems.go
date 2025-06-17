package main

import (
	"comprehensible-output/utils"
	"fmt"
)

func createFlashcardItems(rawItems []RawGoogleTranslateItems, language string) ([]Flashcard, error) {
	var flashcards []Flashcard
	for _, item := range rawItems {
		var flashcard Flashcard
		if item.Language1 == language {
			flashcard = Flashcard{
				Language: language,
				Front:    item.Phrase2,
				Back:     item.Phrase1,
			}
		} else {
			flashcard = Flashcard{
				Language: language,
				Front:    item.Phrase1,
				Back:     item.Phrase2,
			}
		}
		flashcards = append(flashcards, flashcard)
	}
	return flashcards, nil
}

func createPromptTexts(allFlashcards []Flashcard, numberOfPhrases int, numberOfWords int, language string) {
	var lines []string
	var meanings []string
	var phrases []string

	var flashcards []Flashcard
	if len(allFlashcards) < numberOfPhrases {
		flashcards = allFlashcards
	} else {
		flashcards = allFlashcards[len(allFlashcards)-numberOfPhrases:]
	}

	for _, card := range flashcards {
		meanings = append(meanings, card.Back+" ("+card.Front+")")
		phrases = append(phrases, card.Back)
	}
	line := createLanguagePrompt(language, phrases)
	lines = append(lines, line)

	// save lines to file
	utils.SaveLinesToFile(fmt.Sprintf("../../../data/prompt-files/prompts-%s.txt", getLanguageCode(language)), lines)
}
