import {drawEngine} from "@/core/draw-engine";
import {Score} from "@/engine/score";

class Scores {
  key = 'd-golf-2k';

  constructor() {
  }

  get scorecard() {
    return JSON.parse(window.localStorage.getItem(this.key)!) as Score[];
  }

  set scorecard(scorecard) {
    window.localStorage.setItem(this.key, JSON.stringify(scorecard));
  }

  resetScores(pars: number[]) {
    this.scorecard = this.getEmptyScores(pars)
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
    let yOffset = 20;
    const halfWidth = drawEngine.width /2
    const xOffsets = [halfWidth -300, halfWidth - 100, halfWidth + 100];
    drawEngine.drawText('Par', 22, xOffsets[1], yOffset)
    drawEngine.drawText('Score', 22, xOffsets[2], yOffset)

    this.scorecard.forEach(levelScore => {
      yOffset += 24
      const {score, hole, par} = levelScore;
      drawEngine.context.strokeStyle = 'white';
      drawEngine.context.lineWidth = 3;
      drawEngine.context.strokeRect(xOffsets[1] - 100, yOffset - 18, 200, 24);
      drawEngine.context.strokeRect(xOffsets[2] - 100, yOffset - 18, 200, 24);
      drawEngine.drawText(`Hole ${hole}`, 22, xOffsets[0], yOffset + 2)
      drawEngine.drawText(par as unknown as string, 20, xOffsets[1], yOffset + 2)
      drawEngine.drawText(score === -1 ? '' : score as unknown as string, 20, xOffsets[2], yOffset + 2)
    })

    yOffset += 24
    const {par, score } = this.scoreOverPar;
    drawEngine.drawText(par as unknown as string, 20, xOffsets[1], yOffset + 2)
    drawEngine.drawText(score as unknown as string, 20, xOffsets[2], yOffset + 2)
  }

  get scoreOverPar() {
    return this.scorecard
      .filter(levelScore => levelScore.score !== -1)
      .reduce((previous, current) => {
        previous.par += current.par;
        previous.score += current.score - current.par;
        return previous;
      }, { par: 0, score: 0 })
  }

  get nextIncompleteHole(): number {
    const completedHoles = this.scorecard
      .filter(score => score.score !== -1)
      .map(score => score.hole)
      .sort()
    return completedHoles[completedHoles.length -1];
  }

  private getEmptyScores(pars: number[]) {
    return pars.map((par, index) => {
      return {
        par,
        hole: index + 1,
        score: -1,
      }
    })
  }

  get isScorecardComplete(): boolean {
    return !this.scorecard.filter(score => score.score === -1).length;
  }

  get highScore(): { score: number } {
    return JSON.parse(window.localStorage.getItem(`${this.key}-hs`)!) as { score: number };
  }

  set highScore(score: { score: number }) {
    window.localStorage.setItem(`${this.key}-hs`, JSON.stringify(score));
  }

  get scoreMessage() {
    return `High Score: ${this.highScore.score} ${ this.highScore.score > 0 ? 'over' : 'under'} par`;
  }
}



export const scores = new Scores();
