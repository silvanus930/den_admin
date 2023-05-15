import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";

const Stripe = () => {

    const stripePromise = loadStripe("pk_test_51N7yKaCNUYXp5oILMD561mLMitmZAFOqNMcbc5vJ5YCrDDt4LIcV9Kob0zVZkiV11NB1RwEmL9esy7P5cw8M6ZTI00wxdBhaXq");

    return (
        <DashboardLayout>
            <DashboardNavbar absolute isMini />
            <MDBox mt={10}>
                <Elements stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            </MDBox >
        </ DashboardLayout >
    );
}

export default Stripe;