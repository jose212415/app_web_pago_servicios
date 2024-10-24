import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "../config";
import logo from "../img/Logo_City_Pay.jpg";
import Swal from "sweetalert2";

function Register() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Verificar si el campo es "phone" y permitir solo números
        if (name === "phone") {
            const phoneValue = value.replace(/\D/g, ''); // Eliminar todo lo que no sea dígito
            setFormData((prevState) => ({
                ...prevState,
                [name]: phoneValue,
            }));
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }   
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.firstName) newErrors.firstName = "El nombre es requerido.";
        if (!formData.lastName) newErrors.lastName = "El apellido es requerido.";
        if (!formData.address) newErrors.address = "Direccion es requerida.";
        if (!formData.phone) newErrors.phone = "Telefono es requerido."
        if (formData.phone.length !== 8) newErrors.phone = "El teléfono debe tener 8 dígitos.";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = "Por favor, ingresa un correo válido.";
        }

        if (formData.password.length < 6) {
            newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden.";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            console.log("Formulario de registro enviado", formData);
        }

        try {
            const response = await fetch(`${config.baseURL}/users/request-register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    address: formData.address,
                    phone: formData.phone,
                    password: formData.password,
                }),
            });

            if (!response.ok) {
                // Manejar errores de registro
                const errorData = await response.json();
                console.error("Error de registro:", errorData);
                Swal.fire({
                    icon: 'error',
                    title: 'Solicitud de Registro Fallida',
                    text: errorData.message,
                });

                return;
            }

            const data = await response.json();
            console.log("Solicitud de Registro Enviada", data);

            Swal.fire({
                icon: 'success',
                title: 'Solicitud Enviada',
                text: 'Tu solicitud ha sido enviada correctamente.',
                timer: 2000,
                showConfirmButton: false,
            }).then(() => {
                navigate("/"); // Redirigir al Login
            });

        } catch (error) {
            console.error("Error al registrar:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error,
            });
        }

    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-green-100 p-4 sm:p-6 md:p-8">
            <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <img src={logo} alt="City Pay Logo" className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded shadow-lg"/>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">Registro de City Pay</h2>

                <form onSubmit={handleSubmit}>
                    {/* Nombre */}
                    <div className="mb-4 sm:mb-5">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="firstName">
                            Nombre
                        </label>
                        <input
                            className="shadow-md appearance-none border border-gray-300 rounded-lg w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300"
                            id="firstName"
                            type="text"
                            name="firstName"
                            placeholder="Ingresa tu nombre"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>

                    {/* Apellido */}
                    <div className="mb-4 sm:mb-5">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="lastName">
                            Apellido
                        </label>
                        <input
                            className="shadow-md appearance-none border border-gray-300 rounded-lg w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300"
                            id="lastName"
                            type="text"
                            name="lastName"
                            placeholder="Ingresa tu apellido"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>

                    {/* Correo electrónico */}
                    <div className="mb-4 sm:mb-5">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                            Correo Electrónico
                        </label>
                        <input
                            className="shadow-md appearance-none border border-gray-300 rounded-lg w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300"
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Ingresa tu correo electrónico"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Direccion */}
                    <div className="mb-4 sm:mb-5">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="address">
                            Direccion
                        </label>
                        <input
                            className="shadow-md appearance-none border border-gray-300 rounded-lg w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300"
                            id="address"
                            type="text"
                            name="address"
                            placeholder="Ingresa tu direccion"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Telefono */}
                    <div className="mb-4 sm:mb-5">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="phone">
                            Telefono
                        </label>
                        <input
                            className="shadow-md appearance-none border border-gray-300 rounded-lg w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300"
                            id="phone"
                            type="text"
                            name="phone"
                            placeholder="Ingresa tu telefono"
                            value={formData.phone}
                            onChange={handleChange}
                            maxLength={8}
                            
                            required
                        />
                    </div>

                    {/* Contraseña */}
                    <div className="mb-4 sm:mb-5 relative">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                            Contraseña
                        </label>
                        <input
                            className="shadow-md appearance-none border border-gray-300 rounded-lg w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300"
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Ingresa tu contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-9 sm:top-10 text-gray-600 hover:text-gray-800"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Ocultar" : "Mostrar"}
                        </button>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    {/* Confirmar Contraseña */}
                    <div className="mb-6 sm:mb-8 relative">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="confirmPassword">
                            Confirmar Contraseña
                        </label>
                        <input
                            className="shadow-md appearance-none border border-gray-300 rounded-lg w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300"
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirma tu contraseña"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-9 sm:top-10 text-gray-600 hover:text-gray-800"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle de confirmación
                        >
                            {showConfirmPassword ? "Ocultar" : "Mostrar"}
                        </button>   
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>

                    {/* Botón de Registro */}
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <button
                            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 sm:py-3 px-4 rounded-full shadow-lg w-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Registrarse
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <Link to="/" className="text-sm text-blue-500 hover:text-blue-700 transition-all duration-300">
                        ¿Ya tienes cuenta? Inicia sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register;
