// src/components/Breadcrumbs.jsx

import Link from 'next/link';

export default function Breadcrumbs({ items = [] }) {
  if (!items.length) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://convohub.in${item.path}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center space-x-2 text-sm">
          {items.map((item, index) => (
            <li key={item.path} className="flex items-center">
              {index > 0 && <span className="mx-2 text-gray-400">/</span>}
              {index === items.length - 1 ? (
                <span className="text-gray-900 dark:text-white font-medium" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
