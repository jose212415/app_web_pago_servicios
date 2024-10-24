import React, { useState } from "react";
import { fetchInvoiceByUserAndMeter } from '../../apiService';
import { createRoot } from 'react-dom/client';
import Swal from 'sweetalert2';
import PayPalButton from "../Components/PaypalButton";
import config from "../../config";

function RealizarPago() {
    const [tipoFactura, setTipoFactura] = useState("");
    const [numberMeter, setNumberMeter] = useState("");
    const [factura, setFactura] = useState();
    const [error, setError] = useState("");

    const handleBuscarFactura = async (e) => {
        e.preventDefault();
        setError("");
        const token = localStorage.getItem('token');
        const tokenExpiration = localStorage.getItem('tokenExpiration');
        const userId = localStorage.getItem('id');
        const status = 'pending';
        
        if (tipoFactura && numberMeter) {
            fetchInvoiceByUserAndMeter(userId, numberMeter, tipoFactura, status, token)
            .then(invoice => {
                console.log('Factura encontrada:', invoice);
                setFactura(invoice[0]);
            })
            .catch(error => {
                console.error('Error al buscar la factura:', error);
            });

        } else {
            setError("Por favor, seleccione el tipo de factura y el número de contador.");
        }
    };

    const handlePago = () => {
        Swal.fire({
            title: 'Seleccione Método de Pago',
            html: `
                <button id="boton1" class="swal2-confirm swal2-styled" style="background-color: #3085d6; margin-right: 10px;">
                    Pagar con Tarjeta
                </button>
                <button id="boton2" class="swal2-confirm swal2-styled" style="background-color: #f39c12;">
                    Pagar con PayPal
                </button>
            `,
            showCancelButton: false, 
            showConfirmButton: false, 
            didOpen: () => {
                const boton1 = document.getElementById('boton1');
                const boton2 = document.getElementById('boton2');

                if (boton1) {
                    boton1.addEventListener('click', () => {
                        handleCreditCardPayment(); 
                    });
                }
    
                if (boton2) {
                    boton2.addEventListener('click', () => {
                        handlePayPalPayment(); 
                    });
                }
            }
        });
    };

    const handleCreditCardPayment = () => {
        Swal.fire({
            title: 'Pago con Tarjeta de Crédito',
            text: `Total a pagar: $${factura.totalAmount}`,
            input: 'text',
            inputLabel: 'Número de Tarjeta',
            inputPlaceholder: 'Ingrese su número de tarjeta',
            showCancelButton: true,
            confirmButtonText: 'Pagar',
            showLoaderOnConfirm: true,
            preConfirm: (cardNumber) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve('Pago exitoso');
                    }, 2000);
                });
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Pago Completado', 'Su pago fue procesado exitosamente', 'success');
            }
        });
    };

    const handlePayPalPayment = () => {
        Swal.fire({
            title: 'Pagar con PayPal',
            html: `<div id="paypal-button-container"></div>`, 
            showConfirmButton: false,
            didOpen: () => {
                setTimeout(() => {
                    const paypalButtonContainer = document.getElementById('paypal-button-container');
                    if (paypalButtonContainer) {
                        const root = createRoot(paypalButtonContainer); 
                        root.render(
                            <PayPalButton 
                                totalAmountGTQ={factura.totalAmount} 
                                onPaymentSuccess={(details) => {
                                    fetch(`${config.baseURL}/users/update-invoice-status`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                                        },
                                        body: JSON.stringify({ invoiceId: factura._id })
                                    })
                                    .then(response => response.json())
                                    .then(data => {
                                        if (data.message) {
                                            Swal.fire({
                                                title: 'Pago Completado',
                                                text: `Gracias, ${details.payer.name.given_name}`,
                                                icon: 'success',
                                                confirmButtonText: 'Aceptar'
                                            }).then(() => {
                                                window.location.reload();
                                            });
                                        } else {
                                            Swal.fire('Error', 'No se pudo actualizar el estado de la factura', 'error');
                                        }
                                    })
                                    .catch(error => {
                                        console.error('Error al actualizar el estado de la factura:', error);
                                        Swal.fire('Error', 'Hubo un error al procesar el pago', 'error');
                                    });
                                    }} 
                            />
                        );
                    }
                }, 100); 
            }
        });
    };

    return (
        <div className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-xl mt-10 border border-gray-200 mb-10">
            <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">Realizar Pago</h2>

            <form onSubmit={handleBuscarFactura} className="space-y-8">
                {/* Selección de tipo de factura */}
                <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-3">Tipo de Factura</label>
                    <select
                        value={tipoFactura}
                        onChange={(e) => setTipoFactura(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition ease-in-out duration-150"
                        required
                    >
                        <option value="" disabled>Seleccione el tipo de factura</option>
                        <option value="Electricidad">Electricidad</option>
                        <option value="Agua">Agua</option>
                    </select>
                </div>

                {/* Número de contador */}
                <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-3">Número de Contador</label>
                    <input
                        type="text"
                        value={numberMeter}
                        onChange={(e) => setNumberMeter(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition ease-in-out duration-150"
                        placeholder="Ingrese el número de contador"
                        required
                    />
                </div>

                {/* Botón de buscar */}
                <div className="text-center">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white text-lg font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition ease-in-out duration-150"
                    >
                        Buscar Factura
                    </button>
                </div>

                {/* Mostrar error si hay */}
                {error && <p className="text-red-600 text-center text-lg">{error}</p>}
            </form>

            {/* Mostrar detalles de la factura si se encuentra */}
            {factura && (
                <div className="mt-10 p-6 bg-gray-50 rounded-lg shadow-inner">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Detalles de la Factura</h3>
                    <div className="space-y-2">
                        <p className="text-lg text-gray-700">
                            <span className="font-semibold">Tipo de Servicio:</span> {factura.serviceType}
                        </p>
                        <p className="text-lg text-gray-700">
                            <span className="font-semibold">Monto Total:</span> Q{factura.totalAmount}
                        </p>
                        <p className="text-lg text-gray-700">
                            <span className="font-semibold">Estado:</span> {factura.status}
                        </p>
                    </div>

                    {/* Botón de pagar */}
                    <div className="text-center mt-8">
                        <button
                            onClick={handlePago}
                            className="bg-green-600 text-white text-lg font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition ease-in-out duration-150"
                        >
                            Pagar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RealizarPago;
