function getToken() {
    if (localStorage.getItem("token"))
        return localStorage.getItem("token");
    else
        return false;
}

export default getToken;