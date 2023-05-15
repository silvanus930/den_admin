import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import Input from "@mui/material/Input";
import Card from "@mui/material/Card";
import { useState } from "react";

const CheckoutForm = () => {

    // collect data from the user
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    // stripe items

    const stripe = useStripe();
    const elements = useElements();

    // main function
    const createSubscription = async () => {
        try {

            // create a payment method
            const paymentMethod = await stripe?.createPaymentMethod({
                type: "card",
                card: elements?.getElement(CardElement),
                billing_details: {
                    name,
                    email,
                },
            });

            // call the backend to create subscription
            const response = await fetch("http://localhost:4000/create-subscription", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    paymentMethod: paymentMethod?.paymentMethod?.id,
                    name,
                    email,
                    priceId
                }),
            }).then((res) => res.json());

            const confirmPayment = await stripe?.confirmCardPayment(
                response.clientSecret
            );

            if (confirmPayment?.error) {
                alert(confirmPayment.error.message);
            } else {
                alert("Success! Check your email for the invoice.");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <MDBox flexDirection="row" display="flex">
            <MDBox
                width="50%"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                px={1.5}
            >
            </MDBox>
            <MDBox
                width="50%"
                height="80vh"
                display="flex"
                flexDirection="column"
            >
                <Card>
                    <MDBox
                        display="flex"
                        height="50vh"
                        m={4}
                        flexDirection="column"
                        justifyContent="space-between"
                        px={1.5}
                        gap={4} >
                        <Input
                            placeholder="Name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            placeholder="Email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Card sx={{padding: 3}}>
                            <CardElement
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '18px',
                                            color: '#eab7c4',
                                            '::placeholder': {
                                                color: '#aab7c4',
                                            },
                                        },
                                        invalid: {
                                            color: '#9e2146',
                                        },
                                    },
                                }}
                            />
                        </Card>
                        <MDButton onClick={createSubscription} color="dark" variant="gradient">
                            Subscribe
                        </MDButton>
                    </MDBox>
                </Card>
            </MDBox>
        </MDBox>
    );
}

export default CheckoutForm;