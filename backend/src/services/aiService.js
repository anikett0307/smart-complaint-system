// Rule-based priority (single source of truth)
const getRuleBasedPriority = (title = '', description = '') => {
  const text = `${title} ${description}`.toLowerCase();

  const highKeywords = [
    'accident',
    'injury',
    'injured',
    'death',
    'fire',
    'explosion',
    'gas leak',
    'electrocution',
    'violence',
    'crime',
    'emergency',
    'ambulance'
  ];

  const mediumKeywords = [
    'broken',
    'damaged',
    'blocked',
    'not working',
    'pothole',
    'crack',
    'leak',
    'outage',
    'pollution',
    'noise'
  ];

  if (highKeywords.some(k => text.includes(k))) {
    return 'HIGH';
  }

  if (mediumKeywords.some(k => text.includes(k))) {
    return 'MEDIUM';
  }

  return 'LOW';
};

module.exports = {
  getRuleBasedPriority
};
