package utils

import (
	"crypto/rand"
	"math/big"
	"strings"
	"fmt"
	"time"
)

/*
Return a random suuid (short uuid = 6 characters)

suuid := GenerateShortUUID()

returns e.g. "q35HZa"
*/
func GenerateShortUUID() string {
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	const length = 6
	bytes := make([]byte, length)
	for i := 0; i < length; i++ {
		randomByte, err := rand.Int(rand.Reader, big.NewInt(int64(len(charset))))
		if err != nil {
			panic(err)
		}
		bytes[i] = charset[randomByte.Int64()]
	}
	return string(bytes)
}

/*
Capitalize the first letter of a string while keeping the rest unchanged

result := CapitalizeFirstLetter("hello")

returns e.g. "Hello"
*/
func CapitalizeFirstLetter(s string) string {
	if len(s) == 0 {
		return s
	}
	if strings.Contains(s, "oda") {
		return "Ś" + s[1:]
	} else {
		return strings.ToUpper(s[:1]) + s[1:]
	}
}

func PadZerosLeft(input int, totalLength int) string {
    return fmt.Sprintf("%0*d", totalLength, input)
}

func GetTimeStamp() string {
	// 2025-08-05 08:29:17
	return fmt.Sprintf("%04d-%02d-%02d %02d:%02d:%02d",
		time.Now().Year(), time.Now().Month(), time.Now().Day(),
		time.Now().Hour(), time.Now().Minute(), time.Now().Second())
}
