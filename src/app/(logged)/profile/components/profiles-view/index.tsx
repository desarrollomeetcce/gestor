'use client';

import { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { createProfileAction, deleteProfileAction, updateProfileAction } from '../../application/crud';
import MultiselectSearch from '@/shared/multiselect-search';


interface Profile {
  id: number;
  name: string;
  defaultRate: number;
  permissions: { id: number; name: string }[];
}

interface Props {
  initialProfiles: Profile[];
  allPermissions: { id: number; name: string }[];
}

export default function ProfilesPage({ initialProfiles, allPermissions }: Props) {
  const [formState, formAction] = useActionState(createProfileAction, null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingRate, setEditingRate] = useState('');
  const [editingPermissions, setEditingPermissions] = useState<number[]>([]);
  const [creatingPermissions, setCreatingPermissions] = useState<number[]>([]);
  const [showProfiles, setShowProfiles] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDelete = async (id: number) => {
    await deleteProfileAction(id);
  };

  const handleEditSubmit = async () => {
    if (!editingId) return;
    const form = new FormData();
    form.append('id', String(editingId));
    form.append('name', editingName);
    form.append('defaultRate', editingRate);
    editingPermissions.forEach((id) => form.append('permissionIds', String(id)));
    const result = await updateProfileAction(null, form);
    if (result.status === 'success') {
      setEditingId(null);
      setEditingName('');
      setEditingRate('');
      setEditingPermissions([]);
    }
  };

  const filteredProfiles = initialProfiles.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row gap-6 text-white">
      <div className="flex-1">
        <h1 className="text-2xl font-semibold mb-4">Perfiles</h1>

        <form
          action={async (formData) => {
            creatingPermissions.forEach((id) => formData.append('permissionIds', String(id)));
            return formAction(formData);
          }}
          className="space-y-4 max-w-md mb-10"
        >
          <div>
            <label className="block text-sm text-white/80 mb-1">Nombre</label>
            <input
              name="name"
              required
              placeholder="Ej: Administrador"
              className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm text-white/80 mb-1">Tarifa por hora</label>
            <input
              name="defaultRate"
              required
              type="number"
              step="0.01"
              className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm text-white/80 mb-1">Permisos</label>
            <MultiselectSearch
              options={allPermissions.map((p) => ({ id: p.id, label: p.name }))}
              selected={creatingPermissions}
              onChange={setCreatingPermissions}
              placeholder="Seleccionar permisos"
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
            Crear perfil
          </button>
        </form>
      </div>

      <div className="md:w-1/2">
        <div className="md:hidden mb-4">
          <button
            className="px-4 py-2 bg-white/10 text-white border border-white/20 rounded"
            onClick={() => setShowProfiles(!showProfiles)}
          >
            {showProfiles ? 'Ocultar perfiles' : 'Ver perfiles'}
          </button>
        </div>

        {isClient && showProfiles && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Perfiles registrados</h2>
            <input
              type="text"
              placeholder="Buscar perfil..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4 w-full px-3 py-2 border border-white/20 bg-white/10 text-white rounded-md"
            />
            <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {filteredProfiles.map((profile) => (
                <li
                  key={profile.id}
                  className="flex flex-col gap-1 bg-white/5 border border-white/10 p-4 rounded-md"
                >
                  {editingId === profile.id ? (
                    <div className="flex flex-col gap-2">
                      <input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="bg-white/10 text-white border border-white/20 px-2 py-1 rounded"
                      />
                      <input
                        value={editingRate}
                        type="number"
                        step="0.01"
                        onChange={(e) => setEditingRate(e.target.value)}
                        className="bg-white/10 text-white border border-white/20 px-2 py-1 rounded"
                      />
                      <MultiselectSearch
                        options={allPermissions.map((p) => ({ id: p.id, label: p.name }))}
                        selected={editingPermissions}
                        onChange={setEditingPermissions}
                      />
                      <button
                        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                        onClick={handleEditSubmit}
                      >
                        Guardar
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-white">{profile.name}</span>
                      <span className="text-sm text-white/70">Tarifa: ${profile.defaultRate.toFixed(2)}</span>
                      <span className="text-sm text-white/70">
                        Permisos: {profile.permissions.map((p) => p.name).join(', ') || 'Ninguno'}
                      </span>
                      <div className="flex gap-3 mt-2">
                        <button
                          className="text-blue-400 hover:underline"
                          onClick={() => {
                            setEditingId(profile.id);
                            setEditingName(profile.name);
                            setEditingRate(profile.defaultRate.toString());
                            setEditingPermissions(profile.permissions.map((p) => p.id));
                          }}
                        >
                          Editar
                        </button>
                        <button
                          className="text-red-400 hover:underline"
                          onClick={() => handleDelete(profile.id)}
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
        )}
      </div>
    </div>
  );
}
