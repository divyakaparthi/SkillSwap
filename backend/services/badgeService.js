const assignBadges = (user) => {
  const badges = [];
  if (user.swapsCount >= 1) badges.push('First Swap');
  if (user.swapsCount >= 5) badges.push('Active Learner');
  if (user.swapsCount >= 10) badges.push('Skill Champion');
  if (user.rating >= 4.5 && user.reviewCount >= 3) badges.push('Top Mentor');
  user.badges = badges;
};
module.exports = { assignBadges };