package main

import (
	"fmt"
	"os"
	"strconv"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: create-prompt <language> [numberOfPhrases]")
		return
	}

	language := os.Args[1]
	numberOfPhrases := 50 // default

	if len(os.Args) >= 3 {
		if n, err := strconv.Atoi(os.Args[2]); err == nil {
			numberOfPhrases = n
		}
	}

	numberOfWords := numberOfPhrases * 11
	promptTitle := fmt.Sprintf("prompt in %s to create a story with %d phrases and %d words...\n", getLanguageWord(language), numberOfPhrases, numberOfWords)
	fmt.Printf("Creating %s", promptTitle)
	printLineInTerminal()

	phrases := getPhrasesForPrompt(language, numberOfPhrases)
	promptText := createLanguagePrompt(language, phrases, numberOfWords)
	archivePromptText(promptText, promptTitle)
	printLineInTerminal()
	fmt.Println("To create a story, copy and paste the following prompt into an LLM.")
	fmt.Println("(this prompt can also be found in the file /data/prompts-history.txt)")
	printLineInTerminal()
	fmt.Println(promptText)
	printLineInTerminal()
}
