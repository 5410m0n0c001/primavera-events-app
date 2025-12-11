import React, { useState, useEffect } from 'react';

interface Venue {
    id: string;
    name: string;
    type: string;
    address: string;
    city: string;
    capacity: number;
    description?: string;
    hourlyRate: number;
    packageOptions?: string;
    workingHours: string;
    restrictions?: string;
    services?: string;
    imageUrl?: string;
}

interface CalendarEvent {
    id: string;
    date: Date;
    type: string;
    status: string;
    client?: { name: string };
}

const VenuesManager: React.FC = () => {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
    const [view, setView] = useState<'list' | 'detail' | 'edit'>('list');
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(true);

    // Form state for editing
    const [formData, setFormData] = useState<Partial<Venue>>({});

    useEffect(() => {
        loadVenues();
    }, []);

    useEffect(() => {
        if (selectedVenue && view === 'detail') {
            loadVenueCalendar(selectedVenue.id);
        }
    }, [selectedVenue, currentMonth, currentYear, view]);

    const loadVenues = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/venues');
            const data = await res.json();
            setVenues(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const loadVenueCalendar = async (venueId: string) => {
        try {
            const res = await fetch(`http://localhost:3000/api/venues/${venueId}/calendar?month=${currentMonth}&year=${currentYear}`);
            const data = await res.json();
            setCalendarEvents(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSaveVenue = async () => {
        try {
            const url = formData.id
                ? `http://localhost:3000/api/venues/${formData.id}`
                : 'http://localhost:3000/api/venues';

            const method = formData.id ? 'PUT' : 'POST';

            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            loadVenues();
            setView('list');
            setFormData({});
        } catch (e) {
            console.error(e);
        }
    };

    const handleEditVenue = (venue: Venue) => {
        setFormData(venue);
        setView('edit');
    };

    const handleNewVenue = () => {
        setFormData({
            name: '',
            type: 'salon',
            address: '',
            city: 'Yolomécatl',
            capacity: 100,
            hourlyRate: 0,
            workingHours: '09:00-23:00'
        });
        setView('edit');
    };

    const parseJSON = (str?: string) => {
        try {
            return str ? JSON.parse(str) : [];
        } catch {
            return [];
        }
    };

    if (loading) return <div className="p-10 text-center">Cargando locaciones...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-serif font-bold text-gray-800">Locaciones</h1>
                {view === 'list' && (
                    <button onClick={handleNewVenue} className="bg-primavera-gold text-white px-4 py-2 rounded font-bold hover:brightness-110">
                        + Nueva Locación
                    </button>
                )}
                {view !== 'list' && (
                    <button onClick={() => { setView('list'); setSelectedVenue(null); }} className="bg-gray-500 text-white px-4 py-2 rounded font-bold hover:brightness-110">
                        ← Volver
                    </button>
                )}
            </div>

            {/* LIST VIEW */}
            {view === 'list' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {venues.map(venue => (
                        <div key={venue.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer" onClick={() => { setSelectedVenue(venue); setView('detail'); }}>
                            <div className="h-32 bg-gradient-to-br from-primavera-gold to-yellow-600 flex items-center justify-center">
                                <h3 className="text-2xl font-bold text-white">{venue.name}</h3>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                    <span className="capitalize bg-gray-100 px-2 py-1 rounded">{venue.type}</span>
                                    <span>•</span>
                                    <span>{venue.capacity} personas</span>
                                </div>
                                <p className="text-gray-700 text-sm mb-2">{venue.address}</p>
                                <div className="text-lg font-bold text-primavera-gold">${venue.hourlyRate}/hora</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* DETAIL VIEW */}
            {view === 'detail' && selectedVenue && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">{selectedVenue.name}</h2>
                            <p className="text-gray-600 capitalize">{selectedVenue.type} • {selectedVenue.city}</p>
                        </div>
                        <button onClick={() => handleEditVenue(selectedVenue)} className="bg-blue-500 text-white px-4 py-2 rounded font-bold hover:bg-blue-600">
                            Editar
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold text-gray-700 mb-2">📍 Ubicación</h3>
                                <p className="text-gray-600">{selectedVenue.address}, {selectedVenue.city}</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-700 mb-2">👥 Capacidad</h3>
                                <p className="text-gray-600">{selectedVenue.capacity} personas</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-700 mb-2">💰 Renta por Hora</h3>
                                <p className="text-2xl font-bold text-primavera-gold">${selectedVenue.hourlyRate}</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-700 mb-2">🕐 Horarios</h3>
                                <p className="text-gray-600">{selectedVenue.workingHours}</p>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold text-gray-700 mb-2">✨ Servicios</h3>
                                <div className="flex flex-wrap gap-2">
                                    {parseJSON(selectedVenue.services).map((service: string, idx: number) => (
                                        <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">{service}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-700 mb-2">⚠️ Restricciones</h3>
                                <div className="flex flex-wrap gap-2">
                                    {parseJSON(selectedVenue.restrictions).map((restriction: string, idx: number) => (
                                        <span key={idx} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">{restriction}</span>
                                    ))}
                                </div>
                            </div>
                            {selectedVenue.description && (
                                <div>
                                    <h3 className="font-bold text-gray-700 mb-2">📝 Descripción</h3>
                                    <p className="text-gray-600">{selectedVenue.description}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Calendar */}
                    <div className="border-t pt-6">
                        <h3 className="font-bold text-gray-700 mb-4">📅 Calendario de Eventos</h3>
                        <div className="flex gap-4 mb-4">
                            <select value={currentMonth} onChange={(e) => setCurrentMonth(Number(e.target.value))} className="border p-2 rounded">
                                {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((m, i) => (
                                    <option key={i} value={i + 1}>{m}</option>
                                ))}
                            </select>
                            <input type="number" value={currentYear} onChange={(e) => setCurrentYear(Number(e.target.value))} className="border p-2 rounded w-24" />
                        </div>
                        <div className="space-y-2">
                            {calendarEvents.length === 0 && <p className="text-gray-400 italic">No hay eventos programados este mes.</p>}
                            {calendarEvents.map(event => (
                                <div key={event.id} className="bg-gray-50 p-3 rounded border flex justify-between items-center">
                                    <div>
                                        <span className="font-bold">{new Date(event.date).toLocaleDateString()}</span>
                                        <span className="mx-2">•</span>
                                        <span>{event.type}</span>
                                        {event.client && <span className="text-gray-600 ml-2">({event.client.name})</span>}
                                    </div>
                                    <span className={`px-3 py-1 rounded text-sm ${event.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {event.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT VIEW */}
            {view === 'edit' && (
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">{formData.id ? 'Editar' : 'Nueva'} Locación</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre</label>
                                <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border p-2 rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Tipo</label>
                                <select value={formData.type || 'salon'} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full border p-2 rounded">
                                    <option value="salon">Salón</option>
                                    <option value="jardin">Jardín</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Dirección</label>
                            <input type="text" value={formData.address || ''} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full border p-2 rounded" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Ciudad</label>
                                <input type="text" value={formData.city || ''} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full border p-2 rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Capacidad</label>
                                <input type="number" value={formData.capacity || 0} onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })} className="w-full border p-2 rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Renta/Hora ($)</label>
                                <input type="number" value={formData.hourlyRate || 0} onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })} className="w-full border p-2 rounded" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Horarios (HH:MM-HH:MM)</label>
                            <input type="text" value={formData.workingHours || ''} onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })} className="w-full border p-2 rounded" placeholder="09:00-23:00" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
                            <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full border p-2 rounded" rows={3}></textarea>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button onClick={handleSaveVenue} className="bg-primavera-gold text-white px-6 py-2 rounded font-bold hover:brightness-110">
                                Guardar
                            </button>
                            <button onClick={() => { setView('list'); setFormData({}); }} className="bg-gray-300 text-gray-700 px-6 py-2 rounded font-bold hover:bg-gray-400">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VenuesManager;
