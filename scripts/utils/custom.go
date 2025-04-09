package utils

import (
	"strings"
	"os"
	"fmt"
	"path/filepath"
)

/*
Return the language code from the file name

fr.compout.txt

returns e.g. "fr"
*/
func GetLanguageCodeFromFileName(fileName string) string {
	parts := strings.Split(fileName, ".")
	if len(parts) > 0 {
		return parts[0][:2]
	}
	return ""
}

func GetDateAndTitleFromLine(line string) (string, string) {
	if len(line) >= 16 {
		return line[:10], strings.TrimSpace(line[12:])
	}
	return "", ""
}

func GetAudioFileName(date string, language string) string {
	fileName := date + "-" + language + ".mp3"
	relativePathAndFileName := "../../../public/audio/" + fileName
	absolutePathAndFileName, _ := filepath.Abs(relativePathAndFileName)
	fmt.Printf("Absolute path: %s\n", absolutePathAndFileName)
	if _, err := os.Stat(absolutePathAndFileName); err == nil {
		return fileName
	} else if os.IsNotExist(err) {
		fmt.Println(fileName + " does not exist") 
	} else {
		fmt.Println("Error checking file:", err) 
	}
	return ""
}
