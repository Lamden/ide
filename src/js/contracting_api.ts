
function apiURL (apiInfo, ENDPOINT){
    if (apiInfo) { return apiInfo.server + ':' + apiInfo.port + ENDPOINT;}     
}

export function apicheck(apiInfo){
    const ENDPOINT = '/';
    return new Promise (function(resolve, reject){
        fetch(apiURL(apiInfo, ENDPOINT))
        .then(response => resolve (response.text()))
    });
}

export function contracts(apiInfo){
    const ENDPOINT = '/contracts';
    return new Promise (function(resolve, reject){
        fetch(apiURL(apiInfo, ENDPOINT))
        .then(response => resolve (response.json()))
    });
}

export function contract(apiInfo, contract){
    const ENDPOINT = '/contracts/';
    return new Promise (function(resolve, reject){
        fetch(apiURL(apiInfo, ENDPOINT) + contract)
        .then(response => resolve (response.text()))
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
    });
}




 