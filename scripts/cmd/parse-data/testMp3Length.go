package main

import (
	"comprehensible-output/utils"
	"fmt"
)

func testMp3Length() {
	parseBlogEntries()
	parseReadings()

	duration, err := utils.GetMP3DurationSeconds("../../../public/audio/2025-03-27-fr.mp3")
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	fmt.Printf("MP3 duration: %.2f seconds\n", duration)
}
