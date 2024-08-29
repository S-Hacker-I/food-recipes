const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

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
app.get('/get-recipes', (req, res) => {
    const ingredients = req.query.ingredients;

    if (!ingredients) {
        return res.status(400).json({ error: 'No ingredients provided' });
    }

    const ingredientsArray = Array.isArray(ingredients) ? ingredients : [ingredients];
    const filteredRecipes = recipes.filter(recipe =>
        recipe.ingredients.every(ingredient => ingredientsArray.includes(ingredient))
    );

    res.json(filteredRecipes);
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
