import type { PalaceName, Star, YearlyFortune, Branch, Stem, BranchIndex } from 'types';

export class Palace {
  constructor(
    public name: PalaceName,
    public stem: Stem,
    public stemIndex: number,
    public branch: Branch,
    public isMainPalace: boolean,
    public isBodyPalace: boolean,
    public boardPosition: BranchIndex
  ) { }

  public startingAge!: number;
  public endingAge!: number;
  public isCurrentPalace!: boolean;
  public yearlyLucks: YearlyFortune[] = [];
  public majorStars: Star[] = [];
  public minorStars: Star[] = [];
  public starPower!: number;
  public destinyIndex!: number;

  public calculateStarPower(): void {
    const majorStarPower = this.majorStars.reduce((prev, curr) => {
      return prev + curr.strength!;
    }, 0);
    const minorStarPower = this.minorStars.reduce((prev, curr) => {
      return prev + curr.strength!;
    }, 0);
    this.starPower = majorStarPower + minorStarPower;
  }
}
