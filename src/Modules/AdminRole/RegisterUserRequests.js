import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import config from "../../config";

function RegisterUserRequests() {
    const location = useLocation();
    const [requests, setRequests] = useState(location.state?.requests || []);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [electricityMeters, setElectricityMeters] = useState([]);
    const [waterMeters, setWaterMeters] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${config.localURL}/admins/list-pending-requests`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Error fetching requests');
                }
                const data = await response.json();
                setRequests(data);
            } catch (error) {
                console.error('Error fetching requests', error);
            }
        };

        fetchRequests(); // Fetch the requests initially
    }, []);

    const handleFollowUp = (requestId) => {
        const request = requests.find((r) => r._id === requestId);
        setSelectedRequest(request);
        setShowModal(true);
    };

    const handleAuthorize = async () => {
        if (selectedRequest && (electricityMeters.length > 0 || waterMeters.length > 0)) {
            const meters = [
                ...electricityMeters.map((meter) => ({ type: "electricity", number: meter })),
                ...waterMeters.map((meter) => ({ type: "water", number: meter })),
            ];

            const requestData = {
                requestId: selectedRequest._id,
                user: {
                    firstName: selectedRequest.firstName,
                    lastName: selectedRequest.lastName,
                    email: selectedRequest.email,
                    passwordHash: selectedRequest.passwordHash,
                    address: selectedRequest.address,
                    phone: selectedRequest.phone,
                    role: selectedRequest.role,
                },
                meters: meters,
            };

            try {
                const response = await fetch(`${config.baseURL}/admins/resolve-request`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify(requestData),
                });

                if (!response.ok) {
                    throw new Error('Error al resolver la solicitud');
                }

                const result = await response.json();
                Swal.fire('Éxito', result.message, 'success');

                await fetchRequests();

                setShowModal(false);
                setSelectedRequest(null);
                setElectricityMeters([]);
                setWaterMeters([]);
            } catch (error) {
                Swal.fire('Error', error.message, 'error');
            }
        } else {
            Swal.fire('Advertencia', 'Debes asignar al menos un contador de electricidad o de agua.', 'warning');
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setSelectedRequest(null);
        setElectricityMeters([]);
        setWaterMeters([]);
    };

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.baseURL}/admins/list-pending-requests`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Error fetching requests');
            }
            const data = await response.json();
            setRequests(data);
        } catch (error) {
            console.error('Error fetching requests', error);
        }
    };

    const addElectricityMeter = () => {
        setElectricityMeters([...electricityMeters, ""]);
    };

    const removeElectricityMeter = (index) => {
        const newMeters = electricityMeters.filter((_, i) => i !== index);
        setElectricityMeters(newMeters);
    };

    const updateElectricityMeter = (index, value) => {
        const newMeters = [...electricityMeters];
        newMeters[index] = value;
        setElectricityMeters(newMeters);
    };

    const addWaterMeter = () => {
        setWaterMeters([...waterMeters, ""]);
    };

    const removeWaterMeter = (index) => {
        const newMeters = waterMeters.filter((_, i) => i !== index);
        setWaterMeters(newMeters);
    };

    const updateWaterMeter = (index, value) => {
        const newMeters = [...waterMeters];
        newMeters[index] = value;
        setWaterMeters(newMeters);
    };

    return (
        <div className="flex flex-col bg-gradient-to-r from-blue-400 to-indigo-500 min-h-screen p-6">
            <div className="bg-white rounded-lg p-1 mb-2">
                <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">Solicitudes de Registro de Usuarios</h2>
            </div>
            
            {requests.length > 0 ? (
                <div className="overflow-auto bg-white shadow-lg rounded-lg p-4">
                    <table className="min-w-full table-auto">
                        <thead className="bg-indigo-500 text-white">
                            <tr className="bg-blue-500 text-white text-left text-sm uppercase tracking-wider">
                                <th className="px-4 py-2">Nombres</th>
                                <th className="px-4 py-2">Apellidos</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Dirección</th>
                                <th className="px-4 py-2">Teléfono</th>
                                <th className="px-4 py-2">Estado Solicitud</th>
                                <th className="px-4 py-2 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {requests.map((request) => (
                                <tr key={request._id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="px-4 py-2">{request.firstName}</td>
                                    <td className="px-4 py-2">{request.lastName}</td>
                                    <td className="px-4 py-2">{request.email}</td>
                                    <td className="px-4 py-2">{request.address}</td>
                                    <td className="px-4 py-2">{request.phone}</td>
                                    <td className="px-4 py-2">{request.status}</td>
                                    <td className="px-4 py-2 text-center">
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                                            onClick={() => handleFollowUp(request._id)}
                                        >
                                            Dar Seguimiento
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white rounded-lg p-1">
                    <p className="mt-4 text-blue-600 text-center">No hay solicitudes pendientes.</p>
                </div>
            )}

            {showModal && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Asignar Contadores</h3>
                        <p className="mb-2">
                            <strong>Nombre:</strong> {selectedRequest.firstName} {selectedRequest.lastName}
                        </p>
                        <p className="mb-2">
                            <strong>Email:</strong> {selectedRequest.email}
                        </p>
                        <p className="mb-4">
                            <strong>Dirección:</strong> {selectedRequest.address}
                        </p>

                        {/* Botones para agregar inputs */}
                        <div className="mb-4">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mr-2 mb-2 transition duration-300"
                                onClick={addElectricityMeter}
                            >
                                Agregar Contador de Electricidad
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                                onClick={addWaterMeter}
                            >
                                Agregar Contador de Agua
                            </button>
                        </div>

                        {/* Inputs de contadores de electricidad */}
                        <div className="mb-4">
                            <label className="block mb-2 font-bold text-gray-700">Contadores de Electricidad</label>
                            {electricityMeters.map((meter, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input
                                        type="text"
                                        className="border p-2 rounded w-full"
                                        placeholder="Número de contador de electricidad"
                                        value={meter}
                                        onChange={(e) => updateElectricityMeter(index, e.target.value)}
                                    />
                                    <button
                                        className="ml-2 text-red-500 hover:text-red-700 transition duration-300"
                                        onClick={() => removeElectricityMeter(index)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Inputs de contadores de agua */}
                        <div className="mb-6">
                            <label className="block mb-2 font-bold text-gray-700">Contadores de Agua</label>
                            {waterMeters.map((meter, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input
                                        type="text"
                                        className="border p-2 rounded w-full"
                                        placeholder="Número de contador de agua"
                                        value={meter}
                                        onChange={(e) => updateWaterMeter(index, e.target.value)}
                                    />
                                    <button
                                        className="ml-2 text-red-500 hover:text-red-700 transition duration-300"
                                        onClick={() => removeWaterMeter(index)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Botones para autorizar o cancelar */}
                        <div className="flex justify-end">
                            <button
                                className="bg-green-500 text-white px-4 py-2 mr-2 rounded-lg hover:bg-green-600 transition duration-300"
                                onClick={handleAuthorize}
                            >
                                Autorizar
                            </button>
                            <button
                                className="bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition duration-300"
                                onClick={handleCancel}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RegisterUserRequests;
