export const randomInt = ([min, max]) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const randomPct = (pct) => {
  return randomInt([0,100]) < pct
}
