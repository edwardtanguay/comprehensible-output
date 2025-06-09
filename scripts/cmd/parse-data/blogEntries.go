package main

import (
	"comprehensible-output/utils"
	"fmt"
	"regexp"
	"strings"
)

func parseBlogEntries() {
	var appdir = getRelativeAppDataDirectory()
	files := utils.GetFileNamesFromDirectoryThatContainText(appdir, ".compout.")

	var outputItems []OutputItem
	for _, file := range files {
		language := utils.GetLanguageCodeFromFileName(file)
		lines := utils.GetLinesFromFile(appdir + "/" + file)
		numberOfDaysRecorded := 0
		var date string
		var title string
		var htmlBody string
		for _, line := range lines {
			isDateLine, _ := regexp.MatchString(`^\d{4}-\d{2}-\d{2}`, line)
			if isDateLine {
				if numberOfDaysRecorded > 0 {
					// save the previous one
					outputItems = append(outputItems, createOutputItem(language, date, title, htmlBody, "blog"))
					htmlBody = ""
				}
				date, title = utils.GetDateAndTitleFromLine(line)
				numberOfDaysRecorded++
			} else {
				if len(strings.TrimSpace(line)) != 0 {
					if strings.HasPrefix(line, ">> ") {
						htmlBody += "<h3>" + utils.CapitalizeFirstLetter(strings.TrimPrefix(line, ">> ")) + "</h3>"
					} else {
						htmlBody += "<p>" + line + "</p>"
					}
				}
			}
		}
		// save the last one
		if numberOfDaysRecorded > 0 {
			outputItems = append(outputItems, createOutputItem(language, date, title, htmlBody, "blog"))
		}
	}

	err := saveOutputItemsToJsonFile(outputItems)
	if err != nil {
		fmt.Printf("Error saving output items: %v\n", err)
		return
	}

	utils.PrintConsoleFinishedNote("blog items parsed")
}

func createOutputItem(language string, date string, title string, htmlBody string, kind string) OutputItem {
	return OutputItem{
		Suuid:         utils.GenerateShortUUID(),
		Language:      language,
		Date:          date,
		Title:         utils.CapitalizeFirstLetter(title),
		HtmlBody:      htmlBody,
		AudioFileName: utils.GetAudioFileName(date, language),
		Kind:          kind,
	}
}
