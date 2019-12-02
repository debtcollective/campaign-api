exports.seed = function (knex) {
  return knex('actions').insert([
    {
      id: 1,
      campaign_id: 1,
      title: 'Add your debt data',
      description:
        'Data dues action where we request user about their debt data',
      type: 'data-dues',
      slug: 'data-dues',
      config: {}
    }
  ])
}
