"use client";
import { useState, useEffect } from "react";
import Script from "next/script";

export default function Pasarelas() {
    const [isClient, setIsClient] = useState(false);
    const [showPaypal, setShowPaypal] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (showPaypal && typeof window !== "undefined" && window.paypal) {
            window.paypal.Buttons({
                createOrder: function (data, actions) {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: "10.00",
                            },
                        }],
                    });
                },
                onApprove: function (data, actions) {
                    return actions.order.capture().then(function (details) {
                        const message = `Gracias por tu pago, ${details.payer.name.given_name}`;
                        const resultMessage = document.getElementById("paypal-result-message");
                        if (resultMessage) {
                            resultMessage.innerHTML = message;
                        }
                        alert(message);
                    });
                },
                onError: function (err) {
                    console.error("Error en PayPal", err);
                    alert("Error en PayPal");
                },
            }).render("#paypal-button-container");
        }
    }, [showPaypal]);

    if (!isClient) {
        return null;
    }

    return (
        <div className="p-8">
            <Script
                src="https://www.paypal.com/sdk/js?client-id=test&buyer-country=US&currency=USD&components=buttons&enable-funding=venmo,paylater,card"
                strategy="afterInteractive"
            />
            <h1 className="text-2xl mb-4 text-center">Pasarela de pago</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                {/* Opción Paypal */}
                <div
                    className="border rounded-lg p-6 text-center cursor-pointer bg-white shadow"
                    onClick={() => setShowPaypal(true)}
                >
                    <img
                        src="/images/paypal-logo.jpeg"
                        alt="Paypal"
                        className="mx-auto mb-4"
                        style={{ width: "100px", height: "auto" }}
                    />
                    <p className="text-lg">Pagar con PayPal</p>
                </div>

                {/* Opción PayU */}
                <div
                    className="border rounded-lg p-6 text-center cursor-pointer bg-white shadow"
                    onClick={() => (window.location.href = "/api/payments/payu-redirect")}
                >
                    <img
                        src="/images/payu-logo.jpeg"
                        alt="PayU"
                        className="mx-auto mb-4"
                        style={{ width: "100px", height: "auto" }}
                    />
                    <p className="text-lg">Pagar con PayU</p>
                </div>
            </div>

            {/* Contenedor Paypal */}
            {showPaypal && (
                <div className="mt-10 text-center">
                    <h2 className="text-xl mb-4">Pagar con PayPal</h2>
                    <div id="paypal-button-container"></div>
                    <p id="paypal-result-message" className="mt-4 text-green-600"></p>
                </div>
            )}
        </div>
    );
}
