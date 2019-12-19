let verify_url=process.env.NODE_ENV === "production" ? "https://hsuweb.kemri-wellcome.org/verify" : "http://localhost:8000";

if (process.env.REACT_APP_VERIFY_URL){
    verify_url=process.env.REACT_APP_VERIFY_URL;

}

console.log("Verify URL: ",verify_url);


export default {
    bandendURL: verify_url
}