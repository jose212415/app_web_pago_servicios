import React, { useState, useEffect } from "react";
import config from "../../config";
import Swal from "sweetalert2";

function UsersAdministration() {
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
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

        fetchUsers(); 
    }, []);

    const handleDeleteUser = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.baseURL}/admins/delete-user/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error al eliminar usuario');
            }

            const result = await response.json();
            Swal.fire('Éxito', result.message, 'success');
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    };

    const handleEditUser = (user) => {
        setEditUser(user);
        setShowModal(true);
    };

    const handleSaveChanges = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.baseURL}/admins/update-user/${editUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(editUser),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el usuario');
            }

            const result = await response.json();
            Swal.fire('Éxito', result.message, 'success');
            setShowModal(false);
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    return (
        <div className="flex flex-col bg-gradient-to-r from-blue-400 to-indigo-500 min-h-screen p-6">
            <div className="bg-white rounded-lg p-1 mb-2">
                <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">Administración de Usuarios</h2>
            </div>
            
            {users.length > 0 ? (
                <div className="overflow-auto bg-white shadow-lg rounded-lg p-4">
                    <table className="min-w-full table-auto">
                        <thead className="bg-indigo-500 text-white">
                            <tr className="bg-blue-500 text-white text-left text-sm uppercase tracking-wider">
                                <th className="px-4 py-3">Nombres</th>
                                <th className="px-4 py-3">Apellidos</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Dirección</th>
                                <th className="px-4 py-3">Teléfono</th>
                                <th className="px-4 py-3">Contadores de Electricidad</th>
                                <th className="px-4 py-3">Contadores de Agua</th>
                                <th className="px-4 py-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {users.map((user) => (
                                <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="px-4 py-3">{user.firstName}</td>
                                    <td className="px-4 py-3">{user.lastName}</td>
                                    <td className="px-4 py-3">{user.email}</td>
                                    <td className="px-4 py-3">{user.address}</td>
                                    <td className="px-4 py-3">{user.phone}</td>

                                    {/* Contadores de electricidad */}
                                    <td className="px-4 py-3">
                                        {user.meters
                                            .filter((meter) => meter.meterType === "electricity")
                                            .map((meter, index) => (
                                                <p key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs">
                                                    {meter.meterNumber}
                                                </p>
                                            ))}
                                    </td>

                                    {/* Contadores de agua */}
                                    <td className="px-4 py-3">
                                        {user.meters
                                            .filter((meter) => meter.meterType === "water")
                                            .map((meter, index) => (
                                                <p key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs">
                                                    {meter.meterNumber}
                                                </p>
                                            ))}
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                                                onClick={() => handleEditUser(user)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                                                onClick={() => handleDeleteUser(user._id)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white rounded-lg p-1 mb-2">
                    <p className="mt-6 text-center text-blue-600">No hay usuarios registrados.</p>
                </div>
            )}

            {/* Modal para editar usuario */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                        <h3 className="text-xl font-bold mb-4 text-gray-700">Editar Usuario</h3>
                        <form>
                            <label className="block mb-2 text-gray-700">Nombre</label>
                            <input
                                type="text"
                                name="firstName"
                                value={editUser?.firstName || ''}
                                onChange={handleInputChange}
                                className="border p-2 rounded w-full mb-4 focus:ring-2 focus:ring-blue-500"
                            />

                            <label className="block mb-2 text-gray-700">Apellido</label>
                            <input
                                type="text"
                                name="lastName"
                                value={editUser?.lastName || ''}
                                onChange={handleInputChange}
                                className="border p-2 rounded w-full mb-4 focus:ring-2 focus:ring-blue-500"
                            />

                            <label className="block mb-2 text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={editUser?.email || ''}
                                onChange={handleInputChange}
                                className="border p-2 rounded w-full mb-4 focus:ring-2 focus:ring-blue-500"
                            />

                            <label className="block mb-2 text-gray-700">Teléfono</label>
                            <input
                                type="text"
                                name="phone"
                                value={editUser?.phone || ''}
                                onChange={handleInputChange}
                                className="border p-2 rounded w-full mb-4 focus:ring-2 focus:ring-blue-500"
                            />

                            <label className="block mb-2 text-gray-700">Dirección</label>
                            <input
                                type="text"
                                name="address"
                                value={editUser?.address || ''}
                                onChange={handleInputChange}
                                className="border p-2 rounded w-full mb-4 focus:ring-2 focus:ring-blue-500"
                            />

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                                    onClick={handleSaveChanges}
                                >
                                    Guardar Cambios
                                </button>
                                <button
                                    type="button"
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UsersAdministration;
