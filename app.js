var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var {
  addIngredient,
  getIngredients,
  getIngredientsByName
} = require("./routes/ingredient");
var {
  addRecipe,
  editRecipe,
  removeRecipe,
  getRecipes,
  getByIngredients
} = require("./routes/recipes");

var { login, register } = require("./routes/auth");
var index = require("./routes/index");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", index);

app.use("/addIngredient", addIngredient);
app.use("/ingredients", getIngredients);
app.use("/ingredientsByName", getIngredientsByName);

app.use("/addRecipe", addRecipe);
app.use("/editRecipe", editRecipe);
app.use("/removeRecipe", removeRecipe);
app.use("/recipes", getRecipes);
app.use("/getByIngredients", getByIngredients);

app.use("/login", login);
app.use("/register", register);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
