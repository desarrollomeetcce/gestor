'use client';

import { useState } from 'react';

import { useActionState } from 'react';
import { createLinkTypeAction, deleteLinkTypeAction, updateLinkTypeAction } from '../../application/actions';


export default function LinkTypePageClient({linkTypes}:{linkTypes: any[]}) {
  const [formState, formAction] = useActionState(createLinkTypeAction, null);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const handleDelete = async (id: number) => {
    await deleteLinkTypeAction(id);
  };

  const handleEditSubmit = async () => {
    const form = new FormData();
    form.append('id', String(editingId));
    form.append('name', editingValue);
    const result = await updateLinkTypeAction(null, form);
    if (result.status === 'success') {
      setEditingId(null);
      setEditingValue('');
    }
  };

  return (
    <div >
      <h1 className="text-2xl font-semibold mb-4">Tipos de Enlace</h1>

      <form action={formAction} className="space-y-4 max-w-md mb-10">
        <div>
          <label className="block text-sm text-white/80 mb-1">Nombre del tipo</label>
          <input
            name="name"
            required
            placeholder="Ej: Recursos, Manuales..."
            className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
          />
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
          Crear tipo
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Tipos registrados</h2>
      <ul className="space-y-3">
        {linkTypes.map((type) => (
          <li
            key={type.id}
            className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-md"
          >
            {editingId === type.id ? (
              <div className="flex gap-2 w-full">
                <input
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  className="flex-1 bg-white/10 text-white border border-white/20 px-2 py-1 rounded"
                />
                <button
                  className="bg-green-600 px-2 rounded hover:bg-green-700"
                  onClick={handleEditSubmit}
                >
                  Guardar
                </button>
              </div>
            ) : (
              <>
                <span>{type.name}</span>
                <div className="flex gap-2">
                  <button
                    className="text-blue-400 hover:text-blue-300"
                    onClick={() => {
                      setEditingId(type.id);
                      setEditingValue(type.name);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => handleDelete(type.id)}
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
  );
}
