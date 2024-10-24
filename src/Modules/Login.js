import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "../config";
import logo from "../img/Logo_City_Pay.jpg";
import "../styles/Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [loginError, setLoginError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación manual de correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError("Por favor, ingresa un correo válido.");
            return;
        } else {
            setEmailError("");
        }

        try {
            const response = await fetch(`${config.baseURL}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            setLoginError("");

            if (!response.ok) {
                setLoginError("Correo o contraseña incorrectos");
                return;
            }

            const data = await response.json();
            console.log("Login exitoso", data);

            // Guardar token de sesion
            const tokenExpirationTime = Date.now() + 3600 * 1000;
            localStorage.setItem("token", data.token);
            localStorage.setItem("tokenExpiration", tokenExpirationTime);
            localStorage.setItem("role", data.role);
            localStorage.setItem("id", data.id);

            // Redirigir al dashboard correcto basado en el rol
            if (data.role === "admin") {
                navigate("/admin");
            } else if (data.role === "user") {
                navigate("/user");
            }
            

        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            setLoginError("Hubo un problema al iniciar sesión. Inténtalo de nuevo más tarde.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-green-100 p-4 sm:p-6 md:p-8">
            <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <img src={logo} alt="City Pay Logo" className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded shadow-lg"/>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">Bienvenido a City Pay</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4 sm:mb-5">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                            Correo Electrónico
                        </label>
                        <input
                            className="shadow-md appearance-none border border-gray-300 rounded-lg w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300"
                            id="email"
                            type="email"
                            placeholder="Ingresa tu correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                    </div>

                    <div className="mb-6 sm:mb-4 relative">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                            Contraseña
                        </label>
                        <input
                            className="shadow-md appearance-none border border-gray-300 rounded-lg w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300"
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Ingresa tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-9 sm:top-10 text-gray-600 hover:text-gray-800"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Ocultar" : "Mostrar"}
                        </button>
                    </div>

                    {loginError && <p className="text-red-500 text-sm mt-2 mb-2">{loginError}</p>}

                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <button
                            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 sm:py-3 px-4 rounded-full shadow-lg w-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Iniciar Sesión
                        </button>
                    </div>

                    <div className="text-center">
                        <Link to="/register" className="text-sm text-blue-500 hover:text-blue-700 transition-all duration-300">
                            ¿No tienes cuenta? Registrate
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
