import * as cors from "cors"
import * as bodyParser from "body-parser";
import * as express from "express";

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

let grid: string[][] = [];

let biasCharacter: string = "";

function generateRandomGrid() {
  const characters = "abcdefghijklmnopqrstuvwxyz";
  grid = [];
  for (let i = 0; i < 10; i++) {
    const row = [];
    for (let j = 0; j < 10; j++) {
      const randomChar =
        characters[Math.floor(Math.random() * characters.length)];
      row.push(randomChar);
    }
    grid.push(row);
  }
}

app.get("/generate-grid", (req, res) => {
  generateRandomGrid();
  res.json(grid);
});

app.get("/calculate-code", (req, res) => {
  const now = new Date();
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const gridChar1 = grid[3][6];
  const gridChar2 = grid[6][3];
  const gridCounts = countGridCharacters();

  let code = parseInt(seconds, 10);
  code += gridCounts[gridChar1] || 0;
  code += gridCounts[gridChar2] || 0;

  if (code > 9) {
    code = code / Math.floor(code / 10);
  }

  res.json({ code: code.toFixed(0) });
});

function countGridCharacters() {
  const gridCounts: { [char: string]: number } = {};
  for (const row of grid) {
    for (const char of row) {
      if (gridCounts[char]) {
        gridCounts[char]++;
      } else {
        gridCounts[char] = 1;
      }
    }
  }
  return gridCounts;
}

app.post("/set-bias", (req, res) => {
  const { character } = req.body;
  if (character && character.match(/^[a-z]$/)) {
    biasCharacter = character;
    res.json({ message: "Bias character set successfully" });
  } else {
    res.status(400).json({ error: "Invalid bias character" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
