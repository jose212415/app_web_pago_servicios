import config from "./config";

const baseURL = config.localURL; // Base URL de tu API

// Función para buscar facturas por usuario, contador y estado
export const fetchInvoiceByUserAndMeter = async (userId, numberMeter, serviceType, status, token) => {
    try {
        const response = await fetch(`${config.baseURL}/users/search-invoice`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ userId, numberMeter, serviceType, status }),
        });

        // Si la respuesta no es OK (status code 200-299)
        if (!response.ok) {
            const errorDetails = await response.json(); // Extraer detalles del error del cuerpo de la respuesta
            throw new Error(`Error ${response.status}: ${errorDetails.message || 'Error desconocido en la búsqueda de facturas'}`);
        }

        return await response.json(); // Retorna la respuesta en formato JSON
    } catch (error) {
        console.error('Error al buscar la factura:', error);
        throw error;
    }
};

// Función para iniciar sesión
export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${baseURL}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Error en el inicio de sesión');
        }

        return await response.json(); // Retorna la respuesta en formato JSON
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        throw error;
    }
};

// Función para solicitar el registro de usuario
export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${baseURL}/user/request-register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error('Error al solicitar el registro de usuario');
        }

        return await response.json(); // Retorna la respuesta en formato JSON
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        throw error;
    }
};

// Función para obtener todas las facturas pendientes
export const fetchAllPendingInvoices = async () => {
    try {
        const response = await fetch(`${baseURL}/invoices/pending`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener las facturas pendientes');
        }

        return await response.json(); // Retorna la respuesta en formato JSON
    } catch (error) {
        console.error('Error al obtener las facturas pendientes:', error);
        throw error;
    }
};
