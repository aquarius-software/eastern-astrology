import type {
  HiddenStem,
  PillarPosition,
  Branch,
  FiveElementsId,
  FourSeasonsId
} from 'types';

/**
 * 地支
 *
 * @export
 * @interface EarthlyBranch
 * @typedef {EarthlyBranch}
 */
export class EarthlyBranch {
  position?: PillarPosition;
  value!: Branch;
  index?: number;
  isYang?: boolean;
  elementId?: FiveElementsId;
  seasonId?: FourSeasonsId;
  combination?: Branch;
  clash?: Branch;
  break?: Branch;
  harm?: Branch;
  hiddenStems?: HiddenStem[];
  elementComposition?: number[];
  description?: string;
  explanation?: string;
  temperature?: number;
  humidity?: number;

  public static sort(branchPair: EarthlyBranch[]): EarthlyBranch[] {
    const sortedBranchPair = branchPair.sort((a, b) => {
      if (!a.index || !b.index) {
        return 1;
      }
      return a.index > b.index ? 1 : -1;
    });
    return sortedBranchPair;
  }
}
