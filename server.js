const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Load recipes from JSON file
const recipesFile = path.join(__dirname, 'recipes.json');
let recipes = [];

// Function to load recipes from file
function loadRecipes() {
    fs.readFile(recipesFile, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading recipes file:", err);
            return;
        }
        try {
            recipes = JSON.parse(data);
            console.log('Recipes loaded successfully:', recipes); // Log the loaded recipes
        } catch (parseErr) {
            console.error("Error parsing recipes JSON:", parseErr);
        }
    });
}

// Call the function to load recipes
loadRecipes();

// Route to get recipes by ingredients
app.get('/get-recipes', (req, res) => {
    const ingredients = req.query.ingredients;

    console.log('Query Parameters:', req.query); // Log the query parameters
    console.log('Ingredients received:', ingredients); // Log the ingredients received

    if (!ingredients) {
        return res.status(400).json({ error: 'No ingredients provided' });
    }

    const ingredientsArray = Array.isArray(ingredients) ? ingredients : [ingredients];
    console.log('Ingredients Array:', ingredientsArray); // Log the converted ingredients array

    const filteredRecipes = recipes.filter(recipe =>
        ingredientsArray.every(ingredient => recipe.ingredients.includes(ingredient))
    );

    console.log('Filtered Recipes:', filteredRecipes); // Log the filtered recipes

    if (filteredRecipes.length === 0) {
        return res.status(404).json({ message: 'No recipes found for the provided ingredients' });
    }

    res.json(filteredRecipes);
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
