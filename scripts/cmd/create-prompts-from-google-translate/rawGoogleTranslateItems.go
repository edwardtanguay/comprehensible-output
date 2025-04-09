package main

import (
	"comprehensible-output/utils"
	"encoding/csv"
	"fmt"
	"strings"
)

func createRawGoogleTranslateItems(languageName string) ([]RawGoogleTranslateItems, error) {
	pathAndFileName := "../../../data/googtran.csv"
	lines := utils.GetLinesFromFile(pathAndFileName)

	var items []RawGoogleTranslateItems
	for _, line := range lines {
		reader := csv.NewReader(strings.NewReader(line))
		record, err := reader.Read()
		if err != nil {
			fmt.Printf("Failed to parse line: %v, error: %v\n", line, err)
			continue
		}

		if len(record) < 4 {
			fmt.Printf("Invalid record format: %v\n", record)
			continue
		}

		if record[0] == languageName || record[1] == languageName {
			item := RawGoogleTranslateItems{
				Language1: record[0],
				Language2: record[1],
				Phrase1:   record[2],
				Phrase2:   record[3],
			}
			items = append(items, item)
		}
	}

	return items, nil
}
