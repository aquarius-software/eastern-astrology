"use client";

import { ReactNode } from "react";
import { Breadcrumbs } from "@heroui/react";

export type CrumbItem = {
  label: ReactNode;
  path: string;
  classNames?: string;
};

export type BreadcrumbsProps = {
  items: CrumbItem[];
};

export default function BreadCrumb({ items }: BreadcrumbsProps) {
  return (
    <div className="w-full px-8 py-1.5 shadow-xs mb-4">
      {/* HeroUI v3: BreadcrumbItem → Breadcrumbs.Item、classNames の
          スロット API は className の単一指定に変わった。
          呼び出し側の API（CrumbItem.classNames）は据え置き。 */}
      <Breadcrumbs className="flex-nowrap">
        <Breadcrumbs.Item href="/">ホーム</Breadcrumbs.Item>
        {items &&
          items.map((crumb, i) => {
            return (
              <Breadcrumbs.Item
                key={i + 1}
                href={crumb.path}
                className={
                  crumb.classNames ? crumb.classNames : "whitespace-nowrap"
                }
              >
                {crumb.label}
              </Breadcrumbs.Item>
            );
          })}
      </Breadcrumbs>
    </div>
  );
}
