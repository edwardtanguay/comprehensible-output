package utils

import (
	"strings"
	"os"
	"fmt"
	"path/filepath"
	"encoding/json"
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

type CompoutPhrase struct {
	SourcePhrase   string `json:"source_phrase"`
	TargetPhrase   string `json:"target_phrase"`
	TargetLanguage string `json:"target_language"`
	WhenRecorded   string `json:"when_recorded"`
	WhenUsed       string `json:"when_used"`
}

func GetLanguageCode(language string) string {
	switch language {
	case "English":
		return "en"
	case "German":
		return "de"
	case "French":
		return "fr"
	case "Spanish":
		return "es"
	case "Italian":
		return "it"
	case "Dutch":
		return "nl"
	case "Polish":
		return "pl"
	case "Russian":
		return "ru"
	case "Greek":
		return "el"
	case "Icelandic":
		return "is"
	default:
		return "unknown"
	}
}

func GetCompoutPhrasesPathAndFileName() string {
	return "../../../parseddata/compoutPhrases.json"
}

func GetCompoutPhrases() []CompoutPhrase {
	existingPhrases := []CompoutPhrase{}
	phrasesFile := GetCompoutPhrasesPathAndFileName()
	if data, err := os.ReadFile(phrasesFile); err == nil {
		_ = json.Unmarshal(data, &existingPhrases)
	}
	return existingPhrases
}

