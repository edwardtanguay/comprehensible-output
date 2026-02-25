package main

import (
	"comprehensible-output/utils"
	"encoding/json"
	"fmt"
	"os"
	"strings"
)

type Pronunciation struct {
	Language      string `json:"language"`
	Front         string `json:"front"`
	Pronunciation string `json:"pronunciation"`
	Back          string `json:"back"`
}

func parsePronunciations() {
	lines := utils.GetLinesFromFile("../../../data/pronunciation.txt")

	var pronunciations []Pronunciation
	foundFlashcards := false

	for _, line := range lines {
		line = strings.TrimSpace(line)
		if line == "" {
			continue
		}

		if line == "``flashcards" {
			foundFlashcards = true
			continue
		}

		if !foundFlashcards {
			continue
		}

		parts := strings.Split(line, ";")
		if len(parts) != 4 {
			fmt.Printf("Ignoring line (does not have 3 semicolons): %s\n", line)
			continue
		}

		pronunciation := Pronunciation{
			Language:      strings.ReplaceAll(strings.TrimSpace(parts[0]), "’", "'"),
			Front:         strings.ReplaceAll(strings.TrimSpace(parts[1]), "’", "'"),
			Pronunciation: strings.ReplaceAll(strings.TrimSpace(parts[2]), "’", "'"),
			Back:          strings.ReplaceAll(strings.TrimSpace(parts[3]), "’", "'"),
		}
		pronunciations = append(pronunciations, pronunciation)
	}

	jsonData, err := json.MarshalIndent(pronunciations, "", "\t")
	if err != nil {
		fmt.Printf("Error marshalling pronunciations to JSON: %v\n", err)
		return
	}

	err = os.WriteFile("../../../parseddata/pronunciations.json", jsonData, 0644)
	if err != nil {
		fmt.Printf("Error writing pronunciations.json: %v\n", err)
		return
	}

	utils.PrintConsoleFinishedNote("pronunciations parsed")
}
