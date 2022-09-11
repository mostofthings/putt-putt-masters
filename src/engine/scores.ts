import {drawEngine} from "@/core/draw-engine";
import {Score} from "@/engine/score";

class Scores {
  key = 'd-golf-2k';

  constructor() {
  }

  get scorecard() {
    return JSON.parse(localStorage.getItem(this.key)!) as Score[];
  }

  set scorecard(scorecard) {
    localStorage.setItem(this.key, JSON.stringify(scorecard));
  }

  resetScores(pars: number[]) {
    this.scorecard = getEmptyScores(pars)
  }

  getLevelScore(levelNumber: number): number {
    const matchingScore = this.scorecard.find((cardScore) => cardScore.hole === levelNumber);
    return matchingScore!.score;
  }

  setLevelScore(levelNumber: number, newScore: number) {
    const scorecard = this.scorecard
    const matchingScore = scorecard.find(cardScore => cardScore.hole === levelNumber)
    matchingScore!.score = newScore;
    this.scorecard = scorecard;
  }

  drawScorecard() {
    let yOffset = 170;
    drawEngine.drawText('Par', 22, 420, yOffset)
    drawEngine.drawText('Score', 22, 620, yOffset)
    // @ts-ignore
    this.scorecard.forEach(levelScore => {
      yOffset += 30
      const {score, hole, par} = levelScore;
      drawEngine.context.rect(200, 200 + (yOffset), 250, 25)
      drawEngine.drawText(`Hole ${hole}`, 22, 220, yOffset + 2)
      drawEngine.drawText(par.toString(), 22, 420, yOffset + 2)
      drawEngine.drawText(score === -1 ? '' : score.toString(), 22, 620, yOffset + 2)
    })
  }

  get nextHole() {
    return this.scorecard
      .filter(score => score.score === -1)
      .map(score => score.hole)
      .reduce((prev, current) => {
        return prev < current ? prev : current;
    })
  }
}

function getEmptyScores(pars: number[]) {
  return pars.map((par, index) => {
    return {
      par,
      hole: index + 1,
      score: -1,
    }
  })
}

export const scores = new Scores();
