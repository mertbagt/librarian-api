const BooksCheckedOutService = {
    getAllChecks(knex) {
      return knex.select('*').from('libra_checks')
    },
  
    insertCheck(knex, newCheck) {
      return knex
        .insert(newCheck)
        .into('libra_checks')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('libra_checks')
        .select('*')
        .where('id', id)
        .first()
    },
  
    deleteCheck(knex, id) {
      return knex('libra_checks')
        .where({ id })
        .delete()
    },
  
    updateCheck(knex, id, newCheckFields) {
      return knex('libra_checks')
        .where({ id })
        .update(newCheckFields)
    },
  }
  
module.exports = BooksCheckedOutService