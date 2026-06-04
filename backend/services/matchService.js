const normalize = (s) => s.toLowerCase().trim();
const computeScore = (viewer, target) => {
  const vHave = viewer.skillsHave.map(normalize);
  const vWant = viewer.skillsWant.map(normalize);
  const tHave = target.skillsHave.map(normalize);
  const tWant = target.skillsWant.map(normalize);
  const viewerGets = vWant.filter(s => tHave.includes(s)).length;
  const targetGets = vHave.filter(s => tWant.includes(s)).length;
  const totalPossible = Math.max(vWant.length + vHave.length, 1);
  const overlap = ((viewerGets + targetGets) / totalPossible) * 70;
  const rating = target.rating > 0 ? (target.rating / 5) * 20 : 0;
  const activity = Math.min(target.swapsCount, 10) * 1;
  return Math.round(Math.min(overlap + rating + activity, 100));
};
module.exports = { computeScore };