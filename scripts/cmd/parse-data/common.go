package main

import (
	"encoding/json"
	"os"
	"sort"
	"strings"
)

type OutputItem struct {
	Suuid                 string `json:"suuid"`
	Language              string `json:"language"`
	Date                  string `json:"date"`
	Title                 string `json:"title"`
	HtmlBody              string `json:"htmlBody"`
	AudioFileName         string `json:"audioFileName"`
	Kind                  string `json:"kind"`
	AudioSeconds          int    `json:"audioSeconds"`
	EstimatedAudioSeconds int    `json:"estimatedAudioSeconds"`
}

type Flashcard struct {
	Suuid    string `json:"suuid"`
	Category string `json:"category"`
	Front    string `json:"front"`
	Back     string `json:"back"`
}

func getOutputItemsFromJsonFile() ([]OutputItem, error) {
	jsonData, err := os.ReadFile("../../../parseddata/outputItems.json")
	if err != nil {
		return nil, err
	}
	var outputItems []OutputItem
	err = json.Unmarshal(jsonData, &outputItems)
	if err != nil {
		return nil, err
	}

	// Sort by date in descending order
	sort.Slice(outputItems, func(i, j int) bool {
		return outputItems[i].Date > outputItems[j].Date
	})

	// HACK: fixes the problem that Ś (character in Polish) is being corrupted at some point, so we switch it back here
	for i, item := range outputItems {
		outputItems[i].Title = strings.ReplaceAll(item.Title, "��", "Ś")
	}

	// for _, item := range outputItems {
	// 	fmt.Println(item.Date)
	// }

	return outputItems, nil
}

func getFlashcardsFromJsonFile() ([]Flashcard, error) {
	jsonData, err := os.ReadFile("../../../dev/flashcards.json")
	if err != nil {
		return nil, err
	}
	var flashcards []Flashcard
	err = json.Unmarshal(jsonData, &flashcards)
	if err != nil {
		return nil, err
	}

	// Sort by date in descending order
	sort.Slice(flashcards, func(i, j int) bool {
		return flashcards[i].Suuid > flashcards[j].Suuid
	})

	return flashcards, nil
}

func saveOutputItemsToJsonFile(outputItems []OutputItem) error {

	// fmt.Println(outputItems)

	jsonData, err := json.MarshalIndent(outputItems, "", "\t")
	if err != nil {
		return err
	}

	err = os.WriteFile("../../../parseddata/outputItems.json", jsonData, 0644)
	if err != nil {
		return err
	}
	return nil
}
