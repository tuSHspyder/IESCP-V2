// paymentForm.js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Form</title>
    <script src="paymentForm.js" defer></script>
    <style>
        .message { margin: 10px 0; padding: 10px; border-radius: 5px; }
        .message.success { background-color: #d4edda; color: #155724; }
        .message.error { background-color: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <h1>Payment Form</h1>
    <div id="message-container"></div>
    <form id="payment-form">
        <label>Name: <input type="text" name="name" required></label><br>
        <label>Email: <input type="email" name="email" required></label><br>
        <label>Amount: <input type="number" name="amount" required></label><br>
        <label>Card Number: <input type="text" name="cardNumber" required></label><br>
        <label>Expiry Date (MM/YY): <input type="text" name="expiryDate" required></label><br>
        <label>CVV: <input type="text" name="cvv" required></label><br>
        <button type="submit">Submit Payment</button>
    </form>
</body>
                                    </html><!DOCTYPE html>
                                    <html lang="en">
                                        <head>
                                            <meta charset="UTF-8">
                                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                                    <title>Payment Form</title>
                                                    <script src="paymentForm.js" defer></script>
                                                    <style>
                                                        .message {margin: 10px 0; padding: 10px; border-radius: 5px; }
                                                        .message.success {background - color: #d4edda; color: #155724; }
                                                        .message.error {background - color: #f8d7da; color: #721c24; }
                                                    </style>
                                                </head>
                                                <body>
                                                    <h1>Payment Form</h1>
                                                    <div id="message-container"></div>
                                                    <form id="payment-form">
                                                        <label>Name: <input type="text" name="name" required></label><br>
                                                            <label>Email: <input type="email" name="email" required></label><br>
                                                                <label>Amount: <input type="number" name="amount" required></label><br>
                                                                    <label>Card Number: <input type="text" name="cardNumber" required></label><br>
                                                                        <label>Expiry Date (MM/YY): <input type="text" name="expiryDate" required></label><br>
                                                                            <label>CVV: <input type="text" name="cvv" required></label><br>
                                                                                <button type="submit">Submit Payment</button>
                                                                            </form>
                                                                        </body>
                                                                    </html>
// Initialize form elements and validation
document.addEventListener("DOMContentLoaded", function () {
    const paymentForm = document.getElementById("payment-form");

    paymentForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        clearMessages();

        const formData = new FormData(paymentForm);
        const paymentDetails = {
            name: formData.get("name"),
            email: formData.get("email"),
            amount: parseFloat(formData.get("amount")),
            cardNumber: formData.get("cardNumber"),
            expiryDate: formData.get("expiryDate"),
            cvv: formData.get("cvv"),
        };

        // Validate input
        if (!validatePaymentDetails(paymentDetails)) {
            showMessage("Please fill in all fields correctly.", "error");
            return;
        }

        try {
            const response = await processPayment(paymentDetails);

            if (response.success) {
                showMessage("Payment successful!", "success");
                paymentForm.reset();
            } else {
                showMessage(response.message || "Payment failed.", "error");
            }
        } catch (error) {
            console.error("Payment error:", error);
            showMessage("An unexpected error occurred. Please try again.", "error");
        }
    });
});

// Validate payment details
function validatePaymentDetails(details) {
    const { name, email, amount, cardNumber, expiryDate, cvv } = details;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cardNumberRegex = /^\d{16}$/; // Simple card number validation
    const cvvRegex = /^\d{3}$/;

    return (
        name &&
        emailRegex.test(email) &&
        amount > 0 &&
        cardNumberRegex.test(cardNumber) &&
        /^\d{2}\/\d{2}$/.test(expiryDate) && // Format: MM/YY
        cvvRegex.test(cvv)
    );
}

// Simulate payment processing
async function processPayment(paymentDetails) {
    // Replace with actual API endpoint and logic
    const mockApiEndpoint = "/api/payments";
    const response = await fetch(mockApiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentDetails),
    });

    return response.json();
}

// Show success or error messages
function showMessage(message, type) {
    const messageContainer = document.getElementById("message-container");
    const msgElement = document.createElement("div");
    msgElement.className = `message ${type}`;
    msgElement.innerText = message;
    messageContainer.appendChild(msgElement);
}

// Clear messages
function clearMessages() {
    const messageContainer = document.getElementById("message-container");
    messageContainer.innerHTML = "";
}
