package main

import (
	"comprehensible-output/utils"
	"fmt"
	"os"
	"sort"
	"strings"
	"time"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage:   npm run cpf <language>")
		fmt.Println("Example: npm run cpf fr")
		fmt.Println("Example: npm run cpf it")
		return
	}
	filterLanguage := os.Args[1]
	numberOfPhrases := 10
	numberOfWords := 100

	flashcards, err := getFlashcardsFromJsonFile()
	if err != nil {
		fmt.Printf("Error getting output items: %v\n", err)
		return
	}
	utils.PrintConsoleFinishedNote(fmt.Sprintf("%d flashcards loaded from JSON file", len(flashcards)))

	var filteredFlashcards []Flashcard
	for _, card := range flashcards {
		if card.Language == filterLanguage {
			filteredFlashcards = append(filteredFlashcards, card)
		}
	}

	// Sort flashcards by whenCreated
	sort.Slice(filteredFlashcards, func(i, j int) bool {
		timeI, _ := time.Parse("2006-01-02 15:04:05", filteredFlashcards[i].WhenCreated)
		timeJ, _ := time.Parse("2006-01-02 15:04:05", filteredFlashcards[j].WhenCreated)
		return timeJ.Before(timeI)
	})

	// for _, card := range filteredFlashcards {
	// 	fmt.Println(card.Language, card.WhenCreated, card.Back)
	// }

	var lines []string
	count := 1
	var meanings []string
	var phrases []string
	for _, card := range filteredFlashcards {
		meanings = append(meanings, card.Back+" ("+card.Front+")")
		phrases = append(phrases, card.Back)
		if count%numberOfPhrases == 0 {
			line := fmt.Sprintf("%s\n\nCreate a title (first letter uppercase, the rest lowercase) and story about software development in %s with %d words which uses the phrases, and vary the tenses past, present, conditional, future, and reflexive: \"%s\"\n\n-------------------------------", "- "+strings.Join(meanings, "\n- "), getLanguageWord(filterLanguage), numberOfWords, strings.Join(phrases, "\", \""))
			lines = append(lines, line)
			lines = append(lines, "")
			meanings = []string{}
			phrases = []string{}
		}
		count++
	}

	utils.SaveLinesToFile(fmt.Sprintf("../../../dev/prompts-%s.txt", filterLanguage), lines)
}
