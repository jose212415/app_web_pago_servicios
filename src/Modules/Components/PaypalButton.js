import React, { useEffect, useState } from 'react';

const PayPalButton = ({ totalAmountGTQ, onPaymentSuccess }) => {
    const [totalAmountUSD, setTotalAmountUSD] = useState(null);

    useEffect(() => {
        // Función para convertir GTQ a USD
        const convertGTQtoUSD = async () => {
            try {
                // Aquí puedes usar la API de conversión de divisas
                const response = await fetch('https://api.exchangerate-api.com/v4/latest/GTQ');
                const data = await response.json();
                const rate = data.rates.USD; // Obtén la tasa de cambio GTQ -> USD
                const amountInUSD = parseFloat((totalAmountGTQ * rate).toFixed(2)); // Realiza la conversión
                setTotalAmountUSD(amountInUSD);
            } catch (error) {
                console.error("Error al obtener la tasa de cambio:", error);
            }
        };

        convertGTQtoUSD();
    }, [totalAmountGTQ]);

    useEffect(() => {
        if (!totalAmountUSD) return;

        const clientIdLive = 'AWUDbK3MVPHHb9qii3KYHYVjOa2AOmyOI5-jD9_O4UvckE_F-70-CU-dHjgg23Gtl8VUH7eiEWJppV49';
        const clientIdSandbox = 'AfwH6XY7Q83EzdNpwtfASJz7Ui3c5jrcvYGASqMnqPg1OO0OKbpDeBpRc2S1oVX73H9kTnmn67Dt6ucX';
        const addPayPalScript = () => {
            const script = document.createElement('script');
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientIdSandbox}&currency=USD`;
            script.async = true;
            script.onload = () => {
                window.paypal.Buttons({
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: totalAmountUSD,
                                },
                            }],
                        });
                    },
                    onApprove: (data, actions) => {
                        return actions.order.capture().then((details) => {
                            onPaymentSuccess(details);
                        });
                    },
                    onError: (err) => {
                        console.error("Error en el pago de PayPal:", err);
                    }
                }).render('#paypal-button-container');
            };
            document.body.appendChild(script);
        };

        addPayPalScript();
    }, [totalAmountUSD, onPaymentSuccess]);

    return (
        <div>
            <div id="paypal-button-container"></div>
        </div>
    );
};

export default PayPalButton;
