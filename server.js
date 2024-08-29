const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.get('/get-recipes', async (req, res) => {
    const ingredients = req.query.ingredients;

    // Log the query parameters and ingredients
    console.log('Query Parameters:', req.query);
    console.log('Ingredients received:', ingredients);

    if (!ingredients) {
        return res.status(400).json({ error: 'No ingredients provided' });
    }

    // Convert to array if it's not already an array
    const ingredientsArray = Array.isArray(ingredients) ? ingredients : [ingredients];
    console.log('Ingredients Array:', ingredientsArray);

    try {
        // Fetch recipes from RapidAPI
        rapidApiOptions.params.ingredients = ingredientsArray.join(',');
        const response = await axios.request(rapidApiOptions);

        const filteredRecipes = response.data; // Adjust based on API response structure

        console.log('Filtered Recipes:', filteredRecipes);

        if (filteredRecipes.length === 0) {
            return res.status(404).json({ message: 'No recipes found for the provided ingredients' });
        }

        res.json(filteredRecipes);
    } catch (error) {
        console.error("Error fetching recipes from RapidAPI:", error);
        res.status(500).json({ error: 'An error occurred while fetching recipes' });
    }
});


// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
