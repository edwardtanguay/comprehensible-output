package main

import (
	"encoding/json"
	"math/rand"
	"os"
	"time"
)

type Flashcard struct {
	Language    string `json:"language"`
	Front       string `json:"front"`
	Back        string `json:"back"`
	WhenCreated string `json:"whenCreated"`
}

func getFlashcardsFromJsonFile() ([]Flashcard, error) {
	jsonData, err := os.ReadFile("../../../../techlanglearn/src/db/data/flashcards.json")
	if err != nil {
		return nil, err
	}
	var flashcards []Flashcard
	err = json.Unmarshal(jsonData, &flashcards)
	if err != nil {
		return nil, err
	}

	return flashcards, nil
}

func shuffleFlashcards(flashcard []Flashcard) {
	rand.Seed(time.Now().UnixNano())

	for i := len(flashcard) - 1; i > 0; i-- {
		j := rand.Intn(i + 1)
		flashcard[i], flashcard[j] = flashcard[j], flashcard[i]
	}
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
