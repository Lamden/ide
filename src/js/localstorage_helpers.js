function init_file_storage() {
    let files = {};
    files.local = new Map();
    files.database = new Map();
    console.log(files.local)
    localStorage.setItem('files', JSON.stringify(files));
    return files
}

function remap_files() {
    let files = JSON.parse(localStorage.getItem('files'));
    files.local = new Map(Object.entries(files.local));
    files.database = new Map(Object.entries(files.database));
    return files
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

export function setApiInfo(apiInfo) {
    localStorage.setItem('apiInfo', JSON.stringify(apiInfo));
}

export function getFiles() {
    let files = remap_files();
    if (files){
        return files
    }
    return init_file_storage();
}

export function setFile(name, code, source) {
    let files = remap_files();
    if (files){
        files[source].set(name, code);
        localStorage.setItem('files', JSON.stringify(files));
        return files
    }
    return init_file_storage();
}

