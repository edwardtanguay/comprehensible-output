package main

import (
	"comprehensible-output/utils"
	"encoding/json"
	"fmt"
	"math/rand"
	"os"
	"strings"
	"time"
)

func getPhrasesForPrompt(language string, numberOfPhrases int) []string {
	phrases := getNewPhrases(language, numberOfPhrases)
	if len(phrases) < numberOfPhrases {
		usedPhrases := getRandomUsedPhrases(language, numberOfPhrases-len(phrases))
		phrases = append(phrases, usedPhrases...)
	}
	return phrases
}

func getNewPhrases(language string, numberOfPhrases int) []string {
	newPhrases := []string{}
	phraseItems := utils.GetCompoutPhrases()
	index := 0
	for _, phraseItem := range phraseItems {
		if phraseItem.TargetLanguage == language && len(phraseItem.WhenUsed) == 0 {
			newPhrases = append(newPhrases, phraseItem.TargetPhrase)
			phraseItems[index].WhenUsed = utils.GetTimeStamp()
		}

		// stop if we have enough phrases
		if len(newPhrases) >= numberOfPhrases {
			break
		}
		index++
	}
	if len(newPhrases) > 0 {
		savePhrasesToFile(phraseItems)
	}
	fmt.Printf("Used %d new phrases\n", len(newPhrases))
	return newPhrases
}

func savePhrasesToFile(phrases []utils.CompoutPhrase) {
	phrasesFile := utils.GetCompoutPhrasesPathAndFileName()
	// Marshal to JSON
	data, err := json.MarshalIndent(phrases, "", "  ")
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
}

func getRandomUsedPhrases(language string, numberOfPhrases int) []string {
	usedPhrases := []string{}
	phraseItems := utils.GetCompoutPhrases()
	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(phraseItems), func(i, j int) {
		phraseItems[i], phraseItems[j] = phraseItems[j], phraseItems[i]
	})
	for _, phraseItem := range phraseItems {
		if phraseItem.TargetLanguage == language && len(phraseItem.WhenUsed) > 0 {
			usedPhrases = append(usedPhrases, phraseItem.TargetPhrase)
		}
	}
	if len(usedPhrases) > numberOfPhrases {
		usedPhrases = usedPhrases[:numberOfPhrases]
	}
	fmt.Printf("Used %d random used phrases\n", len(usedPhrases))
	return usedPhrases
}

func createLanguagePrompt(language string, phrases []string, numberOfWords int) string {
	topic := "any topic"
	level := "A1"
	verbTenses := "simple present, present continuous, present perfect, present perfect continuous, simple past, past continuous, past perfect, past perfect continuous, simple future, future continuous, future perfect, future perfect continuous, conditional, subjunctive, reflexive"
	r := ""
	switch language {
	case "de":
		level = "C2"
	case "fr":
		level = "B2"
	case "es":
		level = "B1"
	case "it":
		level = "B1"
	case "nl":
		level = "B1"
	case "pl":
		level = "A1"
	case "ru":
		level = "A1"
	case "el":
		level = "A1"
	case "pt":
		level = "A1"
	case "is":
		level = "A1"
	}
	if level == "A1" {
		r += fmt.Sprintf("Create a %d word story about %s in %s %s that uses numbers between 1 and 100, days of the week, basic colors, month names, telling time, family members, vocabulary from everyday life and common daily routines, using only the present tense. Spell out all numbers and times. And precede the story with an appropriate title.", numberOfWords, topic, level, getLanguageWord(language))
	} else {
		r += fmt.Sprintf("Create a title (first letter uppercase, the rest lowercase) and then a story about %s, in %s %s, with %d words varying the verb tenses %s using the following phrases: \"%s\".", topic, level, getLanguageWord(language), numberOfWords, verbTenses, strings.Join(phrases, "\", \""))
	}

	// exceptions
	if language == "en" {
		r = "Create a 550 word story in English on a C2 academic, scientific and legalistic level varying the tenses present simple, past simple, future simple, present continuous, past continuous, future continuous, present perfect, past perfect, future perfect, present perfect continuous, past perfect continuous, future perfect continuous."
		r += fmt.Sprintf(" Use these terms and phrases: \"%s\"", strings.Join(phrases, "\", \""))
	}
	return r
}

func getLanguageWord(code string) string {
	switch code {
	case "en":
		return "English"
	case "fr":
		return "French"
	case "es":
		return "Spanish"
	case "de":
		return "German"
	case "it":
		return "Italian"
	case "nl":
		return "Dutch"
	case "pl":
		return "Polish"
	case "ru":
		return "Russian"
	case "el":
		return "Greek"
	case "pt":
		return "Portuguese"
	case "is":
		return "Icelandic"
	default:
		return "Unknown"
	}
}

func getLine() string {
	return "======================================================================================"
}

func printLineInTerminal() {
	fmt.Println(getLine())
}

func archivePromptText(promptText string, promptTitle string) {
	text := getLine() + "\n" + utils.GetTimeStamp() + "\n" + utils.CapitalizeFirstLetter(promptTitle) + getLine() + "\n" + promptText
	utils.AppendToBeginningOfFile("../../../data/prompt-history.txt", text)
}
