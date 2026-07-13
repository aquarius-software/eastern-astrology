'use client';

import { ReactNode } from 'react';
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";

export type CrumbItem = {
  label: ReactNode;
  path: string;
  classNames?: string
};

export type BreadcrumbsProps = {
  items: CrumbItem[];
};

export default function BreadCrumb({ items }: BreadcrumbsProps) {
  return (
    <div className="w-full px-8 py-1.5 shadow-sm mb-4">
      <Breadcrumbs classNames={{
        list: "flex-nowrap"
      }}>
        <BreadcrumbItem href="/">ホーム</BreadcrumbItem>
        {items &&
          items.map((crumb, i) => {
            return (
              <BreadcrumbItem key={i + 1} href={crumb.path} classNames={{
                item: crumb.classNames ? crumb.classNames : "whitespace-nowrap",
              }}>
                {crumb.label}
              </BreadcrumbItem>
            );
          })}
      </Breadcrumbs>
    </div>
  );
}
