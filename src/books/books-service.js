const BooksService = {
    getAllBooks(knex) {
      return knex.select('*').from('libra_books')
    },
  
    insertBook(knex, newBook) {
      return knex
        .insert(newBook)
        .into('libra_books')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('libra_books')
        .select('*')
        .where('id', id)
        .first()
    },
  
    deleteBook(knex, id) {
      return knex('libra_books')
        .where({ id })
        .delete()
    },
  
    updateBook(knex, id, newBookFields) {
      return knex('libra_books')
        .where({ id })
        .update(newBookFields)
    },
  }
  
module.exports = BooksService