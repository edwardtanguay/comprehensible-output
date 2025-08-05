package main

import (
	"comprehensible-output/utils"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"
)

func main() {
	// Step 1: Read existing phrases from file
	phrasesFile := utils.GetCompoutPhrasesPathAndFileName()
	existingPhrases := utils.GetCompoutPhrases()

	// Step 2: Create a slice for new phrases
	newPhrases := []utils.CompoutPhrase{}

	// get filenames
	filenames := utils.GetFileNamesFromDirectory(getImportDirectory())
	for _, filename := range filenames {
		rawGoogleTranslateItems, err := createRawGoogleTranslateItems(getImportDirectory() + "/" + filename)
		if err != nil {
			fmt.Println("Error:", err)
			return
		}

		flashcards, err := createFlashcardItems(rawGoogleTranslateItems)
		if err != nil {
			fmt.Println("Error:", err)
			return
		}
		for _, flashcard := range flashcards {
			newPhrases = append(newPhrases, utils.CompoutPhrase{
				SourcePhrase:   flashcard.Front,
				TargetPhrase:   flashcard.Back,
				TargetLanguage: utils.GetLanguageCode(flashcard.Language),
				WhenRecorded:   time.Now().Format("2006-01-02 15:04:05"),
				WhenUsed:       "",
			})
		}
	}

	// Step 3: Combine existing and new phrases
	combinedPhrases := append(existingPhrases, newPhrases...)

	// Marshal to JSON
	data, err := json.MarshalIndent(combinedPhrases, "", "  ")
	if err != nil {
		fmt.Println("Error marshaling JSON:", err)
		return
	}

	// Ensure the output directory exists
	err = os.MkdirAll("../../../parseddata", os.ModePerm)
	if err != nil {
		fmt.Println("Error creating directory:", err)
		return
	}

	// Write to file
	err = os.WriteFile(phrasesFile, data, 0644)
	if err != nil {
		fmt.Println("Error writing file:", err)
		return
	}

	// Step 4: Move all files from import directory to /data/imported-phrase-files
	importDir := getImportDirectory()
	importedDir := "../../../data/imported-phrase-files"
	err = os.MkdirAll(importedDir, os.ModePerm)
	if err != nil {
		fmt.Println("Error creating directory:", err)
		return
	}

	files, err := os.ReadDir(importDir)
	if err != nil {
		fmt.Println("Error reading import directory:", err)
		return
	}

	if len(files) != 0 {
		for _, file := range files {
			if !file.IsDir() {
				srcPath := filepath.Join(importDir, file.Name())
				destPath := filepath.Join(importedDir, file.Name())
				fmt.Printf("Imported %s\n", file.Name())
				err := os.Rename(srcPath, destPath)
				if err != nil {
					fmt.Println("Error moving file:", err)
				}
			}
		}
	} else {
		fmt.Println("(no files in import directory)")
	}
	fmt.Println()

	// Step 5: Calculate and print phrase stats
	lines := getPhraseStatsLines()
	for _, line := range lines {
		fmt.Println(line)
	}
}
