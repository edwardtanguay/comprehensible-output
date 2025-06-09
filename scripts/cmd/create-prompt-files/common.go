package main

import (
	"fmt"
	"strings"
)

type RawGoogleTranslateItems struct {
	Language1 string `json:"language1"`
	Language2 string `json:"language2"`
	Phrase1   string `json:"phrase1"`
	Phrase2   string `json:"phrase2"`
}

type Flashcard struct {
	Language string `json:"language"`
	Front    string `json:"front"`
	Back     string `json:"back"`
}

type StatsLineItem struct {
	Language        string
	NumberOfPhrases int
}

func getRelativeGoogleTranslateDataDirectory() string {
	return "../../../data/google-translate-phrases"
}

func getRelativePhraseDataDirectory() string {
	return "../../../data/phrases"
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
	default:
		return "Unknown"
	}
}

func getLanguageCode(language string) string {
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

func createLanguagePrompt(language string, phrases []string) string {
	numberOfWords := 550
	topic := "any topic"
	level := "A1"
	r := ""
	switch language {
	case "German":
		level = "C2"
	case "French":
		level = "B2"
	case "Spanish":
		level = "B1"
	case "Italian":
		level = "B1"
	case "Dutch":
		level = "B1"
	case "Polish":
		level = "A1"
	case "Russian":
		level = "A1"
	case "Greek":
		level = "A1"
	case "Icelandic":
		level = "A1"
	}
	if level == "A1" {
		r += fmt.Sprintf("Create a %d word story about %s in %s %s that uses numbers between 1 and 100, days of the week, basic colors, month names, telling time, family members, vocabulary from everyday life and common daily routines, using only the present tense. Spell out all numbers and times with the number-version following in parentheses, e.g. at 3:00 (three o'clock) and he has 7 (seven).", numberOfWords, topic, level, language)
	} else {
		r += fmt.Sprintf("Create a title (first letter uppercase, the rest lowercase) and then a story about %s, in %s %s, with %d words varying the tenses past, present, conditional and future, using the following phrases: \"%s\".", topic, level, language, numberOfWords, strings.Join(phrases, "\", \""))
	}

	// exceptions
	if language == "English" {
		r = "Create a 550 word story in English on a C2 academic, scientific and legalistic level varying the tenses present simple, past simple, future simple, present continuous, past continuous, future continuous, present perfect, past perfect, future perfect, present perfect continuous, past perfect continuous, future perfect continuous."
		r += fmt.Sprintf(" Use these terms and phrases: \"%s\"", strings.Join(phrases, "\", \""))
	}
	return r
}
