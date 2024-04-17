const BookInstance = require('../models/bookinstance');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Book = require('../models/book');

// Display list of all BookInstances.
exports.bookinstance_list = asyncHandler(async (req, res, next) => {
  // res.send('NOT IMPLEMENTED: BookInstance list');
  const allBookInstance = await BookInstance.find().populate('book').exec();

  res.render('bookinstance_list', {
    title: 'Book Instance List',
    bookinstance_list: allBookInstance,
  });
});

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = asyncHandler(async (req, res, next) => {
  // res.send(`NOT IMPLEMENTED: BookInstance detail: ${req.params.id}`);
  const bookInstance = await BookInstance.findById(req.params.id)
    .populate('book')
    .exec();

  if (bookInstance === null) {
    // No results.
    const err = new Error('Book copy not found');
    err.status = 404;
    return next(err);
  }

  res.render('bookinstance_detail', {
    title: 'Book:',
    bookinstance: bookInstance,
  });
});

// Display BookInstance create form on GET.
exports.bookinstance_create_get = asyncHandler(async (req, res, next) => {
  // res.send('NOT IMPLEMENTED: BookInstance create GET');
  const allBooks = await Book.find({}, 'title').sort({ title: 1 }).exec();

  res.render('bookinstance_form', {
    title: 'Create BookInstance',
    book_list: allBooks,
  });
});

// Display BookInstance create on POST
exports.bookinstance_create_post = [
  // Validate and sanitize fields.
  body('book', 'Book must be specified').trim().isLength({ min: 1 }).escape(),
  body('imprint', 'Imprint must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('status').escape(),
  body('due_back', 'Invalid date')
    .optional({ values: 'falsy' })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // res.send('NOT IMPLEMENTED: BookInstance create POST');
    const errors = validationResult(req);

    // Create a BookInstance object with escaped and trimmed data.
    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      // There are errors
      // Render form again with sanitized values and error message
      const allBooks = await Book.find({}, 'title').sort({ title: 1 }).exec();

      res.render('bookinstance_form', {
        title: 'Create BookInstance',
        book_list: allBooks,
        selected_book: bookInstance.book._id,
        errors: errors.array(),
        bookinstance: bookInstance,
      });
    } else {
      // Data from form is valid
      await bookInstance.save();
      res.redirect(bookInstance.url);
    }
  }),
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = asyncHandler(async (req, res, next) => {
  // res.send('NOT IMPLEMENTED: BookInstance delete GET');
  // Get details of bookinstance
  const bookInstance = await BookInstance.findById(req.params.id)
    .populate('book')
    .exec();

  if (bookInstance === null) {
    // No result
    res.redirect('/catalog/bookinstances');
  }

  res.render('bookinstance_delete', {
    title: 'Delete Book Instance',
    bookInstance: bookInstance,
  });
});

// Display BookInstance delete form on POST.
exports.bookinstance_delete_post = asyncHandler(async (req, res, next) => {
  // res.send('NOT IMPLEMENTED: BookInstance delete POST');
  await BookInstance.findByIdAndDelete(req.params.id);
  res.redirect('/catalog/bookinstances');
});

// Display BookInstance update form on GET.
exports.bookinstance_update_get = asyncHandler(async (req, res, next) => {
  // res.send('NOT IMPLEMENTED: BookInstance update GET');
  const [bookinstance, allBooks] = await Promise.all([
    BookInstance.findById(req.params.id).populate('book').exec(),
    Book.find({}, 'title').sort({ title: 1 }).exec(),
  ]);

  if (bookinstance === null) {
    const err = new Error('BookInstance not found');
    err.status = 404;
    return next(err);
  }

  console.log(
    `Line 131 Here is due_back_formated: ${bookinstance.due_back_formated}`
  );

  res.render('bookinstance_form', {
    title: 'Update BookInstance',
    selected_book: bookinstance.book._id,
    bookinstance: bookinstance,
    book_list: allBooks,
  });
});

// Display BookInstance update form on POST.
exports.bookinstance_update_post = [
  // Validate and sanitize fields.
  body('book', 'Book must be specified').trim().isLength({ min: 1 }).escape(),
  body('imprint', 'Imprint must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('status').escape(),
  body('due_back', 'Invalid date')
    .optional({ values: 'falsy' })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // res.send('NOT IMPLEMENTED: BookInstance create POST');
    const errors = validationResult(req);

    // Create a BookInstance object with escaped and trimmed data.
    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors
      // Render form again with sanitized values and error message
      const allBooks = await Book.find({}, 'title').exec();

      res.render('bookinstance_form', {
        title: 'Update BookInstance',
        book_list: allBooks,
        selected_book: bookInstance.book._id,
        errors: errors.array(),
        bookinstance: bookInstance,
      });
      return;
    } else {
      // Data form is valid
      console.log(
        `Controller: ${bookInstance.due_back} and ${req.body.due_back}`
      );
      await BookInstance.findByIdAndUpdate(req.params.id, bookInstance, {});
      res.redirect(bookInstance.url);
    }
  }),
];
