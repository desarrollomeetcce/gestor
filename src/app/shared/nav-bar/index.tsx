'use client';

import Link from 'next/link';

interface NavOption {
    label: string;
    href: string;
    requiredPermission: string;
}

const NAV_ITEMS: NavOption[] = [
    { label: 'Enlaces compartidos', href: '/shared-links', requiredPermission: 'ver enlaces' },
    { label: 'Enlaces', href: '/links', requiredPermission: 'administrar enlaces' },
    { label: 'Tipos de enlaces', href: '/link-types', requiredPermission: 'administrar enlaces' },
    { label: 'Horas', href: '/worklogs', requiredPermission: 'ver horas' },
    { label: 'Pagos', href: '/worklogsadmin', requiredPermission: 'administrar pagos' },
    { label: 'Asignación de horas', href: '/woklogasing', requiredPermission: 'administrar pagos' },
    { label: 'Presupuesto', href: '/budget', requiredPermission: 'administrar pagos' },
    { label: 'Usuarios', href: '/users', requiredPermission: 'administrar usuarios' },

];

export default function Navbar({ userName, permissions }: {
    userName: string;
    permissions: string[];
}) {
    const filteredItems = NAV_ITEMS.filter(item =>
        permissions.includes(item.requiredPermission)
    );

    return (
        <nav className="bg-white/5 border-b border-white/10 backdrop-blur-md text-white px-6 py-4 flex justify-between items-center shadow-md">
            <div className="font-bold text-lg">Gestor</div>
            <div className="flex gap-6 items-center">
                {filteredItems.map(item => (
                    <Link key={item.href} href={item.href} className="hover:underline">
                        {item.label}
                    </Link>
                ))}
                <span className="text-sm text-white/80">{userName}</span>
                <form method="POST" action="/">
                    <button className="text-red-300 hover:text-red-500 text-sm ml-4">Cerrar sesión</button>
                </form>
            </div>
        </nav>
    );
}
