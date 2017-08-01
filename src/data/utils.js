export const findInArray = (sub, full) => {
  for (let i = 0; i < full.length; i++) {
    if (full[i][0] === sub[0] && full[i][1] === sub[1]) {
      return true
    }
  }
  return false
}
