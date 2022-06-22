// import models
const Category = require("./Category");
const User = require("./User");
// const Book = require("./Book");
// const UserCart = require("./UserCart");

// // Book belongsTo Category
// Book.belongsTo(Category, {
//   foreignKey: "category_id",
// });

// // Categories have many Books
// Category.hasMany(Book, {
//   foreignKey: "category_id",
// });

// // Books belongToMany Users (through UserCart)

// Book.belongsToMany(User, {
//   through: UserCart,
//   foreignKey: "book_id",
// });

// // Users belongToMany Books (through UserCart)

// User.belongsToMany(Book, {
//   through: UserCart,
//   foreignKey: "user_id",
// });

module.exports = { Category, User }; // need to add other models