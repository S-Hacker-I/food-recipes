const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Use bodyParser to parse JSON requests
app.use(bodyParser.json());

// Load recipes from JSON file
const recipesFile = path.join(__dirname, 'recipes.json');
let recipes = [];

fs.readFile(recipesFile, 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading recipes file:", err);
        return;
    }
    recipes = JSON.parse(data);
});

// Route to get recipes by ingredients
app.post('/get-recipes', (req, res) => {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
        return res.status(400).json({ error: 'Invalid ingredients' });
    }

    const filteredRecipes = recipes.filter(recipe => 
        recipe.ingredients.every(ingredient => ingredients.includes(ingredient))
    );

    res.json(filteredRecipes);
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
