import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedVenues() {
    console.log('🏛️ Creating venues...');

    const venuesData = [
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
    ];

    for (const venue of venuesData) {
        await prisma.venue.create({ data: venue });
    }

    console.log('✅ 5 Venues created successfully!');
}

seedVenues()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
