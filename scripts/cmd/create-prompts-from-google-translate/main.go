package main

import (
	"fmt"
	"math/rand"
	"os"
	"strconv"
	"time"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage:   npm run cpf <language> [numberOfPhrases] [numberOfWords]")
		fmt.Println("Example: npm run cpf fr 5 50")
		fmt.Println("Example: npm run cpf it")
		return
	}
	languageAbbreviation := os.Args[1] // e.g. "fr" for French
	languageName := getLanguageWord(languageAbbreviation)

	// Default values
	numberOfPhrases := 10
	numberOfWords := 200

	// Overwrite defaults if parameters are provided
	if len(os.Args) > 2 {
		if phrases, err := strconv.Atoi(os.Args[2]); err == nil {
			numberOfPhrases = phrases
		} else {
			fmt.Println("Invalid numberOfPhrases, using default:", numberOfPhrases)
		}
	}
	if len(os.Args) > 3 {
		if words, err := strconv.Atoi(os.Args[3]); err == nil {
			numberOfWords = words
		} else {
			fmt.Println("Invalid numberOfWords, using default:", numberOfWords)
		}
	}

	fmt.Printf("Creating prompts for %s (%s) with %d phrases and %d words...\n", languageName, languageAbbreviation, numberOfPhrases, numberOfWords)

	rawGoogleTranslateItems, err := createRawGoogleTranslateItems(languageName)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	flashcards, err := createFlashcardItems(rawGoogleTranslateItems, languageName)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	// Randomly shuffle the flashcards
	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(flashcards), func(i, j int) {
		flashcards[i], flashcards[j] = flashcards[j], flashcards[i]
	})

	createPromptTexts(flashcards, numberOfPhrases, numberOfWords, languageAbbreviation, languageName)
}
