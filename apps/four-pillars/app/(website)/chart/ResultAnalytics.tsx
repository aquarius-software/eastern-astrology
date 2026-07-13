import { FourPillarsProps } from "@/app/types";
import { BranchPair } from "types";
import { CalculatorIcon } from "@heroicons/react/24/outline";

export default function ResultAnalytics({
  result
}: FourPillarsProps): JSX.Element {
  const {
    stemPairs,
    branchPairs,
    threeSeasonalBranches,
    threeHarmonyBranches,
    twoSeasonalBranches,
    twoHarmonyBranches,
    branchClashes,
    branchBreaks,
    branchHarms,
    branchPunishments,
    emptyPeriods,
  } = result;

  /**
   * 方合
   *
   * @returns {string}
   */
  const seasonalBranches = (): string => {
    if (!threeSeasonalBranches) {
      return "";
    }
    const branchesStr = threeSeasonalBranches.branches
      .map(branch => branch)
      .join("");
    return `${threeSeasonalBranches.name}（${branchesStr}）`;
  };

  /**
   * 方合半会
   *
   * @returns {string}
   */
  const halfSeasonalBranches = (): string[] => {
    if (threeSeasonalBranches || !twoSeasonalBranches) {
      return [];
    }
    return twoSeasonalBranches.map(twoSeasonalBranch => {
      const branchesStr = twoSeasonalBranch.branches
        .map(branch => branch)
        .join("");
      return `${twoSeasonalBranch.name}（${branchesStr}）`;
    });
  };

  /**
   * 方局
   *
   * @returns {string}
   */
  const harmonyBranches = (): string => {
    if (!threeHarmonyBranches || threeHarmonyBranches.elementId === 2) {
      return "";
    }
    const branchesStr = threeHarmonyBranches.branches
      .map(branch => branch)
      .join("");
    return `${threeHarmonyBranches.name}（${branchesStr}）`;
  };

  /**
   * 四墓
   *
   * @returns {string}
   */
  const earthBranches = (): string => {
    if (!threeHarmonyBranches || threeHarmonyBranches.elementId !== 2) {
      return "";
    }
    const branchesStr = threeHarmonyBranches.branches
      .map(branch => branch)
      .join("");
    return `${threeHarmonyBranches.name}（${branchesStr}）`;
  };

  /**
   * 方局半会
   *
   * @returns {string[]}
   */
  const halfHarmonyBranches = (): string[] => {
    if (threeHarmonyBranches || !twoHarmonyBranches) {
      return [];
    }
    return twoHarmonyBranches.map(twoHarmonyBranch => {
      const branchesStr = twoHarmonyBranch.branches
        .map(branch => branch)
        .join("");
      return `${twoHarmonyBranch.name}（${branchesStr}）`;
    });
  };

  return (
    <div className="section-container">
      <table className="section-table">
        <tbody className="section-table-body">
          <tr className="table-row">
            <th
              colSpan={2}
              className="section-header">
              <div className="flex items-center">
                <CalculatorIcon className="section-icon" />
                命式分析
              </div>
            </th>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">
              干合
            </td>
            <td className="table-cell-content-without-border">
              {stemPairs && stemPairs.length > 0
                ? stemPairs.map(pair => pair.name).join("・")
                : "なし"}
            </td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">
              方合
            </td>
            <td className="table-cell-content-without-border">
              {seasonalBranches()
                ? seasonalBranches()
                : halfSeasonalBranches() &&
                  halfSeasonalBranches()!.length > 0
                  ? halfSeasonalBranches()!.map(
                    (halfSeasonalBranch: string, i: number) => {
                      return (
                        <div key={i}>{halfSeasonalBranch}</div>
                      );
                    }
                  )
                  : "なし"}
            </td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">
              三合
            </td>
            <td className="table-cell-content-without-border">
              {harmonyBranches()
                ? harmonyBranches()
                : halfHarmonyBranches() &&
                  halfHarmonyBranches()!.length > 0
                  ? halfHarmonyBranches()!.map(
                    (halfHarmonyBranch, i) => {
                      return <div key={i}>{halfHarmonyBranch}</div>;
                    }
                  )
                  : "なし"}
            </td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">
              四墓
            </td>
            <td className="table-cell-content-without-border">
              {earthBranches() ? earthBranches() : "なし"}
            </td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">
              支合
            </td>
            <td className="table-cell-content-without-border">
              {branchPairs && branchPairs.length > 0
                ? branchPairs
                  .map((pair: BranchPair) => pair.name)
                  .join("・")
                : "なし"}
            </td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">
              冲
            </td>
            <td className="table-cell-content-without-border">
              {branchClashes && branchClashes.length
                ? branchClashes.map(pair => pair.name).join("・")
                : "なし"}
            </td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">
              刑
            </td>
            <td className="table-cell-content-without-border">
              {branchPunishments && branchPunishments.length
                ? branchPunishments.map(pair => pair.name).join("・")
                : "なし"}
            </td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">
              破
            </td>
            <td className="table-cell-content-without-border">
              {branchBreaks && branchBreaks.length
                ? branchBreaks.map(pair => pair.name).join("・")
                : "なし"}
            </td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">
              害
            </td>
            <td className="table-cell-content-without-border">
              {branchHarms && branchHarms.length
                ? branchHarms.map(pair => pair.name).join("・")
                : "なし"}
            </td>
          </tr>
          <tr className="table-row">
            <td className="table-left-header">
              空亡
            </td>
            <td className="table-cell-content-without-border">
              {emptyPeriods &&
                emptyPeriods.map(branch => {
                  return branch;
                })}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
