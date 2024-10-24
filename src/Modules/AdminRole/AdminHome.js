// src/Modules/AdminRole/AdminHome.js
import React from "react";

function AdminHome() {
    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10 border border-gray-200">
            <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">Bienvenido al Dashboard de Administración</h1>
            <p className="text-lg text-gray-600 text-center mb-8">Aquí puedes gestionar las diferentes funcionalidades del sistema.</p>
            
            <div className="mt-8">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">Funcionalidades del Sistema</h2>
                
                <ul className="list-disc list-inside space-y-4 text-lg text-gray-700">
                    <li className="hover:text-blue-600 transition duration-300">Gestión de Usuarios</li>
                    <li className="hover:text-blue-600 transition duration-300">Generación de Facturas</li>
                    <li className="hover:text-blue-600 transition duration-300">Seguimiento de Solicitudes de Registro de Usuarios</li>
                </ul>
            </div>
        </div>
    );
}

export default AdminHome;
