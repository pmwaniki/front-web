export default {
    bandendURL: process.env.NODE_ENV === "production" ? "/verify" : "http://localhost:8000",
}