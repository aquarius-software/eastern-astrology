import Link from 'next/link';

export const TableOfContents = ({ outline }: { outline: any }) => (
  <ol>
    {outline.map((heading: any, i: number) => {
      return (
        <li key={i}>
          <Link href={`#${heading.id}`} prefetch={false} className="no-underline">
            <span className="text-base text-blue-600 hover:text-blue-900 visited:text-purple-600">
              {heading.text}
            </span>
          </Link>
          {heading.subheadings.length > 0 && (
            <TableOfContents outline={heading.subheadings} />
          )}
        </li>
      );
    })}
  </ol>
);
