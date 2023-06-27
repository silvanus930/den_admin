import ReactGA4 from "react-ga4";

const InitializeGoogleAnalytics = (id) => {
    // Initialize GA4 - Add your measurement ID
    const gTagID = id || 'G-1F127CLEGN';
    ReactGA4.initialize(gTagID);
    console.log("GA INITIALIZED WITH: ", gTagID);
};

const TrackGoogleAnalyticsEvent = (id, category, action, label) => {
    console.log("GA event:", id, ":", category, ":", action, ":", label);

    InitializeGoogleAnalytics(id);
    // Send GA4 Event
    ReactGA4.event({
        category: category,
        action: action,
        label: label,
    });
};

export default InitializeGoogleAnalytics;
export { InitializeGoogleAnalytics, TrackGoogleAnalyticsEvent };