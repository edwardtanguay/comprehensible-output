# comprehensible-output

This app uses AI to create a story from the words and phrases that I look up at Google Translate each day. I then record myself reading the story aloud, then listen to it multiple times afterward during the following days like a podcast.

The story is created with AI by combining the words and phrases into a creative, coherent narrative, which helps me to learn and internalize the language I am currently looking up and learning. In the process, I practice the four skills of language learning: reading, writing, listening, and speaking.

## setup / start

-   `npm i`
-   `npm run dev`

## record phrases

-   look up phrases in Google Translate
-   for phrases you want to import, click on the star

## import phrases

-   at Google Translate, export to Google Sheets
-   save Google Sheets file as .csv
-   copy .csv file into /import
-   delete phrases in Google Translate

## create story

-   `npm run import`
-   `npm run cp fr` (default: 50 phrases, 550 words)
    -   or: `npm run cp it 80` (80 phrases, 880 words)
    -   it will use all new phrases, if it needs more, it will use random used phrases
-   copy-paste generated prompt into LLM
-   copy-paste the story into e.g. it.compout.txt
-   `npm run pd`
-   push to Vercel
