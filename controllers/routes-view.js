const router = require("express").Router();
const { response } = require("express");
const { User, Category, Book, ShoppingCart } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", (req, res) => {
  res.render("homepage", { loggedIn: req.session.loggedIn });
});

// LOGIN
router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

// DISPLAY ALL Categories
router.get("/category", (req, res) => {
  Category.findAll({
    attributes: ["id", "category_name", "category_image"],
  })
    .then((dbCategoryData) => {
      const categories = dbCategoryData.map((category) =>
        category.get({ plain: true })
      );
      res.render("category", { categories, loggedIn: req.session.loggedIn });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// DISPLAY SINGLE Categories
router.get("/category/:id", (req, res) => {
  console.log(req.params.id);
  Category.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "category_name"],
    include: [
      {
        model: Book,
        attributes: ["id", "book_name", "price", "image_url"],
      },
    ],
  })
    .then((dbCategoryData) => {
      if (!dbCategoryData) {
        res
          .status(404)
          .json({ message: "No Category with that id was found." });
        return;
      }
      const category = dbCategoryData.get({ plain: true });
      res.render("single-category", {
        category,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// DISPLAY ALL Books
router.get("/book", (req, res) => {
  Book.findAll({
    attributes: ["id", "book_name", "price", "image_url"],
  })
    .then((dbBookData) => {
      const books = dbBookData.map((book) => book.get({ plain: true }));
      res.render("book", { books, loggedIn: req.session.loggedIn });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// DISPLAY Single book
router.get("/book/:id", (req, res) => {
  console.log(req.params.id);
  Book.findOne({
    where: {
      id: req.params.id,
    },
    attributes: [
      "id",
      "book_name",
      "author_name",
      "description",
      "category_id",
      "price",
      "image_url",
      "review",
    ],
    include: [
      {
        model: Category,
        attributes: ["id", "category_name"],
      },
    ],
  })
    .then((dbBookData) => {
      if (!dbBookData) {
        res.status(404).json({ message: "No Book with that id was found." });
        return;
      }
      const book = dbBookData.get({ plain: true });
      console.log(book);
      res.render("single-book", { book, loggedIn: req.session.loggedIn });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// DISPLAY ALL Shopping Carts of All Users
router.get("/shoppingcart", async (req, res) => {
  await ShoppingCart.findAll({
    where:{user_id: req.session.user_id},
    attributes: ["id", "user_id", "book_id"],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
      {
        model: Book,
        attributes: ["book_name", "price"],
      },
    ],
  }).then((dbShoppingCartData) => {
    const carts = dbShoppingCartData.map((cartItem) =>
      cartItem.get({ plain: true })
    );
    res.render("shoppingcart", { carts, loggedIn: true });
  });
});

// DISPLAY ALL Shopping Carts of loggedIn user
router.get("/:user_id", withAuth, async (req, res) => {
  try {
    await ShoppingCart.findAll({
      where: {
        user_id: req.session.user_id,
      },
      attributes: ["id", "user_id", "book_id"],
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Book,
          attributes: ["book_name", "price"],
        },
      ],
    }).then((dbShoppingCartData) => {
      if (!dbShoppingCartData) {
        res
          .status(404)
          .json({ message: "No ShoppingCart data available for this userId." });
        return;
      }
      const carts = dbShoppingCartData.map((cartItem) => {
        cartItem.get({ plain: true });
      });
      res.render("shoppingcart", { carts, loggedIn: true });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
