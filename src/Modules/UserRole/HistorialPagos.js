import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import config from "../../config";
import autoTable from 'jspdf-autotable';

function HistorialPagos() {
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(true);

    // Función para obtener las facturas pagadas
    const fetchPaidInvoices = async () => {
        try {
            const token = localStorage.getItem("token");
            const id = localStorage.getItem("id");
            const response = await fetch(`${config.baseURL}/users/search-paid-invoices`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ userId: id })
            });
            const data = await response.json();
            console.log(data);
             // Verificar si data es un array antes de usarlo
            if (Array.isArray(data)) {
                setFacturas(data); 
            } else {
                setFacturas([]); 
            }
        } catch (error) {
            console.error("Error al obtener las facturas pagadas", error);
            setFacturas([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPaidInvoices();
    }, []);

    const generarPDF = (factura) => {
        const doc = new jsPDF('portrait', 'pt', 'a4');
        const pageWidth = doc.internal.pageSize.width;

        // Agregar el logo de la empresa
        doc.addImage('../../img/Logo_City_Pay.jpg', 'PNG', 40, 34, 100, 50);
        doc.setFontSize(12);
        doc.text('City Pay', 150, 50);
        doc.text('Barrio El Centro', 150, 65);
        doc.text('Gualan, Zacapa', 150, 80);

        // Información del cliente
        doc.setFontSize(10);
        doc.text(`FACTURA PARA: ${factura.userId.firstName}`, 40, 140);
        doc.text(`Nombre del cliente: ${factura.userId.firstName} ${factura.userId.lastName}`, 40, 155);
        doc.text(`Dirección del cliente: ${factura.userId.address}`, 40, 170);
        doc.text(`Correo electrónico: ${factura.userId.email}`, 40, 185);

        // Información de la factura
        doc.text(`N° de factura: ${factura._id}`, pageWidth - 200, 140);
        doc.text(`Fecha de emisión: ${new Date(factura.createdAt).toLocaleDateString()}`, pageWidth - 200, 155);
        doc.text(`Fecha de vencimiento: ${new Date(factura.dueDate).toLocaleDateString()}`, pageWidth - 200, 170);
        doc.text(`Monto Total: Q${factura.totalAmount}`, pageWidth - 200, 185);

        // Tabla de servicios
        autoTable(doc, {
            startY: 210,
            head: [['Nombre Servicio', 'Descripcion', 'Precio Unitario', 'Importe']],
            body: factura.services.map(service => [
                service.serviceId.serviceType,
                service.serviceId.description,
                `Q${service.serviceId.baseCost}`,
                `Q${factura.totalAmount}`
            ]),
            theme: 'striped',
            styles: { 
                headStyles: { fillColor: [41, 128, 185] }, // Color similar al de la imagen
                textColor: [0, 0, 0],
                fontSize: 10,
            },
            margin: { left: 40, right: 40 }
        });

        // Totales
        doc.setFontSize(12);
        doc.text(`Total a pagar: Q${factura.totalAmount}`, pageWidth - 200, doc.autoTable.previous.finalY + 30);

        // Pie de página
        doc.setLineWidth(1);
        doc.line(40, doc.internal.pageSize.height - 100, pageWidth - 40, doc.internal.pageSize.height - 100); // Línea separadora
        doc.setFontSize(10);
        doc.text('Gracias por su pago', pageWidth / 2, doc.internal.pageSize.height - 80, { align: 'center' });
        doc.text('www.CityPay.com', pageWidth / 2, doc.internal.pageSize.height - 60, { align: 'center' });

        // Descargar el PDF
        doc.save(`factura_${factura._id}.pdf`);
    };


    if (loading) {
        return (
            <div className="bg-white rounded-lg p-1 mt-3 mr-3 ml-3">
                <p className="text-center text-blue-600 text-lg">Cargando facturas...</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg p-1 mb-1">
                <h2 className="text-4xl font-bold mb-6 text-center text-blue-600">Historial de Pagos</h2>
            </div>
            {facturas.length === 0 ? (
                <div className="bg-white rounded-lg p-1">
                    <p className="text-center text-blue-600 text-lg">No tienes facturas pagadas.</p>
                </div>
                
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-lg rounded-lg">
                        <thead>
                            <tr className="bg-blue-100 text-blue-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">ID de Factura</th>
                                <th className="py-3 px-6 text-left">Monto Total</th>
                                <th className="py-3 px-6 text-left">Servicio</th>
                                <th className="py-3 px-6 text-left">Número de Contador</th>
                                <th className="py-3 px-6 text-left">Fecha</th>
                                <th className="py-3 px-6 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm font-medium">
                            {facturas.map((factura) => (
                                <tr key={factura._id} className="border-b border-gray-200 hover:bg-gray-50 transition duration-150">
                                    <td className="py-3 px-6 text-left">{factura._id}</td>
                                    <td className="py-3 px-6 text-left text-green-500 font-semibold">Q{factura.totalAmount}</td>
                                    <td className="py-3 px-6 text-left">{factura.serviceType}</td>
                                    <td className="py-3 px-6 text-left">{factura.numberMeter}</td>
                                    <td className="py-3 px-6 text-left">
                                        {new Date(factura.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-6 text-center">
                                        <button
                                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 shadow-md"
                                            onClick={() => generarPDF(factura)}
                                        >
                                            Descargar PDF
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default HistorialPagos;
