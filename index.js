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
  .then(() => 
     Recipe.create({
      title: "Tortilla de patata",
      level: "Easy Peasy",
      ingredients: ["potatoes", "eggs", "onion", "olive oil"],
      cuisine: "Spanish",
      dishType: "main_course",
      image: "https://images.media-allrecipes.com/images/75131.jpg",
      duration: 30,
      creator: "Chef Pepe",
    })
  )
  .then((recipe) => console.log(recipe))
  .then(() => {

    return Recipe.insertMany(data);
  })
  .then((recipes) => {
    recipes.forEach((data) => console.log(data.title));
    return Recipe.findOneAndUpdate(
      { title: "Rigatoni alla Genovese" },
      { duration: 100 },
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
