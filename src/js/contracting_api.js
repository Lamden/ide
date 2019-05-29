import * as LShelpers from "./localstorage_helpers";

function apiURL (apiInfo, ENDPOINT){
    if (apiInfo) { return apiInfo.hostname + ':' + apiInfo.port + ENDPOINT;}     
}

export function apicheck(){
    const ENDPOINT = '/';
    
    return new Promise (function(resolve, reject){
        fetch(apiURL(LShelpers.getApiInfo(), ENDPOINT))
        .then(response => resolve (response.text()))
        .catch((error) => {
            reject(error);
          });
    });
}

export function contracts(){
    const ENDPOINT = '/contracts';
    return new Promise (function(resolve, reject){
        fetch(apiURL(LShelpers.getApiInfo(), ENDPOINT))
        .then(response => resolve (response.json()))
        .catch((error) => {
            reject(error);
          });
    });
}

export function contract(contract){
    const ENDPOINT = '/contracts/' + contract;
    return new Promise (function(resolve, reject){
        fetch(apiURL(LShelpers.getApiInfo(), ENDPOINT))
        .then(response => resolve (response.json()))
        .catch((error) => {
            reject(error);
          });
    });
}

export function methods(contract){
    const ENDPOINT = '/contracts/' + contract + '/methods';
    return new Promise (function(resolve, reject){
        fetch(apiURL(LShelpers.getApiInfo(), ENDPOINT))
        .then(response => resolve (response.json()))
        .catch((error) => {
            reject(error);
          });
    });
}

export function variables(contract){
    const ENDPOINT = '/contracts/' + contract + '/variable';
    return new Promise (function(resolve, reject){
        fetch(apiURL(LShelpers.getApiInfo(), ENDPOINT))
        .then(response => resolve (response.json()))
        .catch((error) => {
            reject(error);
          });
    });
}

export function lint(name, code){
    const ENDPOINT = '/lint';
    return new Promise (function(resolve, reject){
        fetch(apiURL(LShelpers.getApiInfo(), ENDPOINT), {
            method: 'post',
            body: JSON.stringify({name, code})
        })
        .then(response => resolve (response.text()))
        .catch((error) => {
            reject(error);
          });
    });
}

export function submit_contract(name, code){
    const ENDPOINT = '/submit';
    return new Promise (function(resolve, reject){
        fetch(apiURL(LShelpers.getApiInfo(), ENDPOINT), {
            method: 'post',
            body: JSON.stringify({name, code})
        })
        .then(response => resolve (response.text()))
        .catch((error) => {
            reject(error);
          });
    });
}




 