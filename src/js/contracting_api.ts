const PORT = '8080'
const API = 'http://localhost:' + PORT;

export function sanitycheck(){
    const ENDPOINT = '/';
    return new Promise (function(resolve, reject){
        fetch(API + ENDPOINT)
        .then(response => resolve (response.text()))
    });
}

export function contracts(){
    const ENDPOINT = '/contracts';
    return new Promise (function(resolve, reject){
        fetch(API + ENDPOINT)
        .then(response => resolve (response.json()))
    });
}

export function contract(contract){
    const ENDPOINT = '/contracts/';
    return new Promise (function(resolve, reject){
        fetch(API + ENDPOINT + contract)
        .then(response => resolve (response.text()))
    });
}

export function lint(name, code){
    const ENDPOINT = '/lint';
    return new Promise (function(resolve, reject){
        fetch(API + ENDPOINT, {
            method: 'post',
            body: JSON.stringify({name, code})
        })
        .then(response => resolve (response.text()))
    });
}



 