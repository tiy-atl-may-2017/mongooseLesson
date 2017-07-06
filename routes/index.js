const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.Promise = require("bluebird");
mongoose.connect("mongodb://localhost:27017/goose");

const recipeSchema = new Schema({
  name: { type: String, required: true, unique: true },
  prepTime: {type: Number, min: [1, 'Some prep time must be considered']},
  cookTime: Number,
  ingredients: [{
    amount: { type: Number, required: true, default: 1 },
    measure: { type: String, lowercase: true, trim: true },
    ingredient: { type: String, required: true }
  }],
  steps: [String],
  source: {type: String}
});

recipeSchema.virtual('totalTime').get(function() {
  return (this.prepTime || 0) + (this.cookTime || 0);
});

recipeSchema.virtual('allSteps')
  .get(() => {
      return this.steps.join("\n");
  })
  .set((val) => {
      this.steps = val.trim().split("\n");
  });

const Recipe = mongoose.model("Recipe", recipeSchema);

router.get('/', function(req, res) {

  let pancakes = new Recipe({
    name: "Pancakes",
    cookTime: 10,
    prepTime: 10,
    source: "Grandma"
  });

  let steps = `
    Grease a pan.
    Place batter on pan.
    Cook until golden brown.
  `;
  pancakes.allSteps = steps;

  console.log("LOGGGIN: ", pancakes.allSteps);

  res.send('done');
  //
  // pancakes.save().then(function(recipe) {
  //   res.send("Done");
  // }).catch(function(err) {
  //     res.send("Errors");
  // });

  // Recipe.find({cookTime: {$gt: 15, $lt: 60}}).then(function(recipes) {
  //
  //   res.render("index", {recipes: recipes});
  // }).catch(function(err) {
  //   console.log(err);
  // });

  // Recipe.find({source: "Grandma"})
  // .where('cookTime').lt('30')
  // .limit(3)
  // .sort("-cookTime")
  // .select("name cookTime")
  // .then(function(recipes) {
  //   console.log(recipes);
  //   res.send("done")
  // }).catch(function(err){
  //   console.log(err);
  // });

  // Recipe.updateMany(
  //   {source: "Grandma"},
  //   {$push: {steps: "Call Grandma and tell her how it was."}
  // }).then(function(recipe) {
  //   console.log();
  //   res.send('done');
  // });




});

module.exports = router;



















// a;sdkfj
