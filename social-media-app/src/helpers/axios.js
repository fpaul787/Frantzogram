import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
const axoisService = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        "Content-Type": "application/json"
    }
});

axoisService.interceptors.request.use(async (config) => {
    /**
     * Retrieving the access token from localStorage
     * and adding it to the headers of the request
     */
    const { access } = JSON.parse(localStorage.getItem("auth"));
    config.headers.Authorization = `Bearer ${access}`;
    return config;
})

axoisService.interceptors.response.use(
    (res) => Promise.resolve(res),
    (err) => Promise.reject(err),
);

const refreshAuthLogic = async (failedRequest) => {
    const { refresh } = JSON.parse(localStorage.getItem("auth"));
    return axios
    .post("/refresh/token/", null, {
        baseURL: "http://localhost:8000",
        headers: {
            Authorization: `Bearer ${refresh}`
        }
    })
    .then((resp) => {
        const { access, refresh} = resp.data;
        failedRequest.response.config.headers[
            "Authorization"
        ] = "Bearer " + access;
        localStorage.setItem("auth", JSON.stringify({
            access, refresh}));
    })
    .catch(() => {
        localStorage.removeItem("auth");
    });
};

createAuthRefreshInterceptor(axoisService, refreshAuthLogic);
export function fetcher(url){
    return axoisService.get(url).then((res) => res.data);
}
export default axoisService;