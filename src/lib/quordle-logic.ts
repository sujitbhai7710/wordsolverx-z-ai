
export interface Guess {
    word: string;
    feedback: [string, string, string, string]; // Each string is 5 chars of 'g', 'y', 'x'
}

export class QuordleSolver {
    letters: string[];
    allWords: string[];
    indivWords: string[][];
    restOfWords: string[];
    lettersUsed: number[];
    knowledgeList: string[][];
    resultsList: string[][];
    iteration: number;
    avgLikelihoods: number[];

    constructor(masterWords: string[], restWords: string[]) {
        this.letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        this.allWords = [...masterWords];
        this.indivWords = [
            [...masterWords],
            [...masterWords],
            [...masterWords],
            [...masterWords]
        ];
        this.restOfWords = [...restWords];
        this.lettersUsed = new Array(26).fill(1);
        this.knowledgeList = [
            new Array(5).fill(""),
            new Array(5).fill(""),
            new Array(5).fill(""),
            new Array(5).fill("")
        ];
        this.resultsList = [
            new Array(5).fill(""),
            new Array(5).fill(""),
            new Array(5).fill(""),
            new Array(5).fill("")
        ];
        this.iteration = -1;
        this.avgLikelihoods = this.totalLetterLikelihoods(this.getLetterLikelihoods(this.allWords));
    }

    getLetterLikelihoods(wordsList: string[]): number[][] {
        let spotLikelihoods: number[][] = Array.from({ length: 5 }, () => new Array(26).fill(0));
        let overallLikelihoods: number[] = new Array(26).fill(0);

        for (const word of wordsList) {
            for (let j = 0; j < 5; j++) {
                const charCode = word.charCodeAt(j) - 65;
                if (charCode >= 0 && charCode < 26) {
                    spotLikelihoods[j][charCode] += 3;
                    overallLikelihoods[charCode] += 1;
                }
            }
        }

        for (let ltr = 0; ltr < 26; ltr++) {
            for (let spot = 0; spot < 5; spot++) {
                spotLikelihoods[spot][ltr] += overallLikelihoods[ltr];
            }
        }
        return spotLikelihoods;
    }

    totalLetterLikelihoods(llh: number[][]): number[] {
        let newList: number[] = [];
        for (let i = 0; i < 26; i++) {
            let sum = 0;
            for (let j = 0; j < 5; j++) {
                sum += llh[j][i];
            }
            newList.push(Math.ceil(sum / 8));
        }
        return newList;
    }

    getDupsIndexList(ltrIndex: number, wrd: string): number[] {
        let sameLetterIndexList: number[] = [];
        for (let i = 0; i < 5; i++) {
            if (wrd[i] === wrd[ltrIndex]) {
                sameLetterIndexList.push(i);
            }
        }
        return sameLetterIndexList;
    }

    getFillerWord(lettersList: string[]): string {
        if (lettersList.length >= 4) {
            for (const word of this.restOfWords) {
                if (lettersList.slice(0, 4).every(l => word.includes(l))) return word;
            }
        }
        if (lettersList.length >= 3) {
            for (const word of this.restOfWords) {
                if (lettersList.slice(0, 3).every(l => word.includes(l))) return word;
            }
        }
        for (const word of this.restOfWords) {
            if (lettersList.slice(0, 2).every(l => word.includes(l))) return word;
        }
        return "XXXXX";
    }

    getMissingLetters(wordNum: number, ltr: number): string[] {
        return this.indivWords[wordNum].map(w => w[ltr]);
    }

    getUnknownLetterPositions(wordList: string[]): number[] {
        if (wordList.length === 0) return [];
        let unknownLtrPosList: number[] = [];
        for (let ltr = 0; ltr < 5; ltr++) {
            const firstChar = wordList[0][ltr];
            if (!wordList.every(w => w[ltr] === firstChar)) {
                unknownLtrPosList.push(ltr);
            }
        }
        return unknownLtrPosList;
    }

    minLenNot0(): number {
        let activeLengths = this.indivWords.filter(w => w.length > 0).map(w => w.length);
        return activeLengths.length > 0 ? Math.min(...activeLengths) : 0;
    }

    findBestWord(): string {
        // Step 1: Check for single possibilities
        for (let i = 0; i < 4; i++) {
            // Check if this board is already solved (CCCCC) to avoid suggesting for it
            // However, the original logic checks if resultsList is NOT CCCCC
            if (this.indivWords[i].length === 1 && this.resultsList[i].join('') !== "CCCCC") {
                return this.indivWords[i][0];
            }
        }

        let wordsLeft = 0;
        for (let i = 0; i < 4; i++) {
            if (this.resultsList[i].join('') !== "CCCCC") {
                wordsLeft++;
            }
        }

        // If all puzzles are solved, we're done
        if (wordsLeft === 0 && this.iteration > -1) {
            return "All Solved!";
        }


        let combinedWordsList: string[] = [];
        for (let i = 0; i < 4; i++) {
            // Only consider unsolved puzzles
            if (this.indivWords[i].length > 0 && this.resultsList[i].join('') !== "CCCCC") {
                let unknownLetterPosns = this.getUnknownLetterPositions(this.indivWords[i]);
                if (unknownLetterPosns.length === 1 && this.indivWords[i].length > 2 && this.iteration !== 7) {
                    let missingLetters = this.getMissingLetters(i, unknownLetterPosns[0]);
                    combinedWordsList.push(this.getFillerWord(missingLetters));
                } else if (unknownLetterPosns.length === 2 && !this.resultsList[i].includes("M") && wordsLeft > 1) {
                    let missingLetters = [...new Set([...this.getMissingLetters(i, unknownLetterPosns[0]), ...this.getMissingLetters(i, unknownLetterPosns[1])])];
                    combinedWordsList.push(this.getFillerWord(missingLetters));
                } else {
                    combinedWordsList.push(...this.indivWords[i]);
                }
            }
        }

        if (combinedWordsList.length === 0) return "XXXXX";

        let likelihoods = this.getLetterLikelihoods(combinedWordsList);
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 26; j++) {
                likelihoods[i][j] += (this.avgLikelihoods[j] * this.lettersUsed[j]);
            }
        }

        let maxVal = -1;
        let bestWord = combinedWordsList[0];

        // Deduplicate combinedWordsList to avoid processing same word multiple times
        const uniqueCombinedWords = [...new Set(combinedWordsList)];

        for (const word of uniqueCombinedWords) {
            let curWordValue = 0;
            for (let j = 0; j < 5; j++) {
                const charCode = word.charCodeAt(j) - 65;
                if (charCode < 0 || charCode >= 26) continue; // Safety check

                let dupeFactor = 1;
                const dups = this.getDupsIndexList(j, word).length;
                if (dups === 2) dupeFactor = 2 / 3;
                else if (dups === 3) dupeFactor = 0.5;
                curWordValue += (likelihoods[j][charCode] * dupeFactor);
            }

            if (this.iteration > 0) {
                let inListCounter = 0;
                let inMinLenList = false;
                let minLen = this.minLenNot0();

                for (let a = 0; a < 4; a++) {
                    if (this.indivWords[a].includes(word) && this.resultsList[a].join('') !== 'CCCCC') {
                        inListCounter++;
                        if (this.indivWords[a].length === minLen) inMinLenList = true;
                    }
                }
                if (inMinLenList && inListCounter === 1 && wordsLeft > 1) {
                    curWordValue = 0;
                }
            }

            if (curWordValue > maxVal) {
                maxVal = curWordValue;
                bestWord = word;
            }
        }

        return bestWord;
    }

    setLettersAsUsed(wrd: string) {
        for (let i = 0; i < 5; i++) {
            const charCode = wrd.charCodeAt(i) - 65;
            if (charCode >= 0 && charCode < 26) this.lettersUsed[charCode] = 0;
        }
    }

    submitGuess(guessWord: string, resultsPerBoard: string[]) {
        // resultsPerBoard expects strings like "gyxxg" for each board
        this.iteration++;

        // Convert string feedback (e.g., "gyxxy") to array of chars for internal processing if needed, 
        // but existing removeWords uses the array of strings directly, assuming they are accessible via resultsList
        // The original JS stored arrays of characters. Let's adapt.

        // The original code was: this.resultsList = resultsPerBoard; 
        // which implies resultsPerBoard was [ ['x','y'...], ... ] or compatible strings.
        // In removeWords: const results = this.resultsList[wordIdx]; then results[i] === "I"

        // Let's standardise to uppercase chars C (Correct/Green), M (Misplaced/Yellow), I (Incorrect/Grey)
        // Our input usually comes as 'g', 'y', 'x'. We need to map them.

        const mappedResults = resultsPerBoard.map(feedbackStr => {
            return feedbackStr.toUpperCase().split('').map(c => {
                if (c === 'G') return 'C';
                if (c === 'Y') return 'M';
                return 'I';
            });
        });

        // But wait, the original logic used "C", "M", "I". 
        // resultsList in original was initialized as arrays of "".

        this.resultsList = mappedResults.map(arr => arr.join('').split('')); // Ensure it's array of arrays of chars if needed, or just keep as compatible format.
        // Actually, looking at `removeWords` in original:
        // `const results = this.resultsList[wordIdx];`
        // `if (results.join('') === "CCCCC")`
        // `const res = results[i];`
        // So `results` should be an array of characters 'C', 'M', 'I'.

        this.setLettersAsUsed(guessWord);
        this.removeWords(guessWord);
    }

    removeWords(lastWord: string) {
        for (let wordIdx = 0; wordIdx < 4; wordIdx++) {
            if (this.indivWords[wordIdx].length === 0) continue;

            const results = this.resultsList[wordIdx];
            if (results.join('') === "CCCCC") {
                this.indivWords[wordIdx] = [];  // Clear possibilities for solved board
                continue;
            }

            // Remove the guessed word from possibilities
            const idxInList = this.indivWords[wordIdx].indexOf(lastWord);
            if (idxInList !== -1) this.indivWords[wordIdx].splice(idxInList, 1);
            if (this.indivWords[wordIdx].length === 0) continue;

            let filtered: string[] = [];
            for (const candidate of this.indivWords[wordIdx]) {
                let match = true;
                for (let i = 0; i < 5; i++) {
                    const res = results[i];
                    const char = lastWord[i];

                    if (res === "I") {
                        const dups = this.getDupsIndexList(i, lastWord);
                        if (dups.length > 1) {
                            const dupsResults = dups.map(idx => results[idx]);
                            if (dupsResults.includes("M") || dupsResults.includes("C")) {
                                if (candidate[i] === char) { match = false; break; }
                            } else {
                                if (candidate.includes(char)) { match = false; break; }
                            }
                        } else {
                            if (candidate.includes(char)) { match = false; break; }
                        }
                    } else if (res === "M") {
                        if (candidate[i] === char || !candidate.includes(char)) { match = false; break; }
                    } else if (res === "C") {
                        if (candidate[i] !== char) { match = false; break; }
                    }
                }
                if (match) filtered.push(candidate);
            }
            this.indivWords[wordIdx] = filtered;
        }
    }
}

// Helper function to bridge the React component with this class
export function solveQuordle(guesses: Guess[], masterList: string[], restList: string[]) {
    const solver = new QuordleSolver(masterList, restList);

    // Replay history
    for (const guess of guesses) {
        // feedback is [string, string, string, string] e.g. ["gyxxy", ...]
        solver.submitGuess(guess.word.toUpperCase(), guess.feedback);
    }

    const bestGuess = solver.findBestWord();

    return {
        bestGuess,
        possibleWordsPerPuzzle: solver.indivWords,
        solvedStates: solver.resultsList.map(r => r.join('') === 'CCCCC')
    };
}
