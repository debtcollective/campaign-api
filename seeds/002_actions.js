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
      type: 'link',
      slug: 'contact-your-rep',
      config: {
        href:
          'https://community.debtcollective.org/t/organizing-to-win-college-for-all/2887'
      }
    },
    {
      campaign_id: 1,
      title: 'Strike on Campus',
      description: 'Strike on Campus',
      type: 'link',
      slug: 'strike-on-campus',
      config: {
        href:
          'https://community.debtcollective.org/t/organizing-to-win-college-for-all-on-campus/3312'
      }
    },
    {
      campaign_id: 1,
      title: 'Join A Direct Action Team',
      description: 'Join A Direct Action Team',
      type: 'link',
      slug: 'join-a-direct-action-team',
      config: {
        href:
          'https://community.debtcollective.org/t/college-for-all-direct-action-team/3467'
      }
    },
    {
      campaign_id: 1,
      title: 'Join Our Social Media Team',
      description: 'Join Our Social Media Team',
      type: 'link',
      slug: 'join-our-social-media-team',
      config: {
        href:
          'https://community.debtcollective.org/t/college-for-all-social-media-team/3466'
      }
    },
    {
      campaign_id: 1,
      title: 'Contribute Your Ideas',
      description: 'Contribute Your Ideas',
      type: 'link',
      slug: 'contribute-your-ideas',
      config: {
        href:
          'https://community.debtcollective.org/t/contribute-your-ideas-to-the-college-for-all-campaign/3468'
      }
    },
    {
      campaign_id: 1,
      title: 'Volunteer with The Debt Collective',
      description: 'Volunteer with The Debt Collective',
      type: 'link',
      slug: 'volunteer-with-the-debt-collective',
      config: {
        href: 'https://volunteer.debtcollective.org'
      }
    }
  ])
}
