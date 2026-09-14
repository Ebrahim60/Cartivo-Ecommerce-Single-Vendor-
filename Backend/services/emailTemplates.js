/*
const emailLayout = (title, content) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
</head>

<body style="
    margin: 0;
    padding: 0;
    background-color: #f4f6f8;
    font-family: Arial, Helvetica, sans-serif;
    color: #333333;
">
    <div style="
        max-width: 600px;
        margin: 30px auto;
        background-color: #ffffff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    ">

        <div style="
            background-color: #111827;
            padding: 24px;
            text-align: center;
        ">
            <h1 style="
                margin: 0;
                color: #ffffff;
                font-size: 28px;
            ">
                Cartivo
            </h1>
        </div>

        <div style="padding: 30px;">
            ${content}
        </div>

        <div style="
            padding: 20px;
            background-color: #f9fafb;
            text-align: center;
            color: #777777;
            font-size: 13px;
        ">
            <p style="margin: 0 0 6px;">
                Thank you for choosing Cartivo.
            </p>

            <p style="margin: 0;">
                This is an automated email. Please do not reply.
            </p>
        </div>

    </div>
</body>
</html>
`;
};


// 1. Registration OTP
export const registrationOTPTemplate = (name, otp) => {
    const html = emailLayout(
        "Cartivo - Email Verification",
        `
        <h2 style="margin-top: 0;">Welcome to Cartivo, ${name}!</h2>

        <p>
            Thank you for creating your Cartivo account.
            Please use the OTP below to verify your email address.
        </p>

        <div style="
            margin: 25px 0;
            padding: 18px;
            background-color: #f3f4f6;
            text-align: center;
            border-radius: 8px;
        ">
            <span style="
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 8px;
                color: #111827;
            ">
                ${otp}
            </span>
        </div>

        <p>
            This OTP is valid for <strong>10 minutes</strong>.
        </p>

        <p>
            If you did not create this account, you can safely ignore this email.
        </p>
        `
    );

    const text = `
Welcome to Cartivo, ${name}!

Thank you for creating your Cartivo account.

Your email verification OTP is: ${otp}

This OTP is valid for 10 minutes.

If you did not create this account, you can safely ignore this email.

Thank you for choosing Cartivo.
`;

    return { html, text };
};


// 2. Resend OTP
export const resendOTPTemplate = (name, otp) => {
    const html = emailLayout(
        "Cartivo - New OTP",
        `
        <h2 style="margin-top: 0;">Your new verification code</h2>

        <p>
            Hello ${name},
        </p>

        <p>
            You requested a new OTP to verify your Cartivo account.
        </p>

        <div style="
            margin: 25px 0;
            padding: 18px;
            background-color: #f3f4f6;
            text-align: center;
            border-radius: 8px;
        ">
            <span style="
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 8px;
                color: #111827;
            ">
                ${otp}
            </span>
        </div>

        <p>
            This OTP is valid for <strong>10 minutes</strong>.
        </p>
        `
    );

    const text = `
Hello ${name},

Your new Cartivo verification OTP is: ${otp}

This OTP is valid for 10 minutes.

Thank you for choosing Cartivo.
`;

    return { html, text };
};


// 3. Order Created
export const orderCreatedTemplate = (name, orderId, totalAmount) => {
    const html = emailLayout(
        "Cartivo - Order Confirmed",
        `
        <h2 style="margin-top: 0;">Order placed successfully!</h2>

        <p>
            Hello ${name},
        </p>

        <p>
            Your order has been successfully placed on Cartivo.
        </p>

        <div style="
            margin: 20px 0;
            padding: 18px;
            background-color: #f3f4f6;
            border-radius: 8px;
        ">
            <p style="margin: 0 0 8px;">
                <strong>Order ID:</strong> ${orderId}
            </p>

            <p style="margin: 0;">
                <strong>Total Amount:</strong> ৳${totalAmount}
            </p>
        </div>

        <p>
            Your order is currently waiting for payment confirmation.
        </p>
        `
    );

    const text = `
Hello ${name},

Your Cartivo order has been placed successfully.

Order ID: ${orderId}
Total Amount: ৳${totalAmount}

Your order is currently waiting for payment confirmation.

Thank you for choosing Cartivo.
`;

    return { html, text };
};

//Made for future use

// 4. Payment Successful
export const paymentSuccessTemplate = (name, orderId, amount) => {
    const html = emailLayout(
        "Cartivo - Payment Successful",
        `
        <h2 style="margin-top: 0;">Payment successful!</h2>

        <p>
            Hello ${name},
        </p>

        <p>
            We have successfully received your payment for the following order:
        </p>

        <div style="
            margin: 20px 0;
            padding: 18px;
            background-color: #f3f4f6;
            border-radius: 8px;
        ">
            <p style="margin: 0 0 8px;">
                <strong>Order ID:</strong> ${orderId}
            </p>

            <p style="margin: 0;">
                <strong>Paid Amount:</strong> ৳${amount}
            </p>
        </div>

        <p>
            We will start processing your order shortly.
        </p>
        `
    );

    const text = `
Hello ${name},

Your payment for Cartivo order ${orderId} was successful.

Paid Amount: ৳${amount}

We will start processing your order shortly.

Thank you for choosing Cartivo.
`;

    return { html, text };
};


// 5. Payment Failed
export const paymentFailedTemplate = (name, orderId, amount) => {
    const html = emailLayout(
        "Cartivo - Payment Failed",
        `
        <h2 style="margin-top: 0;">Payment could not be completed</h2>

        <p>
            Hello ${name},
        </p>

        <p>
            Unfortunately, your payment for the following order was not completed successfully.
        </p>

        <div style="
            margin: 20px 0;
            padding: 18px;
            background-color: #f3f4f6;
            border-radius: 8px;
        ">
            <p style="margin: 0 0 8px;">
                <strong>Order ID:</strong> ${orderId}
            </p>

            <p style="margin: 0;">
                <strong>Amount:</strong> ৳${amount}
            </p>
        </div>

        <p>
            You can try the payment again if the order is still available.
        </p>
        `
    );

    const text = `
Hello ${name},

Unfortunately, your payment for Cartivo order ${orderId} was not completed successfully.

Amount: ৳${amount}

You can try the payment again if the order is still available.

Thank you for choosing Cartivo.
`;

    return { html, text };
};


// 6. Order Shipped
export const orderShippedTemplate = (name, orderId) => {
    const html = emailLayout(
        "Cartivo - Order Shipped",
        `
        <h2 style="margin-top: 0;">Your order has been shipped!</h2>

        <p>
            Hello ${name},
        </p>

        <p>
            Good news! Your Cartivo order is now on its way.
        </p>

        <div style="
            margin: 20px 0;
            padding: 18px;
            background-color: #f3f4f6;
            border-radius: 8px;
        ">
            <p style="margin: 0;">
                <strong>Order ID:</strong> ${orderId}
            </p>
        </div>

        <p>
            Please keep an eye out for your delivery.
        </p>
        `
    );

    const text = `
Hello ${name},

Good news! Your Cartivo order has been shipped.

Order ID: ${orderId}

Please keep an eye out for your delivery.

Thank you for choosing Cartivo.
`;

    return { html, text };
};


// 7. Order Delivered
export const orderDeliveredTemplate = (name, orderId) => {
    const html = emailLayout(
        "Cartivo - Order Delivered",
        `
        <h2 style="margin-top: 0;">Your order has been delivered!</h2>

        <p>
            Hello ${name},
        </p>

        <p>
            Your Cartivo order has been successfully delivered.
        </p>

        <div style="
            margin: 20px 0;
            padding: 18px;
            background-color: #f3f4f6;
            border-radius: 8px;
        ">
            <p style="margin: 0;">
                <strong>Order ID:</strong> ${orderId}
            </p>
        </div>

        <p>
            We hope you enjoy your purchase. Thank you for shopping with Cartivo!
        </p>
        `
    );

    const text = `
Hello ${name},

Your Cartivo order has been successfully delivered.

Order ID: ${orderId}

We hope you enjoy your purchase.

Thank you for shopping with Cartivo!
`;

    return { html, text };
};


// 8. Order Cancelled
export const orderCancelledTemplate = (name, orderId) => {
    const html = emailLayout(
        "Cartivo - Order Cancelled",
        `
        <h2 style="margin-top: 0;">Your order has been cancelled</h2>

        <p>
            Hello ${name},
        </p>

        <p>
            Your Cartivo order has been cancelled successfully.
        </p>

        <div style="
            margin: 20px 0;
            padding: 18px;
            background-color: #f3f4f6;
            border-radius: 8px;
        ">
            <p style="margin: 0;">
                <strong>Order ID:</strong> ${orderId}
            </p>
        </div>

        <p>
            If you have any questions regarding this cancellation,
            please contact Cartivo support.
        </p>
        `
    );

    const text = `
Hello ${name},

Your Cartivo order has been cancelled successfully.

Order ID: ${orderId}

If you have any questions regarding this cancellation,
please contact Cartivo support.

Thank you for choosing Cartivo.
`;

    return { html, text };
};


*/