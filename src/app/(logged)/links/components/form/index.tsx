'use client';

import { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { createLinkAction, deleteLinkAction, updateLinkAction } from '../../application/actions';

export default function LinksPageClient({ initialLinks, allUsers, allProfiles, linkTypes }: any) {
  const [formState, formAction] = useActionState(createLinkAction, null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingUrl, setEditingUrl] = useState('');
  const [editingTypeId, setEditingTypeId] = useState<number | null>(null);
  const [showLinks, setShowLinks] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDelete = async (id: number) => {
    await deleteLinkAction(id);
  };

  const handleEditSubmit = async () => {
    if (!editingId || !editingTypeId) return;
    const form = new FormData();
    form.append('id', String(editingId));
    form.append('title', editingTitle);
    form.append('url', editingUrl);
    form.append('typeId', String(editingTypeId));
    const result = await updateLinkAction(null, form);
    if (result.status === 'success') {
      setEditingId(null);
      setEditingTitle('');
      setEditingUrl('');
      setEditingTypeId(null);
    }
  };

  const filteredLinks = initialLinks.filter((link: any) =>
    link.title.toLowerCase().includes(search.toLowerCase()) ||
    link.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row gap-6 text-white">
      <div className="flex-1">
        <h1 className="text-2xl font-semibold mb-4">Enlaces</h1>

        <form action={formAction} className="space-y-4 max-w-md mb-10">
          <div>
            <label className="block text-sm text-white/80 mb-1">Título</label>
            <input
              name="title"
              required
              placeholder="Ej: Manual de procedimientos"
              className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm text-white/80 mb-1">URL</label>
            <input
              name="url"
              required
              placeholder="https://ejemplo.com"
              className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm text-white/80 mb-1">Tipo</label>
            <select
              name="typeId"
              required
              className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-md outline-none"
            >
              {linkTypes.map((type: any) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/80 mb-1">Compartido con usuarios</label>
            <select
              name="userIds"
              multiple
              className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-md outline-none"
            >
              {allUsers.map((u: any) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/80 mb-1">Compartido con perfiles</label>
            <select
              name="profileIds"
              multiple
              className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-md outline-none"
            >
              {allProfiles.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {formState?.status === 'error' && (
            <p className="text-red-400 text-sm">{formState.message}</p>
          )}
          {formState?.status === 'success' && (
            <p className="text-green-400 text-sm">{formState.message}</p>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-white hover:text-black transition"
          >
            Crear enlace
          </button>
        </form>
      </div>

      <div className="md:w-1/2">
        <div className="md:hidden mb-4">
          <button
            className="px-4 py-2 bg-white/10 text-white border border-white/20 rounded"
            onClick={() => setShowLinks(!showLinks)}
          >
            {showLinks ? 'Ocultar enlaces' : 'Ver enlaces'}
          </button>
        </div>

        {isClient && showLinks  ? (
          <div>
            <h2 className="text-xl font-semibold mb-2">Enlaces registrados</h2>
            <input
              type="text"
              placeholder="Buscar enlace..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4 w-full px-3 py-2 border border-white/20 bg-white/10 text-white rounded-md"
            />
            <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {filteredLinks.map((link: any) => (
                <li
                  key={link.id}
                  className="flex flex-col gap-1 bg-white/5 border border-white/10 p-4 rounded-md"
                >
                  {editingId === link.id ? (
                    <div className="flex flex-col gap-2">
                      <input
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className="bg-white/10 text-white border border-white/20 px-2 py-1 rounded"
                      />
                      <input
                        value={editingUrl}
                        onChange={(e) => setEditingUrl(e.target.value)}
                        className="bg-white/10 text-white border border-white/20 px-2 py-1 rounded"
                      />
                      <select
                        value={editingTypeId ?? link.typeId}
                        onChange={(e) => setEditingTypeId(Number(e.target.value))}
                        className="bg-white/10 text-white border border-white/20 px-2 py-1 rounded"
                      >
                        {linkTypes.map((t: any) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                      <button
                        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                        onClick={handleEditSubmit}
                      >
                        Guardar
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-white">{link.title}</span>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        {link.url}
                      </a>
                      <span className="text-sm text-white/70">Tipo: {link.type?.name}</span>
                      <div className="flex gap-3 mt-2">
                        <button
                          className="text-blue-400 hover:underline"
                          onClick={() => {
                            setEditingId(link.id);
                            setEditingTitle(link.title);
                            setEditingUrl(link.url);
                            setEditingTypeId(link.typeId);
                          }}
                        >
                          Editar
                        </button>
                        <button
                          className="text-red-400 hover:underline"
                          onClick={() => handleDelete(link.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}