'use client';

import { useState } from 'react';

export default function SharedLinksPage({ sharedLinks }: { sharedLinks: any[] }) {
  const [search, setSearch] = useState('');
 

  const filteredLinks = sharedLinks.filter((link: any) =>
    link.title.toLowerCase().includes(search.toLowerCase()) ||
    link.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full mx-auto px-4 py-6 text-white">
      <h1 className="text-2xl font-semibold mb-4">Enlaces Compartidos Contigo</h1>
      <input
        type="text"
        placeholder="Buscar enlace..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full px-4 py-2 border border-white/20 bg-white/10 text-white rounded-md"
      />

      <ul className="space-y-4 max-h-[600px] overflow-y-auto">
        {filteredLinks.map((link: any) => (
          <li
            key={link.id}
            className="flex flex-col gap-2 bg-white/5 border border-white/10 p-4 rounded-md"
          >
            <span className="font-semibold text-white text-lg">{link.title}</span>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              {link.url}
            </a>
            <span className="text-sm text-white/70">Tipo: {link.type?.name}</span>
            {link.owner?.name && (
              <span className="text-sm text-white/50">Propietario: {link.owner.name}</span>
            )}
          </li>
        ))}
        {filteredLinks.length === 0 && (
          <li className="text-white/70">No hay enlaces coincidentes.</li>
        )}
      </ul>
    </div>
  );
}
