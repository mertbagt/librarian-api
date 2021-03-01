const PatronsService = {
    getAllPatrons(knex) {
      return knex.select('*').from('libra_patrons')
    },
  
    insertPatron(knex, newPatron) {
      return knex
        .insert(newPatron)
        .into('libra_patrons')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('libra_patrons')
        .select('*')
        .where('id', id)
        .first()
    },
  
    deletePatron(knex, id) {
      return knex('libra_patrons')
        .where({ id })
        .delete()
    },
  
    updatePatron(knex, id, newPatronFields) {
      return knex('libra_patrons')
        .where({ id })
        .update(newPatronFields)
    },
  }
  
module.exports = PatronsService