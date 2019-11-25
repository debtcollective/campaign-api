exports.seed = function(knex) {
  return knex('campaigns').insert([
    { id: 1, slug: 'end-student-debt', name: 'End Student Debt' }
  ])
}
