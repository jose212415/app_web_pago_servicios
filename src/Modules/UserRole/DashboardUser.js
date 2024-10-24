//Dashboard User
import React from "react";
//import { useNavigate } from "react-router-dom";
//import { FaBars } from "react-icons/fa"; // Icono para el menú en pantallas pequeñas

function DashboardUser() {
    //const navigate = useNavigate();
    //const [isOpen, setIsOpen] = useState(false); // Estado para manejar el drawer en móviles

    /*const handleLogout = () => {
        // Remover token
        console.log("Cerrando sesión");
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");

        // Redirigir al login
        navigate("/");
    };*/

    /*const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };*/

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-400 to-indigo-500 p-6 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <h1 className="text-4xl font-bold text-center text-indigo-600 mb-6">
                    Bienvenido al Dashboard de Usuario
                </h1>
                <p className="text-lg text-gray-700 mb-4 text-center">
                    Aquí puedes gestionar las funcionalidades de tu cuenta.
                </p>
                <div className="mt-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                        Funcionalidades del Sistema
                    </h2>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li>Realizar Pagos</li>
                        <li>Historial de Pagos</li>
                        <li>Descarga de Facturas</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default DashboardUser;
