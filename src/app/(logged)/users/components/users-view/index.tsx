// app/(logged)/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { createUserAction, deleteUserAction, updateUserAction } from '../../application/crud';
import bcrypt from 'bcryptjs';

interface User {
    id: number;
    name: string;
    email: string;
    profileId: number;
    profile: { id: number; name: string };
}

interface Props {
    initialUsers: User[];
    allProfiles: { id: number; name: string }[];
}

export default function UsersPage({ initialUsers, allProfiles }: Props) {
    const [formState, formAction] = useActionState(createUserAction, null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState('');
    const [editingEmail, setEditingEmail] = useState('');
    const [editingProfileId, setEditingProfileId] = useState<number | null>(null);
    const [editingPassword, setEditingPassword] = useState('');
    const [showUsers, setShowUsers] = useState(true);
    const [isClient, setIsClient] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleDelete = async (id: number) => {
        await deleteUserAction(id);
    };

    const handleEditSubmit = async () => {
        if (!editingId || !editingProfileId) return;
        const form = new FormData();
        form.append('id', String(editingId));
        form.append('name', editingName);
        form.append('email', editingEmail);
        form.append('profileId', String(editingProfileId));
        if (editingPassword.trim()) {
            form.append('password', editingPassword);
        }
        const result = await updateUserAction(null, form);
        if (result.status === 'success') {
            setEditingId(null);
            setEditingName('');
            setEditingEmail('');
            setEditingProfileId(null);
            setEditingPassword('');
        }
    };

    const filteredUsers = initialUsers.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col md:flex-row gap-6 text-white">
            <div className="flex-1">
                <h1 className="text-2xl font-semibold mb-4">Usuarios</h1>

                <form action={formAction} className="space-y-4 max-w-md mb-10">
                    <div>
                        <label className="block text-sm text-white/80 mb-1">Nombre</label>
                        <input
                            name="name"
                            required
                            className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-white/80 mb-1">Email</label>
                        <input
                            name="email"
                            required
                            type="email"
                            className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-white/80 mb-1">Contraseña</label>
                        <input
                            name="password"
                            required
                            type="password"
                            className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-white/80 mb-1">Perfil</label>
                        <select
                            name="profileId"
                            required
                            className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-md"
                        >
                            <option value="">Seleccionar...</option>
                            {allProfiles.map((p) => (
                                <option key={p.id} value={p.id} className="bg-black">
                                    {p.name}
                                </option>
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
                        Crear usuario
                    </button>
                </form>
            </div>

            <div className="md:w-1/2">
                <div className="md:hidden mb-4">
                    <button
                        className="px-4 py-2 bg-white/10 text-white border border-white/20 rounded"
                        onClick={() => setShowUsers(!showUsers)}
                    >
                        {showUsers ? 'Ocultar usuarios' : 'Ver usuarios'}
                    </button>
                </div>

                {isClient && showUsers && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Usuarios registrados</h2>
                        <input
                            autoComplete="new-password"
                            name="searchUsers"
                            placeholder="Buscar usuario..."
                            value={search}

                            onChange={(e) => setSearch(e.target.value)}
                            className="mb-4 w-full px-3 py-2 border border-white/20 bg-white/10 text-white rounded-md"
                        />
                        <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                            {filteredUsers.map((user) => (
                                <li
                                    key={user.id}
                                    className="flex flex-col gap-1 bg-white/5 border border-white/10 p-4 rounded-md"
                                >
                                    {editingId === user.id ? (
                                        <div className="flex flex-col gap-2">
                                            <input
                                                value={editingName}
                                                onChange={(e) => setEditingName(e.target.value)}
                                                className="bg-white/10 text-white border border-white/20 px-2 py-1 rounded"
                                            />
                                            <input
                                                value={editingEmail}
                                                type="email"
                                                onChange={(e) => setEditingEmail(e.target.value)}
                                                className="bg-white/10 text-white border border-white/20 px-2 py-1 rounded"
                                            />
                                            <input
                                                value={editingPassword}
                                                placeholder="Nueva contraseña (opcional)"
                                                type="password"
                                                onChange={(e) => setEditingPassword(e.target.value)}
                                                className="bg-white/10 text-white border border-white/20 px-2 py-1 rounded"
                                            />
                                            <select
                                                value={editingProfileId || ''}
                                                onChange={(e) => setEditingProfileId(Number(e.target.value))}
                                                className="bg-white/10 text-white border border-white/20 px-2 py-1 rounded"
                                            >
                                                <option value="">Seleccionar...</option>
                                                {allProfiles.map((p) => (
                                                    <option key={p.id} value={p.id} className="bg-black">
                                                        {p.name}
                                                    </option>
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
                                            <span className="font-medium text-white">{user.name}</span>
                                            <span className="text-sm text-white/70">Email: {user.email}</span>
                                            <span className="text-sm text-white/70">Perfil: {user.profile.name}</span>
                                            <div className="flex gap-3 mt-2">
                                                <button
                                                    className="text-blue-400 hover:underline"
                                                    onClick={() => {
                                                        setEditingId(user.id);
                                                        setEditingName(user.name);
                                                        setEditingEmail(user.email);
                                                        setEditingProfileId(user.profile.id);
                                                    }}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="text-red-400 hover:underline"
                                                    onClick={() => handleDelete(user.id)}
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