const mongoose = require('mongoose');

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require('./models/Recipe.model');
// Import of the data from './data.json'
const data = require('./data.json');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/recipe-app';
mongoose.set(`strictQuery`, true);

// Connection to the database "recipe-app"
mongoose
  .connect(MONGODB_URI)
  .then(x => {
    console.log(`Connected to the database: "${x.connection.name}"`);
    // Before adding any recipes to the database, let's remove all existing ones
    return Recipe.deleteMany()
  })
  .then(() => {
    // Add a new recipe to the database
    const newRecipe = {
      title: "Asian Glazed Chicken Thighs",
      level: "Amateur Chef",
      ingredients: [
        "1/2 cup rice vinegar",
        "5 tablespoons honey",
        "1/3 cup soy sauce (such as Silver Swan®)",
        "1/4 cup Asian (toasted) sesame oil",
        "3 tablespoons Asian chili garlic sauce",
        "3 tablespoons minced garlic",
        "salt to taste",
        "8 skinless, boneless chicken thighs"
      ],
      cuisine: "Asian",
      dishType: "main_course",
      image: "https://images.media-allrecipes.com/userphotos/720x405/815964.jpg",
      duration: 40,
      creator: "Chef LePapu"
    };

    return Recipe.create(newRecipe);
  })
  .then(recipe => {
    // Log the title of the newly inserted recipe
    console.log(`Recipe created: ${recipe.title}`);
  })
  .then(() => {

    return Recipe.insertMany(data);
  })
  .then(recipes => {
    recipes.forEach(recipe => console.log(`Recipe created: ${recipe.title}`));
    return Recipe.findOneAndUpdate(
      { title: "Rigatoni alla Genovese" },
      { duration: 100 },
      { new: true }
    );
  })
  .then(updatedRecipe => {
    if (updatedRecipe) {
      console.log(`Succesfully updated duration for ${updatedRecipe.title} to ${updatedRecipe.duration} minutes`);
    } else {
      console.log(`recipe not found`);
    }
    return Recipe.deleteOne({title: "Carrot Cake"});
  })
  .then(deleteResult => {
    if (deleteResult.deletedCount > 0) {
      console.log(`Successfully deleted the "carrot Cake" recipe`);
    } else {
      console.log(`Recipe "Carrot Cake" not found`);
    }
    return mongoose.disconnect();
  })
  .then(() => {
    console.log(`Database connection closed`);
  })
  .catch(error => {
    console.error('Error connecting to the database', error);
  });
