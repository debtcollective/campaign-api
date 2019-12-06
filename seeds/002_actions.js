exports.seed = function (knex) {
  return knex('actions').insert([
    {
      campaign_id: 1,
      title: 'Add your debt data',
      description:
        'Data dues action where we request user about their debt data',
      type: 'data-dues',
      slug: 'data-dues'
    },
    {
      campaign_id: 1,
      title: 'Contact Your Rep',
      description: 'Contact Your Rep using this form',
      type: 'action',
      slug: 'contact-your-rep'
    },
    {
      campaign_id: 1,
      title: 'Start a Campus Group',
      description: 'Start a Campus Group',
      type: 'link',
      slug: 'start-a-campus-group'
    },
    {
      campaign_id: 1,
      title: 'Join A Direct Action Team',
      description: 'Join A Direct Action Team',
      type: 'link',
      slug: 'join-a-direct-action-team'
    },
    {
      campaign_id: 1,
      title: 'Join Our Social Media Team',
      description: 'Join Our Social Media Team',
      type: 'link',
      slug: 'join-our-social-media-team'
    },
    {
      campaign_id: 1,
      title: 'Contribute Your Ideas',
      description: 'Contribute Your Ideas',
      type: 'link',
      slug: 'contribute-your-ideas'
    }
  ])
}
