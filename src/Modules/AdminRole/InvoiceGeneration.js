import React, { useState, useEffect } from "react";
import config from "../../config";
import Swal from "sweetalert2";
import InvoiceModal from "../Components/InvoiceModal";  // Importamos el modal

function InvoiceAdministration() {
    const [invoices, setInvoices] = useState([]);
    const [showElectricityModal, setShowElectricityModal] = useState(false);
    const [showWaterModal, setShowWaterModal] = useState(false);
    const [services, setServices] = useState([]);
    const [users, setUsers] = useState([]);
    const [meters, setMeters] = useState([]);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${config.baseURL}/admins/list-invoices`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Error fetching invoices');
                }
                const data = await response.json();
                setInvoices(data);
            } catch (error) {
                console.error('Error fetching invoices', error);
            }
        };

        const fetchServices = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${config.baseURL}/admins/list-services`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Error fetching services');
                }
                const data = await response.json();
                setServices(data);
            } catch (error) {
                console.error('Error fetching services', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${config.baseURL}/admins/list-users`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Error fetching users');
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users', error);
            }
        };

        const fetchMeters = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${config.baseURL}/admins/list-meters`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Error fetching meters');
                }
                const data = await response.json();
                setMeters(data);
            } catch (error) {
                console.error('Error fetching meters', error);
            }
        };

        fetchInvoices();
        fetchServices();
        fetchUsers();
        fetchMeters();
    }, []);

    const fetchInvoices = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.baseURL}/admins/list-invoices`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Error fetching invoices');
            }
            const data = await response.json();
            setInvoices(data);
        } catch (error) {
            console.error('Error fetching invoices', error);
        }
    };

    const handleSaveInvoice = async (newInvoice) => {
        console.log(newInvoice);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.baseURL}/admins/register-invoice`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newInvoice)
            });

            if (!response.ok) {
                throw new Error('Error al crear la factura');
            }

            const result = await response.json();

            Swal.fire('Éxito', result.message, 'success');
            setShowElectricityModal(false);
            setShowWaterModal(false);
            await fetchInvoices(); 
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    };

    return (
        <div className="flex flex-col bg-gradient-to-r from-blue-400 to-indigo-500 min-h-screen p-6">
            <div className="bg-white rounded-lg p-1 mb-2">
                <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">Administración de Facturas</h2>
            </div>

            {/* Botón para abrir el modal de electricidad */}
            <div className="flex bg-white rounded-lg justify-start space-x-4 mb-3 p-3">
                <button
                    onClick={() => setShowElectricityModal(true)}
                    className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-blue-600 transition duration-300"
                >
                    Generar Factura de Electricidad
                </button>

                {/* Botón para abrir el modal de agua */}
                <button
                    onClick={() => setShowWaterModal(true)}
                    className="bg-green-500 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-green-600 transition duration-300"
                >
                    Generar Factura de Agua (Incluye Basura)
                </button>
            </div>

            {/* Tabla de facturas */}
            {invoices.length > 0 ? (
                <div className="overflow-auto bg-white shadow-lg rounded-lg p-4">
                    <table className="min-w-full table-auto">
                        <thead className="bg-indigo-500 text-white">
                            <tr className="bg-blue-500 text-white text-left text-sm uppercase tracking-wider">
                                <th className="px-6 py-3">Usuario</th>
                                <th className="px-6 py-3">Servicios</th>
                                <th className="px-6 py-3">Contador</th>
                                <th className="px-6 py-3">Costo Total</th>
                                <th className="px-6 py-3">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm">
                            {invoices.map((invoice) => (
                                <tr key={invoice._id} className="border-b border-gray-200 hover:bg-gray-100">
                                    {/* Usuario */}
                                    <td className="px-6 py-4">
                                        {invoice.userId ? `${invoice.userId.firstName} ${invoice.userId.lastName}` : 'Usuario no encontrado'}
                                    </td>

                                    {/* Servicios */}
                                    <td className="px-6 py-4">
                                        {Array.isArray(invoice.services) && invoice.services.length > 0 ? (
                                            invoice.services.map((service, index) => (
                                                <p key={index} className="text-gray-600 text-sm">
                                                    {service.serviceId?.serviceType || 'Tipo de servicio no disponible'}
                                                </p>
                                            ))
                                        ) : (
                                            <p className="text-red-500">No hay servicios asociados</p>
                                        )}
                                    </td>

                                    {/* Contador */}
                                    <td className="px-6 py-4">
                                        {invoice.meterId?.meterNumber || 'Contador no encontrado'}
                                    </td>

                                    {/* Costo Total */}
                                    <td className="px-6 py-4">
                                        <span className="font-semibold">Q {invoice.totalAmount || 0}</span>
                                    </td>

                                    {/* Estado */}
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full font-semibold text-sm ${invoice.status === 'paid' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                                            {invoice.status || 'Estado no disponible'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white rounded-lg p-1 mb-2">
                    <p className="mt-6 text-center text-blue-600">No hay facturas registradas.</p>
                </div>
            )}

            {/* Modal para generar facturas de electricidad */}
            {showElectricityModal && (
                <InvoiceModal
                    services={services}
                    meters={meters.filter(meter => meter.meterType === 'electricity')} // Filtra solo contadores de electricidad
                    onClose={() => setShowElectricityModal(false)}
                    onSave={handleSaveInvoice}
                    isWater={false}
                    isElectricity={true}  // Prop adicional para identificar el tipo de factura
                />
            )}

            {/* Modal para generar facturas de agua */}
            {showWaterModal && (
                <InvoiceModal
                    services={services}
                    meters={meters.filter(meter => meter.meterType === 'water')} // Filtra solo contadores de agua
                    onClose={() => setShowWaterModal(false)}
                    onSave={handleSaveInvoice}
                    isWater={true}
                    isElectricity={false}  // Prop adicional para identificar el tipo de factura
                />
            )}
        </div>
    );
}

export default InvoiceAdministration;
