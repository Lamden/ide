
function apiURL (apiInfo, ENDPOINT){
    if (apiInfo) { return apiInfo.hostname + ':' + apiInfo.port + ENDPOINT;}     
}

export function apicheck(apiInfo){
    const ENDPOINT = '/';
    
    return new Promise (function(resolve, reject){
        fetch(apiURL(apiInfo, ENDPOINT))
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
    const ENDPOINT = '/contracts/';
    return new Promise (function(resolve, reject){
        fetch(apiURL(apiInfo, ENDPOINT) + contract)
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
            console.log(error);
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
            console.log(error);
          });
    });
}




 