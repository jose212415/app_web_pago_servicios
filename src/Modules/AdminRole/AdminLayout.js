import React, { useState, useEffect } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
//import { FaBars } from "react-icons/fa";
import config from "../../config";

function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const tokenExpiration = localStorage.getItem('tokenExpiration');

        const currentTime = Date.now();
        const timeRemaining = tokenExpiration - currentTime;
        const minutesRemaining = Math.floor(timeRemaining / 1000 / 60);

        if (token && timeRemaining > 0 && location.pathname === "/admin") {
            navigate("admin-home");
        }

        console.log(`token ${token}`);
        console.log(`tokenExpiration ${minutesRemaining}`);
        const fetchRequests = async () => {
            try {
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
                console.log(data);
            } catch (error) {
                console.error('Error fetching requests', error);
            }
        };

        fetchRequests();
    }, [location.pathname, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");
        navigate("/");
    };

    const goToRegisterRequests = () => {
        navigate("register-user-requests", { state: { requests } });
    };

    const isActive = (path) => location.pathname.includes(path) ? "bg-blue-800" : "";

    return (
        <div className="min-h-screen flex bg-gradient-to-r from-blue-400 to-indigo-500 max-h-screen">
            {/* Drawer Menu */}
            <div
                className={`fixed inset-y-0 left-0 z-50 bg-sky-700 p-4 text-white w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-64`}
            >   
                <h2 className="text-3xl font-bold mb-6 text-center">City Pay</h2>
                <nav>
                    <ul className="space-y-4 mt-6">
                        <li>
                            <Link
                                to="admin-home"
                                className={`block text-white hover:bg-blue-500 hover:shadow-lg w-full text-left py-2 px-4 rounded transition duration-200 ${isActive("admin-home")}`}
                            >
                                Inicio
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={goToRegisterRequests}
                                className={`block text-white hover:bg-blue-500 hover:shadow-lg w-full text-left py-2 px-4 rounded transition duration-200 ${isActive("register-user-requests")}`}
                            >
                                Solicitudes de Registro de Usuarios
                            </button>
                        </li>
                        <li>
                            <Link
                                to="users-administration"
                                className={`block text-white hover:bg-blue-500 hover:shadow-lg w-full text-left py-2 px-4 rounded transition duration-200 ${isActive("users-administration")}`}
                            >
                                Gestión de Usuarios
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="invoice-generation"
                                className={`block text-white hover:bg-blue-500 hover:shadow-lg w-full text-left py-2 px-4 rounded transition duration-200 ${isActive("invoice-generation")}`}
                            >
                                Generación de Facturas
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full text-left transition duration-200"
                            >
                                Cerrar Sesión
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Contenido del Dashboard */}
            <div className="flex-1 overflow-auto shadow-lg rounded-lg">
                <Outlet />
            </div>
        </div>
    );
}

export default AdminLayout;
