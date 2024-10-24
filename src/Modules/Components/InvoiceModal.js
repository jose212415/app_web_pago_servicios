import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

function InvoiceModal({ services, meters, onClose, onSave, isWater, isElectricity }) {
    const [selectedMeter, setSelectedMeter] = useState("");
    const [selectedNumberMeter, setSelectedNumberMeter] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);  // Almacena los datos del usuario asociado al contador
    const [selectedService, setSelectedService] = useState("");
    const [consumption, setConsumption] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [consumptionType, setConsumptionType] = useState("");
    const [ service, setService ] = useState("");

    // Cuando cambia el contador, obtenemos el usuario asociado
    useEffect(() => {
        const meter = meters.find(meter => meter._id === selectedMeter);
        if (meter) {
            setSelectedUser(meter.userId);  // Almacena los datos del usuario desde el contador
            setSelectedNumberMeter(meter.meterNumber);
        } else {
            setSelectedUser(null);
            setSelectedNumberMeter("");
        }
    }, [selectedMeter, meters]);

    // Seleccionar automáticamente el servicio si es electricidad o agua
    useEffect(() => {
        if (isElectricity) {
            const electricityService = services.find(service => service.serviceType === "Electricidad");
            setSelectedService(electricityService?._id || "");
            setTotalAmount(electricityService?.baseCost || 0);
            setService(electricityService?.serviceType || "");
        } else {
            const waterService = services.find(service => service.serviceType === "Agua");
            //const garbageService = services.find(service => service.serviceType === "Basura");
            setSelectedService(waterService?._id || "");
            setService(waterService?.serviceType || "");
        }
    }, [isElectricity, services]);

    // Calcular el costo total basado en el consumo si es electricidad
    const handleConsumptionChange = (e) => {
        const value = e.target.value;
        setConsumption(value);

        if (isElectricity) {
            const electricityService = services.find(service => service.serviceType === "Electricidad");
            const total = (electricityService.baseCost * value).toFixed(2);
            setTotalAmount(parseFloat(total));
        } 
    };

    // Función para calcular el costo del consumo de agua
    const consumptionWater = (tipoConsumo) => {
        const waterService = services.find(service => service.serviceType === "Agua");
        let costo = 0;

        if (tipoConsumo === "normal") {
            costo = waterService.baseCost; // Costo por consumo normal
        } else if (tipoConsumo === "excesivo") {
            costo = waterService.baseCost * 2; // Un ejemplo de cómo calcular costo excesivo (1.5 veces el costo base)
        }

        setTotalAmount(costo + (services.find(service => service.serviceType === "Basura")?.baseCost || 0));
    };

    const handleSave = () => {
        if (!selectedMeter || !selectedService) {
            Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
            return;
        }

        let serviceIds = [selectedService];

        if (!isElectricity) {
            // Si es agua, incluir también el servicio de basura
            const garbageService = services.find(service => service.serviceType === "Basura");
            serviceIds.push(garbageService?._id);
        }

        const newInvoice = {
            userId: selectedUser._id,
            serviceIds,
            meterId: selectedMeter,
            meterNumber: selectedNumberMeter,
            service,
            totalAmount,
            consumption
        };

        onSave(newInvoice);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h3 className="text-xl font-bold mb-4">Nueva Factura</h3>
                <form>
                    {/* Selección del Contador */}
                    <label className="block mb-2">Contador</label>
                    <select
                        value={selectedMeter}
                        onChange={(e) => setSelectedMeter(e.target.value)}
                        className="border p-2 rounded w-full mb-4"
                    >
                        <option value="">Seleccionar contador</option>
                        {meters.map(meter => (
                            <option key={meter._id} value={meter._id}>
                                {meter.meterNumber} - {meter.meterType === 'electricity' ? 'Electricidad' : 'Agua'}
                            </option>
                        ))}
                    </select>

                    {/* Mostrar los datos del usuario automáticamente */}
                    {selectedUser && (
                        <div className="mb-4">
                            <p><strong>Usuario:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
                            <b></b>
                            <p><strong>Correo:</strong> {selectedUser.email}</p>
                        </div>
                    )}

                    {/* Input para el consumo si el servicio es electricidad */}
                    {isElectricity && (
                        <div>
                            <label className="block mb-2">Consumo (kWh)</label>
                            <input
                                type="number"
                                value={consumption}
                                onChange={handleConsumptionChange}
                                className="border p-2 rounded w-full mb-4"
                            />
                        </div>
                    )}
                    {/* Seleccion del Consumo de Agua (Normal o Exceso) */}
                    {isWater && (
                        <div>
                            <label className="block mb-2">Consumo de Agua</label>
                            <select
                                value={consumptionType}
                                onChange={(e) => {
                                    setConsumptionType(e.target.value);
                                    consumptionWater(e.target.value);
                                }}
                                className="border p-2 rounded w-full mb-4"
                            >
                                <option value="">Seleccionar consumo</option>
                                <option value="normal">Consumo Normal</option>
                                <option value="excesivo">Consumo Excesivo</option>
                            </select>

                            {/* Mostrar el costo del servicio de basura */}
                            <label className="block mb-2">Costo Servicio de Basura</label>
                            <input
                                type="number"
                                value={services.find(service => service.serviceType === "Basura")?.baseCost}
                                readOnly
                                className="border p-2 rounded w-full mb-4"
                            />

                        </div>
                    )}

                    {/* Mostrar el costo del servicio */}
                    <label className="block mb-2">Costo Total</label>
                    <input
                        type="number"
                        value={totalAmount}
                        readOnly
                        className="border p-2 rounded w-full mb-4"
                    />

                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="bg-green-500 text-white px-4 py-2 mr-2 rounded hover:bg-green-600"
                            onClick={handleSave}
                        >
                            Guardar Factura
                        </button>
                        <button
                            type="button"
                            className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default InvoiceModal;
