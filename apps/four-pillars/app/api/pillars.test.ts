import { describe, it, expect } from 'vitest';
import { EARTHLY_BRANCHES, HEAVENLY_STEMS } from 'types';
import type { Stem, Branch } from 'types';
import {
  getYearPillar,
  getMonthPillar,
  getDayPillar,
  getHourPillar,
  getThreeHarmonyBranches,
  getThreeSeasonalBranches,
  getTwoHarmonyBranches,
  getTwoSeasonalBranches,
  getTwoHarmonyBranchesWithDecadeLuck,
  getTwoSeasonalBranchesWithDecadeLuck,
  getBranchClashes,
  getBranchPairs,
  getBranchBreaks,
  getBranchHarms,
  getStemPairs,
  getBranchPunishments,
  getChangingStar,
  getTwelveLuck,
  getRoots
} from './pillars';

/** 地支の value から EARTHLY_BRANCHES のオブジェクトを引くヘルパー */
const b = (value: string) => EARTHLY_BRANCHES.find(x => x.value === value)!;
/** 天干の value から HEAVENLY_STEMS のオブジェクトを引くヘルパー */
const s = (value: string) => HEAVENLY_STEMS.find(x => x.value === value)!;

// ---- 四柱（年・月・日・時）の干支計算 ----

describe('getYearPillar', () => {
  it('1984年は甲子(干支の起点, index=1)', () => {
    const pillar = getYearPillar(1984);
    expect(pillar.index).toBe(1);
    expect(pillar.stem).toBe('甲');
    expect(pillar.branch).toBe('子');
  });

  it('2024年は甲辰(index=41)、2023年は癸卯(index=40)', () => {
    expect(getYearPillar(2024)).toMatchObject({ index: 41, stem: '甲', branch: '辰' });
    expect(getYearPillar(2023)).toMatchObject({ index: 40, stem: '癸', branch: '卯' });
  });

  it('(year-3)が60で割り切れる場合は index=60(癸亥)に補正される', () => {
    // year=3 → (3-3)%60 === 0 → index=60
    expect(getYearPillar(3)).toMatchObject({ index: 60, stem: '癸', branch: '亥' });
  });

  it('(year-3)が負になる場合も正しく循環する', () => {
    // year=2 → (2-3)%60 = -1 → index=59(壬戌)
    expect(getYearPillar(2)).toMatchObject({ index: 59, stem: '壬', branch: '戌' });
  });
});

describe('getMonthPillar', () => {
  it('2024年2月(立春後)は丙寅(index=3)', () => {
    expect(getMonthPillar(2024, 2)).toMatchObject({ index: 3, stem: '丙', branch: '寅' });
  });
});

describe('getDayPillar', () => {
  // ユリウス日 2451545 = 2000-01-01 12:00 UTC（この日は戊午日）
  const JD_2000_01_01 = 2451545;

  it('2000-01-01は戊午(index=55)', () => {
    expect(getDayPillar(12, JD_2000_01_01, false)).toMatchObject({
      index: 55,
      stem: '戊',
      branch: '午'
    });
  });

  it('23時かつ changeDayStem=true なら翌日の干支(己未, index=56)になる', () => {
    expect(getDayPillar(23, JD_2000_01_01, true)).toMatchObject({ index: 56 });
  });

  it('23時でも changeDayStem=false なら当日の干支のまま(戊午)', () => {
    expect(getDayPillar(23, JD_2000_01_01, false)).toMatchObject({ index: 55 });
  });
});

describe('getHourPillar', () => {
  it('甲日の0時(子刻)は甲子(index=1)', () => {
    expect(getHourPillar(0, '甲', false)).toMatchObject({ index: 1, stem: '甲', branch: '子' });
  });

  it('範囲外の時刻には null を返す', () => {
    expect(getHourPillar(24, '甲', false)).toBeNull();
    expect(getHourPillar(-1, '甲', false)).toBeNull();
  });

  it('存在しない日干には null を返す', () => {
    expect(getHourPillar(0, 'X', false)).toBeNull();
  });
});

// ---- 地支・天干の関係判定 ----

describe('getThreeHarmonyBranches', () => {
  it('申・子・辰は三合水局', () => {
    expect(getThreeHarmonyBranches([b('申'), b('子'), b('辰')])?.name).toBe('三合水局');
  });

  it('三合が成立しない組み合わせは undefined', () => {
    expect(getThreeHarmonyBranches([b('子'), b('丑'), b('寅')])).toBeUndefined();
  });
});

describe('getThreeSeasonalBranches', () => {
  it('寅・卯・辰は東方合', () => {
    expect(getThreeSeasonalBranches([b('寅'), b('卯'), b('辰')])?.name).toBe('東方合');
  });
});

// ---- 半会（三合・方合の二支による部分成立） ----

describe('getTwoHarmonyBranches', () => {
  it('子・辰は三合水局半会', () => {
    expect(getTwoHarmonyBranches([b('子'), b('辰')]).map(c => c.name)).toEqual(['三合水局半会']);
  });

  it('半会が成立しない組み合わせは空配列', () => {
    expect(getTwoHarmonyBranches([b('子'), b('丑')])).toEqual([]);
  });
});

describe('getTwoSeasonalBranches', () => {
  it('寅・卯は東方合半会', () => {
    expect(getTwoSeasonalBranches([b('寅'), b('卯')]).map(c => c.name)).toEqual(['東方合半会']);
  });
});

// ---- 大運の地支と連動した半会 ----

describe('getTwoHarmonyBranchesWithDecadeLuck', () => {
  it('命式の申と大運の子で三合水局半会', () => {
    expect(getTwoHarmonyBranchesWithDecadeLuck([b('申')], b('子')).map(c => c.name)).toEqual([
      '三合水局半会'
    ]);
  });
});

describe('getTwoSeasonalBranchesWithDecadeLuck', () => {
  it('命式の寅と大運の卯で東方合半会', () => {
    expect(getTwoSeasonalBranchesWithDecadeLuck([b('寅')], b('卯')).map(c => c.name)).toEqual([
      '東方合半会'
    ]);
  });
});

// ---- 支合・破・害（隣同士のペア判定） ----

describe('getBranchPairs', () => {
  it('子と丑は支合', () => {
    expect(getBranchPairs([b('子'), b('丑')]).map(p => p.name)).toEqual(['子丑']);
  });

  it('支合にならない組み合わせは空配列', () => {
    expect(getBranchPairs([b('子'), b('寅')])).toEqual([]);
  });
});

describe('getBranchBreaks', () => {
  it('子と酉は破', () => {
    expect(getBranchBreaks([b('子'), b('酉')]).map(p => p.name)).toEqual(['子酉']);
  });
});

describe('getBranchHarms', () => {
  it('子と未は害', () => {
    expect(getBranchHarms([b('子'), b('未')]).map(p => p.name)).toEqual(['子未']);
  });
});

describe('getBranchClashes', () => {
  it('子と午は冲', () => {
    expect(getBranchClashes([b('子'), b('午')]).map(c => c.name)).toEqual(['子午']);
  });

  it('冲にならない組み合わせは空配列', () => {
    expect(getBranchClashes([b('子'), b('丑')])).toEqual([]);
  });
});

describe('getStemPairs', () => {
  it('甲と己は干合', () => {
    expect(getStemPairs([s('甲'), s('己')]).map(p => p.name)).toEqual(['甲己']);
  });
});

describe('getBranchPunishments', () => {
  it('寅と巳は恃勢の刑', () => {
    const punishments = getBranchPunishments([b('寅'), b('巳')]);
    expect(punishments).toHaveLength(1);
    expect(punishments[0]).toMatchObject({ name: '寅巳', type: '恃勢の刑' });
  });
});

// ---- 通変星・十二運 ----

describe('getChangingStar', () => {
  it('日干が甲・対象が丙のとき食神', () => {
    expect(getChangingStar('甲' as Stem, '丙' as Stem)).toBe('食神');
  });

  it('引数が欠けている場合は空文字', () => {
    expect(getChangingStar('' as Stem, '丙' as Stem)).toBe('');
  });
});

describe('getTwelveLuck', () => {
  it('日干が甲・対象の地支が子のとき沐浴', () => {
    expect(getTwelveLuck('甲' as Stem, '子' as Branch)).toBe('沐浴');
  });

  it('引数が欠けている場合は空文字', () => {
    expect(getTwelveLuck('甲' as Stem, '' as Branch)).toBe('');
  });
});

// ---- 通根 ----

describe('getRoots', () => {
  it('通根する地支(日支に一致)を返す', () => {
    const roots = getRoots(
      [b('子') as unknown as Branch],
      b('午') as unknown as Branch,
      b('子') as unknown as Branch,
      undefined,
      undefined
    );
    expect(roots).toHaveLength(1);
    expect(roots[0]).toBe(b('子'));
  });

  it('stemRoots が空なら空配列', () => {
    expect(getRoots([], undefined, undefined, undefined, undefined)).toEqual([]);
    expect(getRoots(undefined, undefined, undefined, undefined, undefined)).toEqual([]);
  });
});
