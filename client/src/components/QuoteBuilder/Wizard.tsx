import React, { useState } from 'react';
import type { QuoteDraft } from '../../types';
import ServiceSelector from './ServiceSelector';
import ReviewQuote from './ReviewQuote';

const QuoteWizard: React.FC = () => {
    const [step, setStep] = useState(1);
    const [draft, setDraft] = useState<QuoteDraft>({
        eventName: '',
        guestCount: 100,
        date: '',
        selectedItems: []
    });

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);


    const handleGeneratePDF = async () => {
        const payload = {
            eventName: draft.eventName,
            guestCount: draft.guestCount,
            date: draft.date,
            items: draft.selectedItems.map(i => ({
                name: i.item?.name || 'Item',
                quantity: i.quantity,
                price: Number(i.item?.price || 0),
                unit: i.item?.unit || 'pz'
            }))
        };

        try {
            const response = await fetch('/api/quotes/generate-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Cotizacion-${draft.eventName.replace(/\s+/g, '_')}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                alert('Error generating PDF');
            }
        } catch (error) {
            console.error('PDF Error:', error);
            alert('Error generating PDF');
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-serif text-primavera-gold font-bold mb-2">
                    Generador de Cotizaciones
                </h1>
                <div className="flex space-x-4 text-sm text-gray-500">
                    <span className={step >= 1 ? 'text-primavera-green font-bold' : ''}>1. Detalles del Evento</span>
                    <span>&gt;</span>
                    <span className={step >= 2 ? 'text-primavera-green font-bold' : ''}>2. Servicios</span>
                    <span>&gt;</span>
                    <span className={step >= 3 ? 'text-primavera-green font-bold' : ''}>3. Resumen</span>
                </div>
            </div>

            <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-100">
                {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold">Detalles Básicos</h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nombre del Evento</label>
                                <input
                                    type="text"
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primavera-gold focus:border-primavera-gold p-2 border"
                                    placeholder="e.j. Boda Juan y Maria"
                                    value={draft.eventName}
                                    onChange={e => setDraft({ ...draft, eventName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Invitados</label>
                                <input
                                    type="number"
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primavera-gold focus:border-primavera-gold p-2 border"
                                    value={draft.guestCount}
                                    onChange={e => setDraft({ ...draft, guestCount: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={nextStep}
                                className="bg-primavera-gold text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition"
                            >
                                Continuar
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <ServiceSelector
                        draft={draft}
                        setDraft={setDraft}
                        onBack={prevStep}
                        onNext={nextStep}
                    />
                )}

                {step === 3 && (
                    <ReviewQuote
                        draft={draft}
                        onBack={prevStep}
                        onGenerate={handleGeneratePDF}
                    />
                )}
            </div>
        </div>
    );
};

export default QuoteWizard;
