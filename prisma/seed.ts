const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const DEFAULT_PERMISSIONS = [
  'ver enlaces',
  'administrar enlaces',
  'ver horas',
  'asignar horas',
  'administrar usuarios',
  'administrar pagos',
];

async function main() {
  // Crear permisos
  for (const name of DEFAULT_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Crear perfil admin
  const adminProfile = await prisma.profile.upsert({
    where: { name: 'Administrador' }, // asegúrate que sea @unique
    update: {},
    create: {
      name: 'Administrador',
      defaultRate: 150,
      permissions: {
        connect: DEFAULT_PERMISSIONS.map((name: string) => ({ name })),
      },
    },
  });

  // Usuario admin
  const email = 'admin@test.com';
  const existing = await prisma.user.findUnique({ where: { email } });

  if (!existing) {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await prisma.user.create({
      data: {
        name: 'Admin General',
        email,
        password: hashedPassword,
        profileId: adminProfile.id,
        isSuperAdmin: true,
      },
    });

    console.log('✅ Usuario creado: admin@soutbug.com / admin123');
  } else {
    console.log('ℹ️ Usuario ya existe.');
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e: any) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
