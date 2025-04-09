package utils

import (
	"os"
	"strings"
)

/*
Get all lines from a file as a slice of strings

lines := getLinesFromFile("../../notes.txt")

- use relative path
*/
func GetLinesFromFile(fileName string) []string {
	byteContents, err := os.ReadFile(fileName)
	if err != nil {
		panic(err)
	}
	contents := string(byteContents)
	lines := strings.Split(contents, "\n")
	for i, line := range lines {
		lines[i] = strings.TrimSpace(line)
	}
	return lines
}

/*
Get all filenames from a directory as a slice of strings

files := GetFileNamesFromDirectory("../../data")

- use relative path
*/
func GetFileNamesFromDirectory(dirPath string) []string {
	entries, err := os.ReadDir(dirPath)
	if err != nil {
		panic(err)
	}

	var files []string
	for _, entry := range entries {
		if !entry.IsDir() {
			files = append(files, entry.Name())
		}
	}
	return files
}

/*
Get all filenames from a directory as a slice of strings, but only those that contain a certain text

files := utils.GetFileNamesFromDirectoryThatContainText("../../../data", ".compout.")

- use relative path
*/
func GetFileNamesFromDirectoryThatContainText(dirPath string, text string) []string {
	entries, err := os.ReadDir(dirPath)
	if err != nil {
		panic(err)
	}

	var files []string
	for _, entry := range entries {
		if !entry.IsDir() && strings.Contains(entry.Name(), text) {
			files = append(files, entry.Name())
		}
	}
	return files
}

/*
Save a slice of strings to a file as lines

utils.SaveLinesToFile("../../output.txt", []string{"line1", "line2"})

- use relative path
*/
func SaveLinesToFile(fileName string, lines []string) error {
	content := strings.Join(lines, "\n")
	err := os.WriteFile(fileName, []byte(content), 0644)
	if err != nil {
		return err
	}
	return nil
}
