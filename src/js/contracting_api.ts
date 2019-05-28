
function apiURL (apiInfo, ENDPOINT){
    if (apiInfo) { return apiInfo.hostname + ':' + apiInfo.port + ENDPOINT;}     
}

export function getApiInfo() {
    let apiInfo = {status: 'Offline', hostname: 'http:\\\\localhost', port: '8080'}
    try {
        apiInfo = JSON.parse(localStorage.getItem('apiInfo'));
    } catch {
        setApiInfo(apiInfo)
    }
    return apiInfo
}

export function getApiInfoHostname() {
    const apiInfo = JSON.parse(localStorage.getItem('apiInfo'));
    return apiInfo.hostname
}

export function getApiInfoPort() {
    const apiInfo = JSON.parse(localStorage.getItem('apiInfo'));
    return apiInfo.port
}

export function setApiInfo(apiInfo) {
    localStorage.setItem('apiInfo', JSON.stringify(apiInfo));
}

export function apicheck(){
    const ENDPOINT = '/';
    
    return new Promise (function(resolve, reject){
        fetch(apiURL(getApiInfo(), ENDPOINT))
        .then(response => resolve (response.text()))
        .catch((error) => {
            reject(error);
          });
    });
}

export function contracts(apiInfo){
    const ENDPOINT = '/contracts';
    return new Promise (function(resolve, reject){
        fetch(apiURL(apiInfo, ENDPOINT))
        .then(response => resolve (response.json()))
        .catch((error) => {
            reject(error);
          });
    });
}

export function contract(apiInfo, contract){
    const ENDPOINT = '/contracts/' + contract;
    return new Promise (function(resolve, reject){
        fetch(apiURL(apiInfo, ENDPOINT))
        .then(response => resolve (response.json()))
        .catch((error) => {
            reject(error);
          });
    });
}

export function methods(apiInfo, contract){
    const ENDPOINT = '/contracts/' + contract + '/methods';
    return new Promise (function(resolve, reject){
        fetch(apiURL(apiInfo, ENDPOINT))
        .then(response => resolve (response.json()))
        .catch((error) => {
            reject(error);
          });
    });
}

export function variables(apiInfo, contract){
    const ENDPOINT = '/contracts/' + contract + '/variable';
    return new Promise (function(resolve, reject){
        fetch(apiURL(apiInfo, ENDPOINT))
        .then(response => resolve (response.json()))
        .catch((error) => {
            reject(error);
          });
    });
}

export function lint(apiInfo, name, code){
    const ENDPOINT = '/lint';
    return new Promise (function(resolve, reject){
        fetch(apiURL(apiInfo, ENDPOINT), {
            method: 'post',
            body: JSON.stringify({name, code})
        })
        .then(response => resolve (response.text()))
        .catch((error) => {
            reject(error);
          });
    });
}

export function submit_contract(apiInfo, name, code){
    const ENDPOINT = '/submit';
    return new Promise (function(resolve, reject){
        fetch(apiURL(apiInfo, ENDPOINT), {
            method: 'post',
            body: JSON.stringify({name, code})
        })
        .then(response => resolve (response.text()))
        .catch((error) => {
            reject(error);
          });
    });
}




 