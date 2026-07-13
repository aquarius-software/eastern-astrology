import Link from "next/link";
import { Chip } from "@heroui/react";

export default function CategoryLabel({
  categories,
  nomargin = false
}) {
  return (
    <>
      {categories?.length &&
        categories.slice(0).map((category) => (
          <Chip className="ml-2" color="default" key={category.title}>
            {category.title}
          </Chip>
        ))}
    </>
  );
}
