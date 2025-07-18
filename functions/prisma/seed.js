"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
const prisma = new client_1.PrismaClient();
const categories = [
    { id: 1, nombre: 'Frutas y Verduras' },
    { id: 2, nombre: 'Carnes y Pescados' },
    { id: 3, nombre: 'Panadería y Pastelería' },
    { id: 4, nombre: 'Lácteos y Quesos' },
    { id: 5, nombre: 'Salud y Belleza' },
    { id: 6, nombre: 'Deportes y Outdoor' },
    { id: 7, nombre: 'Tecnología' },
    { id: 8, nombre: 'Mascotas' },
    { id: 9, nombre: 'Hogar y Jardín' },
    { id: 10, nombre: 'Moda y Accesorios' },
    { id: 11, nombre: 'Libros y Papelería' },
    { id: 12, nombre: 'Arte y Cultura' },
    { id: 13, nombre: 'Juguetes y Niños' },
    { id: 14, nombre: 'Bebidas y Jugos' },
    { id: 15, nombre: 'Alimentos Gourmet' },
];
const roles = [
    { id: 1, nombre: 'admin', descripcion: 'Administrador del sistema' },
    { id: 2, nombre: 'proveedor', descripcion: 'Vendedor en la plataforma' },
    { id: 3, nombre: 'comprador', descripcion: 'Cliente que realiza compras' },
];
async function main() {
    console.log('🌱 Starting database seeding...');
    // Seed roles
    console.log('📝 Seeding roles...');
    const rolesCreated = [];
    for (const rol of roles) {
        const roleCreated = await prisma.roles.upsert({
            where: { id_rol: rol.id },
            update: {},
            create: {
                id_rol: rol.id,
                nombre: rol.nombre,
                descripcion: rol.descripcion,
            },
        });
        rolesCreated.push(roleCreated);
    }
    // Seed categorias
    console.log('🏷️ Seeding categories...');
    for (const cat of categories) {
        await prisma.categorias.upsert({
            where: { id_categoria: cat.id },
            update: {},
            create: {
                id_categoria: cat.id,
                nombre: cat.nombre,
            },
        });
    }
    // Seed planes
    console.log('💰 Seeding subscription plans...');
    const planesData = [
        {
            id_plan: 1,
            nombre: 'Free',
            precio_mensual: 0.0,
            descripcion: 'Plan gratuito para nuevos proveedores.',
        },
        {
            id_plan: 2,
            nombre: 'Premium',
            precio_mensual: 9900.0,
            descripcion: 'Plan para proveedores destacados con más visibilidad.',
        },
        {
            id_plan: 3,
            nombre: 'Empresa',
            precio_mensual: 19900.0,
            descripcion: 'Plan para empresas grandes con funciones avanzadas.',
        },
    ];
    const planes = [];
    for (const planData of planesData) {
        const plan = await prisma.planes.upsert({
            where: { id_plan: planData.id_plan },
            update: {},
            create: planData,
        });
        planes.push(plan);
    }
    // Seed usuarios
    console.log('👥 Seeding users...');
    const usuarios = [];
    // Admin user
    const adminUser = await prisma.usuarios.upsert({
        where: { email: 'admin@marketplace.com' },
        update: {},
        create: {
            nombre: 'Administrador',
            email: 'admin@marketplace.com',
            contrasena_hash: 'hashedpassword',
            activo: true,
            id_plan: 3, // Enterprise plan for admin
        },
    });
    usuarios.push(adminUser);
    // Provider users
    for (let i = 1; i <= 10; i++) {
        const user = await prisma.usuarios.upsert({
            where: { email: `proveedor${i}@example.com` },
            update: {},
            create: {
                nombre: `Proveedor Usuario ${i}`,
                email: `proveedor${i}@example.com`,
                contrasena_hash: 'hashedpassword',
                activo: true,
                id_plan: planes[i % planes.length].id_plan,
                profile_picture_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=provider${i}`,
            },
        });
        usuarios.push(user);
    }
    // Customer users
    for (let i = 1; i <= 15; i++) {
        const user = await prisma.usuarios.upsert({
            where: { email: `cliente${i}@example.com` },
            update: {},
            create: {
                nombre: `Cliente ${i}`,
                email: `cliente${i}@example.com`,
                contrasena_hash: 'hashedpassword',
                activo: true,
                profile_picture_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=customer${i}`,
            },
        });
        usuarios.push(user);
    }
    // Assign roles to users
    console.log('🔐 Assigning user roles...');
    // Admin role
    await prisma.usuarioRol.upsert({
        where: { id_usuario_id_rol: { id_usuario: adminUser.id_usuario, id_rol: 1 } },
        update: {},
        create: { id_usuario: adminUser.id_usuario, id_rol: 1 },
    });
    // Provider roles (users 2-11)
    for (let i = 1; i <= 10; i++) {
        await prisma.usuarioRol.upsert({
            where: { id_usuario_id_rol: { id_usuario: usuarios[i].id_usuario, id_rol: 2 } },
            update: {},
            create: { id_usuario: usuarios[i].id_usuario, id_rol: 2 },
        });
        // Also give them customer role for testing
        await prisma.usuarioRol.upsert({
            where: { id_usuario_id_rol: { id_usuario: usuarios[i].id_usuario, id_rol: 3 } },
            update: {},
            create: { id_usuario: usuarios[i].id_usuario, id_rol: 3 },
        });
    }
    // Customer roles (users 12-26)
    for (let i = 11; i < usuarios.length; i++) {
        await prisma.usuarioRol.upsert({
            where: { id_usuario_id_rol: { id_usuario: usuarios[i].id_usuario, id_rol: 3 } },
            update: {},
            create: { id_usuario: usuarios[i].id_usuario, id_rol: 3 },
        });
    }
    // Seed proveedores
    console.log('🏪 Seeding providers...');
    const proveedores = [];
    for (let i = 1; i <= 10; i++) {
        const proveedor = await prisma.proveedores.upsert({
            where: { id_usuario: usuarios[i].id_usuario },
            update: {},
            create: {
                id_usuario: usuarios[i].id_usuario,
                nombre_negocio: `Tienda ${i}`,
                descripcion: `Somos una empresa familiar dedicada a ofrecer productos de calidad. Tenemos más de ${5 + i} años de experiencia en el mercado.`,
                telefono_contacto: `+56912345${100 + i}`,
                direccion: `Av. Providencia ${1000 + i * 100}, Santiago`,
                latitud: -33.45 + (Math.random() - 0.5) * 0.1,
                longitud: -70.66 + (Math.random() - 0.5) * 0.1,
                destacado: i % 3 === 0,
                email: `tienda${i}@business.com`,
            },
        });
        proveedores.push(proveedor);
    }
    // Seed clientes
    console.log('👤 Seeding customers...');
    const clientes = [];
    for (let i = 11; i < usuarios.length; i++) {
        const cliente = await prisma.clientes.upsert({
            where: { id_usuario: usuarios[i].id_usuario },
            update: {},
            create: {
                id_usuario: usuarios[i].id_usuario,
                direccion: `Calle Los Rosales ${(i - 10) * 50}, Las Condes`,
                telefono: `+56987654${200 + (i - 10)}`,
            },
        });
        clientes.push(cliente);
    }
    // Seed productos
    console.log('📦 Seeding products...');
    const productos = [];
    const productNames = [
        'Manzanas Rojas Premium',
        'Salmón Fresco del Sur',
        'Pan Integral Artesanal',
        'Queso Manchego Curado',
        'Crema Anti-edad',
        'Bicicleta Mountain Bike',
        'Smartphone Latest Model',
        'Alimento para Perros Premium',
        'Set de Jardinería',
        'Vestido de Verano',
        'Novela Bestseller',
        'Pintura Acrílica Set',
        'Juguete Educativo',
        'Vino Tinto Reserva',
        'Café Gourmet Orgánico',
        'Yogurt Griego Natural',
        'Shampoo Hidratante',
        'Pelota de Fútbol',
        'Audífonos Bluetooth',
        'Collar para Gatos',
    ];
    for (let i = 0; i < proveedores.length; i++) {
        // Each provider has 3-5 products
        const numProducts = 3 + Math.floor(Math.random() * 3);
        for (let j = 0; j < numProducts; j++) {
            const randomProduct = productNames[Math.floor(Math.random() * productNames.length)];
            const categoriaId = categories[Math.floor(Math.random() * categories.length)].id;
            const precio = Math.floor(Math.random() * 50000) + 1000; // Between 1,000 and 51,000
            const producto = await prisma.productos.create({
                data: {
                    id_proveedor: proveedores[i].id_proveedor,
                    id_categoria: categoriaId,
                    nombre_producto: `${randomProduct} - ${proveedores[i].nombre_negocio}`,
                    descripcion: `Producto de alta calidad ofrecido por ${proveedores[i].nombre_negocio}. Ideal para uso diario con excelente relación calidad-precio.`,
                    precio_unitario: precio,
                    imagen_url: `https://picsum.photos/400/400?random=${i * 10 + j}`,
                    disponible: Math.random() > 0.1, // 90% available
                },
            });
            productos.push(producto);
        }
    }
    // Seed comentarios
    console.log('💬 Seeding comments...');
    const comentarios = [
        'Excelente producto, muy recomendado!',
        'Buena calidad pero precio un poco alto.',
        'Perfecto, llegó en tiempo y forma.',
        'No cumplió mis expectativas.',
        'Increíble calidad, volveré a comprar.',
    ];
    for (let i = 0; i < Math.min(productos.length, 30); i++) {
        const clienteIndex = Math.floor(Math.random() * clientes.length);
        await prisma.comentarios.create({
            data: {
                id_cliente: clientes[clienteIndex].id_usuario,
                id_producto: productos[i].id_producto,
                texto: comentarios[Math.floor(Math.random() * comentarios.length)],
                calificacion: Math.floor(Math.random() * 5) + 1,
            },
        });
    }
    // Seed suscripciones
    console.log('📋 Seeding subscriptions...');
    for (let i = 0; i < proveedores.length; i++) {
        await prisma.suscripciones.create({
            data: {
                id_proveedor: proveedores[i].id_proveedor,
                id_plan: planes[i % planes.length].id_plan,
                fecha_inicio: (0, dayjs_1.default)()
                    .subtract(Math.floor(Math.random() * 30), 'day')
                    .toDate(),
                activa: Math.random() > 0.2, // 80% active
            },
        });
    }
    // Seed compras_colectivas
    console.log('🤝 Seeding collective buying campaigns...');
    const campaigns = [];
    for (let i = 0; i < 8; i++) {
        const producto = productos[Math.floor(Math.random() * productos.length)];
        const descuento = 0.1 + Math.random() * 0.3; // 10-40% discount
        const precio_objetivo = Math.floor(producto.precio_unitario.toNumber() * (1 - descuento));
        const campaign = await prisma.compras_colectivas.create({
            data: {
                nombre: `Compra Colectiva: ${producto.nombre_producto}`,
                descripcion: `¡Únete y ahorra hasta ${Math.floor(descuento * 100)}% en ${producto.nombre_producto}!`,
                id_proveedor: producto.id_proveedor,
                id_producto: producto.id_producto,
                precio_objetivo: precio_objetivo,
                cantidad_objetivo: 50 + Math.floor(Math.random() * 100), // 50-150 units
                min_participantes: 5,
                max_participantes: 200,
                cantidad_min_usuario: 1,
                cantidad_max_usuario: 10,
                fecha_inicio: (0, dayjs_1.default)()
                    .subtract(Math.floor(Math.random() * 7), 'day')
                    .toDate(),
                fecha_fin: (0, dayjs_1.default)()
                    .add(7 + Math.floor(Math.random() * 14), 'day')
                    .toDate(),
                estado: ['abierta', 'abierta', 'abierta', 'cerrada'][Math.floor(Math.random() * 4)],
            },
        });
        campaigns.push(campaign);
    }
    // Seed escalas_precios for campaigns
    console.log('💸 Seeding price tiers...');
    for (const campaign of campaigns) {
        const basePrice = campaign.precio_objetivo;
        const tiers = [
            { cantidad: 10, descuento: 0 },
            { cantidad: 25, descuento: 0.05 },
            { cantidad: 50, descuento: 0.15 },
            { cantidad: 100, descuento: 0.25 },
        ];
        for (const tier of tiers) {
            await prisma.escalas_precios.create({
                data: {
                    id_campana: campaign.id_campana,
                    cantidad_minima: tier.cantidad,
                    precio_unitario: Math.floor(basePrice.toNumber() * (1 - tier.descuento)),
                    descuento_porcentaje: tier.descuento * 100,
                },
            });
        }
    }
    // Seed participants for campaigns
    console.log('👥 Seeding campaign participants...');
    for (const campaign of campaigns) {
        if (campaign.estado === 'abierta') {
            const numParticipants = 3 + Math.floor(Math.random() * 8); // 3-10 participants (reduced)
            const participantUsers = usuarios.slice(11, 11 + numParticipants); // Use customer users
            for (const user of participantUsers) {
                const cantidad = 1 + Math.floor(Math.random() * 2); // 1-2 units per participant (reduced)
                const monto = Number(campaign.precio_objetivo) * cantidad;
                try {
                    await prisma.participanteColectivo.create({
                        data: {
                            id_campana: campaign.id_campana,
                            id_usuario: user.id_usuario,
                            cantidad: cantidad,
                            monto_aportado: monto,
                        },
                    });
                }
                catch (error) {
                    // Skip if duplicate participant (unique constraint)
                    console.log(`Skipping duplicate participant for campaign ${campaign.id_campana}`);
                }
            }
        }
    }
    // Seed progreso_campana
    console.log('📊 Seeding campaign progress...');
    for (const campaign of campaigns) {
        const participants = await prisma.participanteColectivo.findMany({
            where: { id_campana: campaign.id_campana },
        });
        const participantes_actuales = participants.length;
        const cantidad_actual = participants.reduce((sum, p) => sum + p.cantidad, 0);
        // Convert to numbers to avoid Prisma Decimal issues, then limit the size
        const monto_recaudado = Math.min(participants.reduce((sum, p) => sum + Number(p.monto_aportado), 0), 99999999.99);
        const porcentaje_completado = Math.min((cantidad_actual / campaign.cantidad_objetivo) * 100, 100);
        await prisma.progreso_campana.create({
            data: {
                id_campana: campaign.id_campana,
                participantes_actuales,
                cantidad_actual,
                monto_recaudado,
                porcentaje_completado: Math.round(porcentaje_completado * 100) / 100, // Round to 2 decimals
                precio_actual: campaign.precio_objetivo,
                siguiente_tier: cantidad_actual < 25 ? 25 : cantidad_actual < 50 ? 50 : 100,
            },
        });
    }
    // Seed some orders
    console.log('🛒 Seeding orders...');
    for (let i = 0; i < 10; i++) {
        const cliente = clientes[Math.floor(Math.random() * clientes.length)];
        const isCollective = Math.random() > 0.7; // 30% collective orders
        const order = await prisma.pedidos.create({
            data: {
                id_usuario: cliente.id_usuario,
                tipo_pedido: isCollective ? 'colectivo' : 'individual',
                id_campana: isCollective
                    ? campaigns[Math.floor(Math.random() * campaigns.length)].id_campana
                    : null,
                total: Math.floor(Math.random() * 50000) + 5000,
                estado: ['pendiente', 'confirmado', 'enviado', 'entregado'][Math.floor(Math.random() * 4)],
                direccion_entrega: cliente.direccion,
            },
        });
        // Add order items
        const numItems = 1 + Math.floor(Math.random() * 3);
        for (let j = 0; j < numItems; j++) {
            const producto = productos[Math.floor(Math.random() * productos.length)];
            const cantidad = 1 + Math.floor(Math.random() * 3);
            await prisma.itemPedido.create({
                data: {
                    id_pedido: order.id_pedido,
                    id_producto: producto.id_producto,
                    cantidad,
                    precio_unitario: producto.precio_unitario,
                    subtotal: producto.precio_unitario.toNumber() * cantidad,
                },
            });
        }
    }
    // Seed notifications
    console.log('🔔 Seeding notifications...');
    const notificationTypes = [
        {
            tipo: 'campana_iniciada',
            titulo: 'Nueva campaña disponible',
            mensaje: 'Se ha iniciado una nueva compra colectiva que te puede interesar.',
        },
        {
            tipo: 'objetivo_alcanzado',
            titulo: '¡Objetivo alcanzado!',
            mensaje: 'La campaña ha alcanzado su objetivo mínimo.',
        },
        {
            tipo: 'nuevo_tier',
            titulo: 'Nuevo nivel de descuento',
            mensaje: 'Se ha desbloqueado un nuevo nivel de descuento en la campaña.',
        },
        {
            tipo: 'pedido_confirmado',
            titulo: 'Pedido confirmado',
            mensaje: 'Tu pedido ha sido confirmado y está en proceso.',
        },
    ];
    for (let i = 0; i < 20; i++) {
        const user = usuarios[11 + Math.floor(Math.random() * (usuarios.length - 11))]; // Customer users
        const notif = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        await prisma.notificaciones.create({
            data: {
                id_usuario: user.id_usuario,
                tipo: notif.tipo,
                titulo: notif.titulo,
                mensaje: notif.mensaje,
                leida: Math.random() > 0.4, // 60% read
                id_campana: Math.random() > 0.5
                    ? campaigns[Math.floor(Math.random() * campaigns.length)].id_campana
                    : null,
            },
        });
    }
    // Seed wishlist
    console.log('❤️ Seeding wishlists...');
    for (let i = 0; i < 15; i++) {
        const user = usuarios[11 + Math.floor(Math.random() * (usuarios.length - 11))];
        const producto = productos[Math.floor(Math.random() * productos.length)];
        try {
            await prisma.lista_deseos.create({
                data: {
                    id_usuario: user.id_usuario,
                    id_producto: producto.id_producto,
                    cantidad_deseada: 1 + Math.floor(Math.random() * 5),
                    precio_maximo: Math.floor(producto.precio_unitario.toNumber() * (0.8 + Math.random() * 0.4)),
                },
            });
        }
        catch (error) {
            // Ignore duplicate entries
        }
    }
    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`👥 Users: ${usuarios.length}`);
    console.log(`🏪 Providers: ${proveedores.length}`);
    console.log(`👤 Customers: ${clientes.length}`);
    console.log(`📦 Products: ${productos.length}`);
    console.log(`🤝 Collective Campaigns: ${campaigns.length}`);
    console.log('\n🎉 Your marketplace is ready to use!');
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map