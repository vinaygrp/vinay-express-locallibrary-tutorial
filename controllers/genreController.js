const Genre = require('../models/genre');
const Book = require('../models/book');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// Display list of all Genres.
exports.genre_list = asyncHandler(async (req, res, next) => {
  // res.send('NOT IMPLEMENTED: Genre list');
  const allGenre = await Genre.find().sort({ name: 1 }).exec();
  res.render('genre_list', {
    title: 'Genre List',
    genre_list: allGenre,
  });
});

// Display detail page for a specific Genre.
exports.genre_detail = asyncHandler(async (req, res, next) => {
  // res.send(`NOT IMPLEMENTED: Genre detail: ${req.params.id}`);
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, 'title summary').exec(),
  ]);

  if (genre == null) {
    // no result
    const err = new Error('Genre not found');
    err.status = 404;
    return next(err);
  }

  res.render('genre_detail', {
    title: 'Genre Detail',
    genre: genre,
    genre_books: booksInGenre,
  });
});

// Display Genre create form on GET.
exports.genre_create_get = asyncHandler(async (req, res, next) => {
  // res.send('NOT IMPLEMENTED: Genre create GET');
  res.render('genre_form', { title: 'Create Genre' });
});

// Handle Genre create on POST.
exports.genre_create_post = [
  body('name', 'Genre name must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process requrie after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // res.send('NOT IMPLEMENTED: Genre create POST');
    const errors = validationResult(req);

    // Create a gnre object with escaped and trimmed data.
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error message.
      res.render('genre_form', {
        title: 'Create Genre',
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with sane name already exists.
      const genreExists = await Genre.findOne({ name: req.body.name })
        .collation({ locale: 'en', strength: 2 })
        .exec();
      if (genreExists) {
        res.redirect(genreExists.url);
      } else {
        await genre.save();
        res.redirect(genre.url);
      }
    }
  }),
];

// Display Genre delete form on GET.
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  // res.send('NOT IMPLEMENTED: Genre delete GET');
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, 'title summary').exec(),
  ]);

  if (genre === null) {
    // no result
    res.redirect('/catalog/genres');
  }

  res.render('genre_delete', {
    title: 'Delete Genre',
    genre: genre,
    genre_books: booksInGenre,
  });
});

// Display Genre delete form on POST.
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  // res.send('NOT IMPLEMENTED: Genre delete POST');
  // Get details of author and all their books (in parallel)
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, 'title summary').exec(),
  ]);

  if (booksInGenre.length > 0) {
    res.render('genre_delete', {
      title: 'Delete Genre',
      genre: genre,
      genre_books: booksInGenre,
    });
    return;
  } else {
    // Genre has no books. Delete object and redirect to the list of genre.
    await Genre.findByIdAndDelete(req.body.id);
    res.redirect('/catalog/genres');
  }
});

// Display Genre update form on GET.
exports.genre_update_get = asyncHandler(async (req, res, next) => {
  // res.send('NOT IMPLEMENTED: Genre update GET');
  const genre = await Genre.findById(req.params.id).exec();

  if (genre == null) {
    // no result
    const err = new Error('Genre not found');
    err.status = 404;
    return next(err);
  }

  res.render('genre_form', {
    title: 'Update Genre',
    genre: genre,
  });
});

// Display Genre update form on POST.
exports.genre_update_post = [
  body('name', 'Genre name must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process requrie after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // res.send('NOT IMPLEMENTED: Genre create POST');
    const errors = validationResult(req);

    // Create a gnre object with escaped and trimmed data.
    const genre = new Genre({
      name: req.body.name,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error message.
      res.render('genre_form', {
        title: 'Update Genre',
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with sane name already exists.
      const genreExists = await Genre.findOne({ name: req.body.name })
        .collation({ locale: 'en', strength: 2 })
        .exec();
      if (genreExists) {
        res.redirect(genreExists.url);
      } else {
        await Genre.findByIdAndUpdate(req.params.id, genre, {});
        res.redirect(genre.url);
      }
    }
  }),
];
