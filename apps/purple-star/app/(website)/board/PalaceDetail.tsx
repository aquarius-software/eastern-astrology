'use client';

import { useEffect, useState } from "react";
import { Palace } from "types";
import {
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/react";

export default function PalaceDetail({
  palaces
}: {
  palaces: Palace[]
}) {
  const [palaceIndex, setPalaceIndex] = useState<number>(0);
  const [palace, setPalace] = useState<Palace>(palaces[0]);

  useEffect(() => {
    setPalace(palaces[palaceIndex]);
  }, [palaceIndex]);

  return (
    <div>
      <div className="section-container">
        <table className="section-table">
          <tbody className="section-table-body">
            <tr className="table-row">
              <th colSpan={2} className="section-header">
                <div className="flex items-center">
                  <MagnifyingGlassIcon className="section-icon" />
                  <span className="mr-4">{palace.name}詳細</span>
                  <div className="flex w-full justify-start md:justify-end gap-3">
                    <Button onClick={e => {
                      e.preventDefault();
                      setPalaceIndex(
                        palaceIndex <= 0 ? 11 : palaceIndex - 1
                      );
                    }}>前の宮
                    </Button>
                    <Button onClick={e => {
                      e.preventDefault();
                      setPalaceIndex((palaceIndex + 1) % 12);
                    }}>次の宮
                    </Button>
                  </div>
                </div>
              </th>
            </tr>
            <tr className="table-row">
              <td className="table-left-header">宮名称</td>
              <td className="table-cell-content">{palace.name}</td>
            </tr>
            <tr className="table-row">
              <td className="table-left-header">干支</td>
              <td className="table-cell-content">
                {palace.stem}
                {palace.branch}
              </td>
            </tr>
            <tr className="table-row">
              <td className="table-left-header">大限</td>
              <td className="table-cell-content">
                {palace.startingAge}〜{palace.endingAge}歳
              </td>
            </tr>
            <tr className="table-row">
              <td className="table-left-header">小限</td>
              <td className="table-cell-content">
                {palace.yearlyLucks.map((luck, i) => (
                  <span key={i}>
                    {luck.age}
                    {i !== palace.yearlyLucks.length - 1
                      ? ", "
                      : "歳"}
                  </span>
                ))}
              </td>
            </tr>
            <tr className="table-row">
              <td className="table-left-header">主星</td>
              <td className="table-cell-content">
                {palace.majorStars.map((star, i) => (
                  <div key={i}>
                    <span className="mr-1 font-bold">
                      {star.shortName}
                    </span>
                    <span className="font-normal text-orange-600">
                      {star.luminosity}
                    </span>
                    {star.childStar ? (
                      <span className="ml-1 font-bold text-blue-600">
                        {star.childStar.shortName}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                ))}
              </td>
            </tr>
            <tr className="table-row">
              <td className="table-left-header">副星</td>
              <td className="table-cell-content">
                {palace.minorStars.map((star, i) => (
                  <div key={i}>
                    <span className="mr-1 font-bold">
                      {star.shortName}
                    </span>
                    <span className="font-normal text-orange-600">
                      {star.luminosity}
                    </span>
                    {star.childStar ? (
                      <span className="ml-1 font-bold text-blue-600">
                        {star.childStar.shortName}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
