const path = require('path')
const express = require('express')
const xss = require('xss')
const PatronsService = require('./patrons-service')

const patronsRouter = express.Router()
const jsonParser = express.json()

const serializePatron = patron => ({
  patronId: patron.id,
  first: xss(patron.first),
  last: xss(patron.last),
})

patronsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    PatronsService.getAllPatrons(knexInstance)
      .then(patrons => {
        res.json(patrons.map(serializePatron))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { first, last } = req.body
    const newPatron = { first, last }

    for (const [key, value] of Object.entries(newPatron)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    PatronsService.insertPatron(
      req.app.get('db'),
      newPatron
    )
      .then(patron => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${patron.id}`))
          .json(serializePatron(patron))
      })
      .catch(next)
  })

  patronsRouter
  .route('/:patron_id')
  .all((req, res, next) => {
    PatronsService.getById(
      req.app.get('db'),
      req.params.patron_id
    )
      .then(patron => {
        if (!patron) {
          return res.status(404).json({
            error: { message: `Patron doesn't exist` }
          })
        }
        res.patron = patron
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializePatron(res.patron))
  })
  .delete((req, res, next) => {
    PatronsService.deletePatron(
      req.app.get('db'),
      req.params.patron_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { first, last } = req.body
    const patronToUpdate = { first, last }

    const numberOfValues = Object.values(patronToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either a title, page count, genre or ISBN`
        }
      })

      PatronsService.updatePatron(
      req.app.get('db'),
      req.params.patron_id,
      patronToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = patronsRouter