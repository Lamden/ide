export function getApiInfo() {
    let apiInfo = {status: 'Offline', hostname: 'http:\\\\localhost', port: '8080'}
    try {
        apiInfo = JSON.parse(localStorage.getItem('apiInfo'));
    } catch {
        setApiInfo(apiInfo)
    }
    return apiInfo
}

export function setApiInfo(apiInfo) {
    localStorage.setItem('apiInfo', JSON.stringify(apiInfo));
}
