import React, { useState, useEffect } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
//import { FaBars } from "react-icons/fa";
//import config from "../../config";

function UserLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [requests] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const tokenExpiration = localStorage.getItem('tokenExpiration');

        const currentTime = Date.now();
        const timeRemaining = tokenExpiration - currentTime;
        //const minutesRemaining = Math.floor(timeRemaining / 1000 / 60);

        if (token && timeRemaining > 0 && location.pathname === "/user") {
            navigate("dashboard-user");
        }
    }, [location.pathname, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");
        navigate("/");
    };

    const goToRealizarPago = () => {
        navigate("realizar-pago", { state: { requests } });
    };

    const isActive = (path) => location.pathname.includes(path) ? "bg-blue-800" : "";

    return (
        <div className="min-h-screen flex bg-gradient-to-r from-blue-400 to-indigo-500 max-h-screen">
            {/* Drawer Menu */}
            <div
                className={`fixed inset-y-0 left-0 z-50 bg-sky-700 p-4 text-white w-64 transition-transform ease-in-out lg:relative lg:translate-x-0 lg:w-64`}
            >
                <h2 className="text-3xl font-bold mb-6 text-center">City Pay</h2>
                <nav>
                    <ul className="space-y-6">
                        <li>
                            <Link
                                to="dashboard-user"
                                className={`block text-white hover:bg-blue-500 hover:shadow-lg w-full text-left py-2 px-4 rounded transition duration-200 ${isActive("dashboard-user")}`}
                            >
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={goToRealizarPago}
                                className={`text-white hover:bg-blue-500 hover:shadow-lg w-full text-left py-2 px-4 rounded transition duration-200 ${isActive("realizar-pago")}`}
                            >
                                Realizar Pago
                            </button>
                        </li>
                        <li>
                            <Link
                                to="historial-pagos"
                                className={`block text-white hover:bg-blue-500 hover:shadow-lg w-full text-left py-2 px-4 rounded transition duration-200 ${isActive("historial-pagos")}`}
                            >
                                Historial de Pagos
                            </Link>
                        </li>
                        {/* Opción oculta */}
                        {/*<li>
                            <Link
                                to="estadisticas-user"
                                className={`block text-white hover:bg-blue-500 hover:shadow-lg w-full text-left py-2 px-4 rounded transition duration-200 ${isActive(
                                    "estadisticas-user"
                                )}`}
                            >
                                Estadísticas
                            </Link>
                        </li>*/}
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

export default UserLayout;
