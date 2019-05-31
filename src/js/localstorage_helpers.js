// API Functions

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

//Open Tab Storage

export function init_file_storage() {
    let files = {};
    files.local = new Map();
    files.database = new Map();
    storeFilesObj(files);
    return files
}

function json_to_map_files() {
    let files = JSON.parse(localStorage.getItem('files'));
    files.local = jsonToStrMap(files.local);
    files.database = jsonToStrMap(files.database);
    return files
}

function map_to_json_files(files) {
    files.local = strMapToJson(files.local)
    files.database = strMapToJson(files.database);
    return files
}

function storeFilesObj(files){
    localStorage.setItem('files', JSON.stringify(map_to_json_files(files)));
}

function getFilesObj(){
    return json_to_map_files();
}

export function getFiles() {
    console.log('getting files')
    let files = getFilesObj();
    if (files){
        return files
    }
    return init_file_storage();
}

export function setFile(name, code, source) {
    console.log('setting file: ' + name)
    let files = getFilesObj();
    if (files){
        files[source].set(name, code);
        storeFilesObj(files);
        return files
    }
}

export function removeFile(name, source) {
    console.log('removeing file: ' + name)
    let files = getFilesObj();
    if (files){
        files[source].delete(name);
        storeFilesObj(files);
        return files
    }
}

function strMapToJson(strMap) {
    return strMapToObj(strMap);
}
function jsonToStrMap(jsonStr) {
    return objToStrMap(jsonStr);
}

function strMapToObj(strMap) {
    let obj = Object.create(null);
    for (let [k,v] of strMap) {
        // We don’t escape the key '__proto__'
        // which can cause problems on older engines
        obj[k] = v;
    }
    return obj;
}
function objToStrMap(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
}