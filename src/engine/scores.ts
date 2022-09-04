
class Scores {
  key = 'd-golf-2k';

  constructor() {
  }

  get scorecard() {
    return JSON.parse(localStorage.getItem(this.key)!);
  }

  set scorecard(scorecard) {
    localStorage.setItem(this.key, JSON.stringify(scorecard));
  }

  resetScore(pars: number[]) {
    this.scorecard = getEmptyScores(pars)
  }

  getLevelScore(levelNumber: number): number {
    return this.scorecard[levelNumber].score;
  }

  setLevelScore(levelNumber: number, score: number) {
    const scorecard = this.scorecard;
    scorecard[levelNumber].score = score;
    this.scorecard = scorecard;
  }
}

function getEmptyScores(pars: number[]) {
  const emptyScores: { [levelNumber: string]: { par: number, score: number}} = {}
  pars.forEach((par, index) => emptyScores[index + 1] = {
    score: -1,
    par
  })
  return emptyScores;
}

export const scores = new Scores();
