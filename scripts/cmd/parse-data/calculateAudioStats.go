package main

import (
	"comprehensible-output/utils"
	"fmt"
	"path/filepath"
)

func calculateAudioStats() {
	outputItems, err := getOutputItemsFromJsonFile()
	if err != nil {
		fmt.Printf("Error getting output items: %v\n", err)
		return
	}

	// calculate real duration
	for i, item := range outputItems {
		if item.AudioFileName != "" {
			audioPath := filepath.Join("..", "..", "..", "public", "audio", item.AudioFileName)
			duration, err := utils.GetMP3DurationSeconds(audioPath)
			if err != nil {
				fmt.Printf("Error getting duration for %s: %v\n", item.AudioFileName, err)
				continue
			}
			outputItems[i].AudioSeconds = int(duration)
		}
	}

	// calculate ratio
	var ratios []float64
	for _, item := range outputItems {
		if item.Kind == "blog" && item.AudioSeconds != 0 {
			numberofBodyCharacters := len(item.HtmlBody)
			ratio := float64(item.AudioSeconds) / float64(numberofBodyCharacters)
			ratios = append(ratios, ratio)
			// fmt.Printf("characters: %d, seconds: %d, ratio: %f, file: %s\n", numberofBodyCharacters, item.AudioSeconds, ratio, item.AudioFileName)
		}
	}
	// averageRatio := 0.10 // utils.CalculateAverageOfFloats(ratios)
	averageRatio := utils.CalculateAverageOfFloats(ratios)
	fmt.Printf("Average ratio: %f\n", averageRatio)

	// save estimated duration
	for i, item := range outputItems {
		if item.AudioSeconds == 0 {
			numberofBodyCharacters := len(item.HtmlBody)
			fmt.Printf("characters: %d, averageRatio: %f\n", numberofBodyCharacters, averageRatio)
			outputItems[i].EstimatedAudioSeconds = int(float64(numberofBodyCharacters) * averageRatio)

			fmt.Printf("est: %d\n", outputItems[i].EstimatedAudioSeconds)
		}
	}

	err = saveOutputItemsToJsonFile(outputItems)
	if err != nil {
		fmt.Printf("Error saving output items: %v\n", err)
		return
	}

	utils.PrintConsoleFinishedNote("audio stats calculated")
}
