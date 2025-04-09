package utils

import (
	"os"
	"time"
	"github.com/tcolgate/mp3"
	"path/filepath"
)

func GetMP3DurationSeconds(filePath string) (float64, error) {
	absolutePathAndFileName, _ := filepath.Abs(filePath)
	file, err := os.Open(absolutePathAndFileName)
	if err != nil {
		return 0, err
	}
	defer file.Close()

	var (
		duration time.Duration
		decoder  = mp3.NewDecoder(file)
		frame    mp3.Frame
		skipped  int
	)

	for {
		if err := decoder.Decode(&frame, &skipped); err != nil {
			break
		}
		duration += frame.Duration()
	}

	return duration.Seconds(), nil
}
