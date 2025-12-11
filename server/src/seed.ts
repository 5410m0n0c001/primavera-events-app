import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // Clear existing data (optional but good for dev)
    // await prisma.catalogItem.deleteMany({});
    // await prisma.catalogSubCategory.deleteMany({});
    // await prisma.catalogCategory.deleteMany({});

    // --- 1. MOBILIARIO ---
    const catMobiliario = await prisma.catalogCategory.create({
        data: { name: 'Mobiliario', description: 'Mesas, Sillas, Salas Lounge' }
    });

    const subSillas = await prisma.catalogSubCategory.create({ data: { name: 'Sillas', categoryId: catMobiliario.id } });
    const sillasData = [
        { name: 'Silla Tiffany', price: 45.00, unit: 'pieza', options: JSON.stringify({ material: ['Madera', 'Resina'], color: ['Dorado', 'Plateado', 'Blanco', 'Chocolate', 'Rose Gold'] }) },
        { name: 'Silla Versailles', price: 55.00, unit: 'pieza', options: JSON.stringify({ color: ['Dorado', 'Plata', 'Blanco'] }) },
        { name: 'Silla Crossback', price: 60.00, unit: 'pieza', options: JSON.stringify({ color: ['Madera Lavada', 'Nogal'] }) },
        { name: 'Silla Avant Garde', price: 40.00, unit: 'pieza', options: JSON.stringify({ color: ['Blanca'] }) },
        { name: 'Silla Ghost', price: 65.00, unit: 'pieza', options: JSON.stringify({ style: ['Con brazos', 'Sin brazos'] }) }
    ];
    for (const item of sillasData) await prisma.catalogItem.create({ data: { ...item, subCategoryId: subSillas.id } });

    const subMesas = await prisma.catalogSubCategory.create({ data: { name: 'Mesas', categoryId: catMobiliario.id } });
    const mesasData = [
        { name: 'Mesa Redonda (10 pax)', price: 150.00, unit: 'pieza', options: JSON.stringify({ size: '1.50m' }) },
        { name: 'Mesa Tablón (10 pax)', price: 180.00, unit: 'pieza', options: JSON.stringify({ size: '2.40m' }) },
        { name: 'Mesa Imperial (12-14 pax)', price: 350.00, unit: 'pieza', options: JSON.stringify({ finish: ['Madera', 'Espejo', 'Mármol'] }) },
        { name: 'Mesa de Novios', price: 400.00, unit: 'pieza', options: JSON.stringify({ style: 'Vintage' }) }
    ];
    for (const item of mesasData) await prisma.catalogItem.create({ data: { ...item, subCategoryId: subMesas.id } });

    // --- 2. CATERING ---
    const catCatering = await prisma.catalogCategory.create({
        data: { name: 'Catering', description: 'Banquetes y Alimentos' }
    });

    const subMenus = await prisma.catalogSubCategory.create({ data: { name: 'Menús Base', categoryId: catCatering.id } });
    const menusData = [
        { name: 'Menú 3 Tiempos', price: 450.00, unit: 'persona', options: JSON.stringify({ courses: ['Entrada/Crema', 'Plato Fuerte', 'Postre'] }) },
        { name: 'Menú 4 Tiempos', price: 550.00, unit: 'persona', options: JSON.stringify({ courses: ['Entrada', 'Crema', 'Plato Fuerte', 'Postre'] }) },
        { name: 'Buffet Mexicano', price: 380.00, unit: 'persona', options: JSON.stringify({ variety: 'High' }) }
    ];
    for (const item of menusData) await prisma.catalogItem.create({ data: { ...item, subCategoryId: subMenus.id } });

    const subPlatos = await prisma.catalogSubCategory.create({ data: { name: 'Platos Fuertes', categoryId: catCatering.id } });
    const platosData = [
        { name: 'Filete Mignon', price: 0.00, unit: 'opción', options: JSON.stringify({ type: 'Res' }) },
        { name: 'Suprema de Pollo', price: 0.00, unit: 'opción', options: JSON.stringify({ type: 'Pollo' }) },
        { name: 'Salmón', price: 50.00, unit: 'suplemento', options: JSON.stringify({ type: 'Pescado' }) }
    ];
    for (const item of platosData) await prisma.catalogItem.create({ data: { ...item, subCategoryId: subPlatos.id } });

    // --- 3. DECORACIÓN ---
    const catDecor = await prisma.catalogCategory.create({
        data: { name: 'Decoración y Textiles', description: 'Manteles, Servilletas, Centros de Mesa' }
    });
    const subManteles = await prisma.catalogSubCategory.create({ data: { name: 'Mantelería', categoryId: catDecor.id } });
    const mantelesData = [
        { name: 'Mantel Liso', price: 80.00, unit: 'pieza', options: JSON.stringify({ colors: ['Blanco', 'Negro', 'Ivory'] }) },
        { name: 'Mantel Brocado', price: 120.00, unit: 'pieza', options: JSON.stringify({ colors: ['Dorado', 'Plata'] }) },
        { name: 'Camino de Mesa', price: 45.00, unit: 'pieza', options: JSON.stringify({ material: 'Organza/Lino' }) },
        { name: 'Servilleta de Tela', price: 15.00, unit: 'pieza', options: JSON.stringify({ colors: 'Variados' }) }
    ];
    for (const item of mantelesData) await prisma.catalogItem.create({ data: { ...item, subCategoryId: subManteles.id } });

    // --- 4. BEBIDAS ---
    const catBebidas = await prisma.catalogCategory.create({
        data: { name: 'Barra Libre', description: 'Servicio de bebidas por 5 horas' }
    });
    const subBarra = await prisma.catalogSubCategory.create({ data: { name: 'Paquetes de Barra', categoryId: catBebidas.id } });
    const barraData = [
        { name: 'Barra Nacional', price: 250.00, unit: 'persona', options: JSON.stringify({ brands: ['Bacardi', 'Cuervo Tradicional', 'Smirnoff'] }) },
        { name: 'Barra Internacional', price: 400.00, unit: 'persona', options: JSON.stringify({ brands: ['Etiqueta Roja', 'Absolut', 'Torres 10', 'Don Julio 70'] }) },
        { name: 'Mezcal Bar', price: 150.00, unit: 'persona', options: JSON.stringify({ type: 'Add-on' }) }
    ];
    for (const item of barraData) await prisma.catalogItem.create({ data: { ...item, subCategoryId: subBarra.id } });

    // --- 5. STAFF Y EXTRAS ---
    const catExtras = await prisma.catalogCategory.create({
        data: { name: 'Servicios Adicionales', description: 'Personal, Música y Pista' }
    });
    const subStaff = await prisma.catalogSubCategory.create({ data: { name: 'Personal', categoryId: catExtras.id } });
    const staffData = [
        { name: 'Mesero (5 horas)', price: 600.00, unit: 'servicio', options: JSON.stringify({ ratio: '1:15' }) },
        { name: 'Capitán de Meseros', price: 1200.00, unit: 'servicio', options: JSON.stringify({ required: '1 por evento' }) },
        { name: 'Barman', price: 700.00, unit: 'servicio', options: JSON.stringify({ required: '1 por barra' }) }
    ];
    for (const item of staffData) await prisma.catalogItem.create({ data: { ...item, subCategoryId: subStaff.id } });

    const subEnt = await prisma.catalogSubCategory.create({ data: { name: 'Entretenimiento', categoryId: catExtras.id } });
    const entData = [
        { name: 'DJ Profesional', price: 8500.00, unit: 'evento', options: JSON.stringify({ includes: ['Audio', 'Iluminación'] }) },
        { name: 'Pista de Baile Madera', price: 250.00, unit: 'm2', options: JSON.stringify({ size: 'm2' }) },
        { name: 'Photobooth Espejo', price: 4500.00, unit: 'servicio', options: JSON.stringify({ hours: 3 }) }
    ];
    for (const item of entData) await prisma.catalogItem.create({ data: { ...item, subCategoryId: subEnt.id } });

    // --- 6. PAQUETES ---
    const catPaquetes = await prisma.catalogCategory.create({
        data: { name: 'Paquetes', description: 'Bodas Todo Incluido' }
    });
    const subPaquetes = await prisma.catalogSubCategory.create({ data: { name: 'Paquetes Boda', categoryId: catPaquetes.id } });
    const paquetesData = [
        { name: 'Paquete Silver', price: 1200.00, unit: 'persona', options: JSON.stringify({ incluye: ['Menú 3 Tiempos', 'Barra Nacional (5hrs)', 'DJ Básico', 'Mobiliario Tiffany'] }) },
        { name: 'Paquete Gold', price: 1800.00, unit: 'persona', options: JSON.stringify({ incluye: ['Menú 4 Tiempos', 'Barra Internacional', 'Grupo Versátil', 'Mobiliario Versailles', 'Pista Madera'] }) },
        { name: 'Paquete Platinum', price: 2500.00, unit: 'persona', options: JSON.stringify({ incluye: ['Menú Autor', 'Barra Premium + Gin', 'Grupo Show', 'Mobiliario Imperial Lujo', 'Pista Charol', 'Decoración Floral Alta'] }) }
    ];
    for (const item of paquetesData) await prisma.catalogItem.create({ data: { ...item, subCategoryId: subPaquetes.id } });

    // --- 7. INVENTARIO (VAJILLA & EQUIPO) ---
    const catEquipo = await prisma.catalogCategory.create({
        data: { name: 'Vajilla & Equipo', description: 'Cristalería, Plaqué, Audio' }
    });

    const subVajilla = await prisma.catalogSubCategory.create({ data: { name: 'Vajilla', categoryId: catEquipo.id } });
    const vajillaData = [
        { name: 'Plato Trinche Base', price: 15.00, unit: 'pieza', stock: 200, options: JSON.stringify({ material: 'Cerámica', color: 'Blanco' }) },
        { name: 'Plato Hondo', price: 12.00, unit: 'pieza', stock: 200, options: JSON.stringify({ material: 'Cerámica' }) },
        { name: 'Plato Postre', price: 10.00, unit: 'pieza', stock: 200, options: JSON.stringify({ design: 'Vintage' }) }
    ];
    for (const item of vajillaData) await prisma.catalogItem.create({ data: { ...item, subCategoryId: subVajilla.id } });

    const subCristal = await prisma.catalogSubCategory.create({ data: { name: 'Cristalería', categoryId: catEquipo.id } });
    const cristalData = [
        { name: 'Copa Vino Tinto', price: 12.00, unit: 'pieza', stock: 300, options: JSON.stringify({ style: 'Cabernet' }) },
        { name: 'Copa Flauta (Champagne)', price: 14.00, unit: 'pieza', stock: 300, options: JSON.stringify({ style: 'Tulip' }) },
        { name: 'Vaso Highball', price: 8.00, unit: 'pieza', stock: 500, options: JSON.stringify({ type: 'Cristal Cortado' }) }
    ];
    for (const item of cristalData) await prisma.catalogItem.create({ data: { ...item, subCategoryId: subCristal.id } });

    const subPlaque = await prisma.catalogSubCategory.create({ data: { name: 'Plaqué', categoryId: catEquipo.id } });
    const plaqueData = [
        { name: 'Set Cubiertos Oro (3 pzas)', price: 25.00, unit: 'set', stock: 150, options: JSON.stringify({ finish: 'Gold Matte' }) },
        { name: 'Set Cubiertos Plata', price: 18.00, unit: 'set', stock: 200, options: JSON.stringify({ finish: 'Silver Polish' }) }
    ];
    for (const item of plaqueData) await prisma.catalogItem.create({ data: { ...item, subCategoryId: subPlaque.id } });

    // --- VENUES ---
    console.log('🏛️ Creating venues...');

    await prisma.venue.createMany({
        data: [
            {
                name: 'Salón Los Caballos',
                type: 'salon',
                address: 'Av. Principal 123, Centro',
                city: 'Yolomécatl',
                capacity: 250,
                description: 'Elegante salón con acabados de lujo, ideal para bodas y eventos corporativos de gran escala.',
                hourlyRate: 3500,
                workingHours: '09:00-02:00',
                services: JSON.stringify([
                    'Estacionamiento para 100 autos',
                    'Aire Acondicionado',
                    'Cocina Industrial',
                    'Sistema de Audio Profesional',
                    'Iluminación LED',
                    'Pista de Baile',
                    'Área VIP'
                ]),
                restrictions: JSON.stringify([
                    'No fumar en áreas cerradas',
                    'No pirotecnia',
                    'Volumen moderado después de las 12am'
                ]),
                packageOptions: JSON.stringify([
                    { name: 'Paquete Básico', price: 15000, includes: ['Salón 8 horas', 'Mesas y sillas', 'Mantelería blanca'] },
                    { name: 'Paquete Premium', price: 25000, includes: ['Salón 10 horas', 'Mesas y sillas', 'Mantelería de color', 'Decoración básica', 'DJ'] }
                ])
            },
            {
                name: 'Salón Los Potrillos',
                type: 'salon',
                address: 'Calle Reforma 456, Col. Jardines',
                city: 'Yolomécatl',
                capacity: 150,
                description: 'Salón acogedor perfecto para eventos familiares y celebraciones íntimas.',
                hourlyRate: 2500,
                workingHours: '10:00-01:00',
                services: JSON.stringify([
                    'Estacionamiento',
                    'Aire Acondicionado',
                    'Cocina',
                    'Sistema de Audio',
                    'Proyector'
                ]),
                restrictions: JSON.stringify([
                    'No mascotas',
                    'No fumar',
                    'Máximo 150 personas'
                ]),
                packageOptions: JSON.stringify([
                    { name: 'Paquete Familiar', price: 12000, includes: ['Salón 6 horas', 'Mesas y sillas', 'Sonido básico'] }
                ])
            },
            {
                name: 'Salón Jardín Yolomécatl',
                type: 'jardin',
                address: 'Carretera Estatal Km 5.5',
                city: 'Yolomécatl',
                capacity: 300,
                description: 'Hermoso jardín al aire libre con árboles centenarios y fuente central. Ideal para bodas campestres.',
                hourlyRate: 4000,
                workingHours: '08:00-23:00',
                services: JSON.stringify([
                    'Jardín arbolado',
                    'Fuente ornamental',
                    'Estacionamiento amplio',
                    'Baños',
                    'Área techada',
                    'Iluminación exterior',
                    'Generador eléctrico'
                ]),
                restrictions: JSON.stringify([
                    'No eventos con lluvia (sin techo completo)',
                    'Horario máximo 11pm',
                    'No fogatas'
                ]),
                packageOptions: JSON.stringify([
                    { name: 'Paquete Jardín', price: 20000, includes: ['Jardín completo 8 horas', 'Sillas', 'Iluminación'] }
                ])
            },
            {
                name: 'Jardín La Flor',
                type: 'jardin',
                address: 'Camino Real 789, Fraccionamiento Las Flores',
                city: 'Yolomécatl',
                capacity: 200,
                description: 'Jardín boutique con diseño moderno y áreas verdes cuidadas. Perfecto para eventos elegantes al aire libre.',
                hourlyRate: 3000,
                workingHours: '09:00-22:00',
                services: JSON.stringify([
                    'Jardín con pérgola',
                    'Estacionamiento',
                    'Baños modernos',
                    'Cocina equipada',
                    'Mobiliario lounge',
                    'Iluminación ambiental'
                ]),
                restrictions: JSON.stringify([
                    'Solo eventos diurnos/vespertinos',
                    'No música en vivo después de 10pm',
                    'Capacidad máxima estricta'
                ]),
                packageOptions: JSON.stringify([
                    { name: 'Paquete Boutique', price: 18000, includes: ['Jardín 6 horas', 'Mobiliario lounge', 'Decoración floral'] }
                ])
            },
            {
                name: 'Salón Presidente',
                type: 'salon',
                address: 'Blvd. Presidentes 1000, Zona Dorada',
                city: 'Yolomécatl',
                capacity: 400,
                description: 'El salón más grande y lujoso de la región. Equipamiento de primer nivel para eventos corporativos y sociales de alto perfil.',
                hourlyRate: 5000,
                workingHours: '08:00-03:00',
                services: JSON.stringify([
                    'Estacionamiento valet',
                    'Aire Acondicionado central',
                    'Cocina industrial doble',
                    'Sistema de audio Bose',
                    'Iluminación inteligente',
                    'Pantallas LED',
                    'Camerinos',
                    'Área VIP privada',
                    'Seguridad privada'
                ]),
                restrictions: JSON.stringify([
                    'Requiere seguro de evento',
                    'No pirotecnia interior',
                    'Depósito reembolsable $5,000'
                ]),
                packageOptions: JSON.stringify([
                    { name: 'Paquete Ejecutivo', price: 30000, includes: ['Salón 8 horas', 'Todo incluido', 'Coordinador de evento'] },
                    { name: 'Paquete VIP', price: 50000, includes: ['Salón 12 horas', 'Servicio completo', 'Decoración premium', 'Valet parking'] }
                ])
            }
        ]
    });

    console.log('✅ Venues created!');

    console.log('Seeding finished with EXTENDED detailed catalog.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
