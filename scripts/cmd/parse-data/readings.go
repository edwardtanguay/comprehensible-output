package main

import (
	"comprehensible-output/utils"
	"fmt"
	"strings"
)

func parseReadings() {
	var appdir = getRelativeAppDataDirectory()
	files := utils.GetFileNamesFromDirectoryThatContainText(appdir, ".readings.")
	outputItems, err := getOutputItemsFromJsonFile()
	if err != nil {
		fmt.Printf("Error getting output items: %v\n", err)
		return
	}

	for _, file := range files {
		lines := utils.GetLinesFromFile(appdir + "/" + file)

		for _, line := range lines {
			parts := strings.Split(line, ";")
			date := parts[0]
			language := strings.TrimSpace(parts[1])
			title := parts[2]
			htmlBody := parts[3]

			outputItems = append(outputItems, createOutputItemForReadings(language, date, title, htmlBody, "reading"))
		}
		// 	// save the last one
	}

	err = saveOutputItemsToJsonFile(outputItems)
	if err != nil {
		fmt.Printf("Error saving output items: %v\n", err)
		return
	}

	utils.PrintConsoleFinishedNote("readings parsed")
}

func createOutputItemForReadings(language string, date string, title string, htmlBody string, kind string) OutputItem {
	return OutputItem{
		Suuid:         utils.GenerateShortUUID(),
		Language:      language,
		Date:          date,
		Title:         utils.CapitalizeFirstLetter(title),
		HtmlBody:      htmlBody,
		AudioFileName: date + "-" + language + "-reading.mp3",
		Kind:          kind,
	}
}
