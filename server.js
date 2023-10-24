"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cors = require("cors");
var bodyParser = require("body-parser");
var express = require("express");
var app = express();
var port = 3001;
app.use(cors());
app.use(bodyParser.json());
var grid = [];
var biasCharacter = "";
function generateRandomGrid() {
    var characters = "abcdefghijklmnopqrstuvwxyz";
    grid = [];
    for (var i = 0; i < 10; i++) {
        var row = [];
        for (var j = 0; j < 10; j++) {
            var randomChar = characters[Math.floor(Math.random() * characters.length)];
            row.push(randomChar);
        }
        grid.push(row);
    }
}
app.get("/generate-grid", function (req, res) {
    generateRandomGrid();
    res.json(grid);
});
app.get("/calculate-code", function (req, res) {
    var now = new Date();
    var seconds = now.getSeconds().toString().padStart(2, "0");
    var gridChar1 = grid[3][6];
    var gridChar2 = grid[6][3];
    var gridCounts = countGridCharacters();
    var code = parseInt(seconds, 10);
    code += gridCounts[gridChar1] || 0;
    code += gridCounts[gridChar2] || 0;
    if (code > 9) {
        code = code / Math.floor(code / 10);
    }
    res.json({ code: code.toFixed(0) });
});
function countGridCharacters() {
    var gridCounts = {};
    for (var _i = 0, grid_1 = grid; _i < grid_1.length; _i++) {
        var row = grid_1[_i];
        for (var _a = 0, row_1 = row; _a < row_1.length; _a++) {
            var char = row_1[_a];
            if (gridCounts[char]) {
                gridCounts[char]++;
            }
            else {
                gridCounts[char] = 1;
            }
        }
    }
    return gridCounts;
}
app.post("/set-bias", function (req, res) {
    var character = req.body.character;
    if (character && character.match(/^[a-z]$/)) {
        biasCharacter = character;
        res.json({ message: "Bias character set successfully" });
    }
    else {
        res.status(400).json({ error: "Invalid bias character" });
    }
});
app.listen(port, function () {
    console.log("Server is running on port ".concat(port));
});
