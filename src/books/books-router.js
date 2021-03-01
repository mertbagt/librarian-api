const path = require('path')
const express = require('express')
const xss = require('xss')
const BooksService = require('./books-service')

const booksRouter = express.Router()
const jsonParser = express.json()

const serializeBook = book => ({
  bookId: book.id,
  title: xss(book.title),
  pageCount: xss(book.page_count),
  genre: xss(book.genre),
  ISBN: xss(book.isbn),
})

booksRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    BooksService.getAllBooks(knexInstance)
      .then(books => {
        res.json(books.map(serializeBook))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { title, page_count, genre, isbn } = req.body
    const newBook = { title, page_count, genre, isbn }

    for (const [key, value] of Object.entries(newBook)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    BooksService.insertBook(
      req.app.get('db'),
      newBook
    )
      .then(book => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${book.id}`))
          .json(serializeBook(book))
      })
      .catch(next)
  })

  booksRouter
  .route('/:book_id')
  .all((req, res, next) => {
    BooksService.getById(
      req.app.get('db'),
      req.params.book_id
    )
      .then(book => {
        if (!book) {
          return res.status(404).json({
            error: { message: `Book doesn't exist` }
          })
        }
        res.book = book
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeBook(res.book))
  })
  .delete((req, res, next) => {
    BooksService.deleteBook(
      req.app.get('db'),
      req.params.book_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { title, page_count, genre, isbn } = req.body
    const bookToUpdate = { title, page_count, genre, isbn }

    const numberOfValues = Object.values(bookToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either a title, page count, genre or ISBN`
        }
      })

      BooksService.updateBook(
      req.app.get('db'),
      req.params.book_id,
      bookToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = booksRouter