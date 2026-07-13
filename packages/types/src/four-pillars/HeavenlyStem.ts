import type {
  ChangingStar,
  PillarPosition,
  TwelveLuck,
  FiveElementsId,
  Stem,
  Branch
} from 'types';

/**
 * 天干
 *
 * @export
 * @interface HeavenlyStem
 * @typedef {HeavenlyStem}
 */
export class HeavenlyStem {
  position?: PillarPosition;
  value!: Stem;
  index?: number;
  isYang?: boolean;
  elementId?: FiveElementsId;
  group?: number;
  combination?: Stem;
  roots?: Branch[];
  changingStars?: ChangingStar[];
  changingStar?: string;
  twelveLucks?: TwelveLuck[];
  twelveLuck?: string;
  description?: string;
  explanation?: string;
  temperature?: number;
  humidity?: number;

  public static sort(stemPair: HeavenlyStem[]): HeavenlyStem[] {
    const sortedStemPair = stemPair.sort((a, b) => {
      if (!a.index || !b.index) {
        return 1;
      }
      return a.index % 2 === 0 ? 1 : -1;
    });
    return sortedStemPair;
  }
}
