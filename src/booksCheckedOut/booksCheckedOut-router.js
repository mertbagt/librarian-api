const path = require('path')
const express = require('express')
const xss = require('xss')
const BooksCheckedOutService = require('./booksCheckedOut-service')

const booksCheckedOutRouter = express.Router()
const jsonParser = express.json()

const serializeCheck = check => ({
    checkId: check.id,
    patronId: check.patron_id,
    bookId: check.book_id,
})

booksCheckedOutRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    BooksCheckedOutService.getAllChecks(knexInstance)
      .then(checks => {
        res.json(checks.map(serializeCheck))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { patron_id, book_id } = req.body
    const newCheck = { patron_id, book_id }

    for (const [key, value] of Object.entries(newCheck)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    BooksCheckedOutService.insertCheck(
      req.app.get('db'),
      newCheck
    )
      .then(check => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${check.id}`))
          .json(serializeCheck(check))
      })
      .catch(next)
  })

  booksCheckedOutRouter
  .route('/:check_id')
  .all((req, res, next) => {
    BooksCheckedOutService.getById(
      req.app.get('db'),
      req.params.check_id
    )
      .then(check => {
        if (!check) {
          return res.status(404).json({
            error: { message: `Checked Out Assignment doesn't exist` }
          })
        }
        res.check = check
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeCheck(res.check))
  })
  .delete((req, res, next) => {
    BooksCheckedOutService.deleteCheck(
      req.app.get('db'),
      req.params.check_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { patron_id, book_id } = req.body
    const checkToUpdate = { patron_id, book_id }

    const numberOfValues = Object.values(checkToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either a 'Patron ID' or a 'Book ID'`
        }
      })

      BooksCheckedOutService.updateCheck(
      req.app.get('db'),
      req.params.check_id,
      checkToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = booksCheckedOutRouter