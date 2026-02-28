
import init, { solve_waffle_wasm } from './pkg/waffle_wasm.js';

let wasmReady = false;
let allSolutions = [];
let currentSolIdx = 0;

// Initialize WASM
async function start() {
    try {
        console.log("Initializing WASM Solver V7...");
        const wasm = await init();
        console.log("WASM Module instantiated with", wasm.memory.buffer.byteLength, "bytes");
        wasmReady = true;
        console.log("Waffle WASM solver initialized");
    } catch (err) {
        console.error("WASM Initialization failed:", err);
        alert("WASM Solver failed to initialize. Please check the console for details.");
    }
}

start();

// Helper to map 5x5 grid index to 21-char puzzle index
function getGlobalIdx(index) {
    const row = Math.floor(index / 5);
    const col = index % 5;
    if (row === 0) return col;
    if (row === 1) return 5 + (col / 2);
    if (row === 2) return 8 + col;
    if (row === 3) return 13 + (col / 2);
    if (row === 4) return 16 + col;
    return 0;
}

// Function to auto-fill today's puzzle from API
window.autoFillToday = async function (event) {
    await fetchAndFill("https://api.wafflegame.workers.dev/today", event.target);
}

window.loadPuzzleByDate = async function () {
    const dateInput = document.getElementById('puzzle-date');
    if (!dateInput.value) {
        alert("Please select a date first!");
        return;
    }
    const btn = document.querySelector('button[onclick="loadPuzzleByDate()"]');
    await fetchAndFill(`https://api.wafflegame.workers.dev/date/${dateInput.value}`, btn);
}

async function fetchAndFill(url, btn) {
    const originalText = btn.innerText;
    btn.innerText = "Loading...";
    btn.disabled = true;
    allSolutions = [];
    document.getElementById('solution-status').style.display = 'none';

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("API failed");

        const data = await response.json();
        const puzzle = data.puzzle;
        const solution = data.solution;
        const colors = calculateColors(puzzle, solution);

        const cells = document.querySelectorAll('.input-cell');
        cells.forEach((cell) => {
            const index = parseInt(cell.id.split('-')[1]);
            const pIdx = getGlobalIdx(index);
            cell.value = puzzle[pIdx].toUpperCase();
            cell.classList.remove("yellow", "green");
            if (colors[pIdx] === 'green') cell.classList.add("green");
            else if (colors[pIdx] === 'yellow') cell.classList.add("yellow");
        });

    } catch (err) {
        console.error("Fetch failed:", err);
        alert("Failed to fetch puzzle data.");
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

function calculateColors(puzzle, solution) {
    const res = Array(21).fill('grey');
    const across = [[0, 1, 2, 3, 4], [8, 9, 10, 11, 12], [16, 17, 18, 19, 20]];
    const down = [[0, 5, 8, 13, 16], [2, 6, 10, 14, 18], [4, 7, 12, 15, 20]];

    [...across, ...down].forEach(indices => {
        const target = indices.map(i => solution[i]);
        const current = indices.map(i => puzzle[i]);
        const wordColors = Array(5).fill('grey');
        const available = [...target];

        current.forEach((char, i) => {
            if (char === target[i]) {
                wordColors[i] = 'green';
                available[i] = null;
            }
        });

        current.forEach((char, i) => {
            if (wordColors[i] === 'grey') {
                const idx = available.indexOf(char);
                if (idx !== -1) {
                    wordColors[i] = 'yellow';
                    available[idx] = null;
                }
            }
        });

        indices.forEach((idx, i) => {
            if (wordColors[i] === 'green') res[idx] = 'green';
            else if (wordColors[i] === 'yellow' && res[idx] !== 'green') res[idx] = 'yellow';
        });
    });
    return res;
}

window.solveWaffle = async function (event) {
    if (!wasmReady) {
        alert("Solver is still initializing... please wait a second.");
        return;
    }

    const btn = event ? event.target : document.querySelector('button[onclick*="solveWaffle"]');
    if (btn) {
        btn.disabled = true;
        btn.innerText = "Solving...";
    }

    await new Promise(r => setTimeout(r, 50));

    if (!validateGridInput()) {
        if (btn) { btn.disabled = false; btn.innerText = "Solve"; }
        return;
    }

    const gridData = getGridData();
    const puzzleStr = gridData.map(d => d.letter.toLowerCase()).join('');

    try {
        const startTime = performance.now();
        const jsonResult = solve_waffle_wasm(puzzleStr, JSON.stringify(gridData));
        const endTime = performance.now();
        console.log(`WASM Search Time: ${(endTime - startTime).toFixed(2)}ms`);

        if (jsonResult === "NOT_FOUND") {
            allSolutions = [];
            alert("No solution found.");
            document.getElementById('solution-status').style.display = 'none';
        } else {
            allSolutions = JSON.parse(jsonResult);
            currentSolIdx = 0;
            console.log(`Found ${allSolutions.length} solutions.`);
            updateBoardWithSolution(allSolutions[0]);

            if (allSolutions.length > 1) {
                document.getElementById('solution-status').style.display = 'block';
                updateStatusText();
            } else {
                document.getElementById('solution-status').style.display = 'none';
            }
        }
    } catch (err) {
        console.error("WASM solve failed:", err);
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerText = "Solve";
        }
    }
}

window.switchSolution = function (direction) {
    currentSolIdx += direction;
    if (currentSolIdx < 0) currentSolIdx = allSolutions.length - 1;
    if (currentSolIdx >= allSolutions.length) currentSolIdx = 0;

    updateBoardWithSolution(allSolutions[currentSolIdx]);
    updateStatusText();
}

function updateStatusText() {
    document.getElementById('solution-index').innerText = `Solution ${currentSolIdx + 1} of ${allSolutions.length}`;
}

function getGridData() {
    const cells = document.querySelectorAll('.input-cell');
    let gridData = [];
    cells.forEach((cell, index) => {
        let actualIndex = parseInt(cell.id.split('-')[1]);
        let pIdx = getGlobalIdx(actualIndex);
        let status = "none";
        if (cell.classList.contains("green")) status = "green";
        else if (cell.classList.contains("yellow")) status = "yellow";
        gridData[pIdx] = { index: pIdx, letter: cell.value, status: status };
    });
    return gridData;
}

function updateBoardWithSolution(solutionStr) {
    const cells = document.querySelectorAll('.input-cell');
    cells.forEach((cell) => {
        const index = parseInt(cell.id.split('-')[1]);
        const pIdx = getGlobalIdx(index);
        cell.value = solutionStr[pIdx].toUpperCase();
        cell.classList.remove("yellow");
        cell.classList.add("green");
    });
}

window.clearGrid = function () {
    document.querySelectorAll('.input-cell').forEach(cell => {
        cell.value = '';
        cell.classList.remove("yellow", "green");
    });
    allSolutions = [];
    document.getElementById('solution-status').style.display = 'none';
}

function validateGridInput() {
    const cells = document.querySelectorAll('.input-cell');
    for (let cell of cells) {
        if (cell.value.trim() === '') {
            alert("Please fill in all letter cells!");
            return false;
        }
    }
    return true;
}

// Input handling
document.addEventListener('input', (e) => {
    if (e.target.classList.contains('input-cell')) {
        e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
    }
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('input-cell')) {
        const cell = e.target;
        if (cell.classList.contains('green')) cell.classList.remove('green');
        else if (cell.classList.contains('yellow')) {
            cell.classList.remove('yellow');
            cell.classList.add('green');
        }
        else cell.classList.add('yellow');
    }
});