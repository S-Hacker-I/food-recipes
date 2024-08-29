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
    try {
        recipes = JSON.parse(data);
    } catch (parseErr) {
        console.error("Error parsing recipes JSON:", parseErr);
    }
});

// Route to get recipes by ingredients
app.get('/get-recipes', (req, res) => {
    const ingredients = req.query.ingredients;

    if (!ingredients) {
        return res.status(400).json({ error: 'No ingredients provided' });
    }

    const ingredientsArray = Array.isArray(ingredients) ? ingredients : [ingredients];
    const filteredRecipes = recipes.filter(recipe =>
        ingredientsArray.every(ingredient => recipe.ingredients.includes(ingredient))
    );

    if (filteredRecipes.length === 0) {
        return res.status(404).json({ message: 'No recipes found for the provided ingredients' });
    }

    res.json(filteredRecipes);
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
