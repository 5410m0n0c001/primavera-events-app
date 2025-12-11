import React, { useEffect, useState } from 'react';

// Types (should be in types.ts but inline for speed)
interface InventoryItem {
    id: string;
    name: string;
    unit: string;
    stock: number;
    available?: number;
    status?: string;
}

const InventoryDashboard: React.FC = () => {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [alerts, setAlerts] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        loadData();
    }, [date]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Load Availability
            const res = await fetch(`http://localhost:3000/api/inventory/availability?date=${date}`);
            const data = await res.json();
            setItems(data);

            // Load Alerts
            const alertsRes = await fetch('http://localhost:3000/api/inventory/alerts');
            const alertsData = await alertsRes.json();
            setAlerts(alertsData);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Inventario</h1>

            {/* Alerts Section */}
            {alerts.length > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
                    <h3 className="font-bold text-red-700">⚠️ Alertas de Stock Bajo</h3>
                    <ul className="mt-2 text-sm text-red-600 list-disc pl-5">
                        {alerts.map(a => (
                            <li key={a.id}>{a.name}: Quedan <strong>{a.stock}</strong> {a.unit}s</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Controls */}
            <div className="flex justify-between items-center mb-4 bg-white p-4 rounded shadow-sm">
                <div className="flex items-center gap-4">
                    <label className="font-semibold text-gray-700">Ver Disponibilidad para:</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border rounded p-2"
                    />
                </div>
                <div className="text-sm text-gray-500">
                    Calculando "Apartados" basados en eventos confirmados.
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-gray-600 font-bold uppercase text-xs">
                        <tr>
                            <th className="p-4">Item</th>
                            <th className="p-4">Unidad</th>
                            <th className="p-4 text-center">Stock Total</th>
                            <th className="p-4 text-center">Disponible</th>
                            <th className="p-4 text-center">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {loading ? (
                            <tr><td colSpan={5} className="p-10 text-center">Cargando...</td></tr>
                        ) : items.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium">{item.name}</td>
                                <td className="p-4 text-gray-500">{item.unit}</td>
                                <td className="p-4 text-center font-bold">{item.stock}</td>
                                <td className={`p-4 text-center font-bold ${item.available! < 0 ? 'text-red-500' : 'text-green-600'}`}>
                                    {item.available}
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${item.available! > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {item.available! > 0 ? 'DISPONIBLE' : 'AGOTADO'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 text-center text-gray-400 text-sm">
                * El stock se reduce automáticamente si hay eventos confirmados en la fecha seleccionada.
            </div>
        </div>
    );
};

export default InventoryDashboard;
