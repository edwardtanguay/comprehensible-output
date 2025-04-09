#!/bin/bash

FILE="data/googtran.csv"
WORDS=("Dutch" "French" "Italian" "Spanish" "German" "Polish")

for word in "${WORDS[@]}"; do
    count=$(grep -c "$word," "../../$FILE")
    echo "$word: $count"
done
