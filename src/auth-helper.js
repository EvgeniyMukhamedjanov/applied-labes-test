export const getAuthInfo = () => {
    let domain = localStorage.getItem("shopify-domain");
    if (domain === null) domain = "";

    let password = localStorage.getItem("shopify-password");
    if (password === null) password = "";

    return {
        domain,
        password
    }
};

export const getAuthDomain = () => {
    const authData = getAuthInfo();
    return authData.domain;
}

export const getAuthPassword = () => {
    const authData = getAuthInfo();
    return authData.password;
}

export const setAuthInfo = (domain, password) => {
    localStorage.setItem("shopify-domain", domain);
    localStorage.setItem("shopify-password", password);
}