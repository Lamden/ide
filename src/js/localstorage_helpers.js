//globalstate
export function firstRun() {
<<<<<<< Updated upstream
        if (!localStorage.getItem('firstRun')){
            init_storage();
            return true;
        }
        return false
}

function init_storage(){
    localStorage.clear();
    localStorage.setItem('firstRun', false);
    init_apiInfo();
    init_file_storage();
=======
    if (typeof window !== `undefined`) {
        if (localStorage.getItem('firstRun')){
            localStorage.setItem('firstRun', false);
            return true;
        }
        return false
    }
>>>>>>> Stashed changes
}

// API Functions

<<<<<<< Updated upstream
export function init_apiInfo() {
    let apiInfo = {status: 'Offline', hostname: 'http:\\\\localhost', port: '8080'}
    localStorage.setItem('apiInfo', JSON.stringify(apiInfo));
}

=======
>>>>>>> Stashed changes
export function getApiInfo() {
    if (typeof window !== `undefined`) {
        let apiInfo = {status: 'Offline', hostname: 'http:\\\\localhost', port: '8080'}
        try {
            apiInfo = JSON.parse(localStorage.getItem('apiInfo'));
        } catch {
            setApiInfo(apiInfo)
        }
        return apiInfo
    }
}

export function setApiInfo(apiInfo) {
    if (typeof window !== `undefined`) {
        localStorage.setItem('apiInfo', JSON.stringify(apiInfo));
    }
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
    if (typeof window !== `undefined`) {
        let files = JSON.parse(localStorage.getItem('files'));
        files.local = jsonToStrMap(files.local);
        files.database = jsonToStrMap(files.database);
        return files
    }
}

function map_to_json_files(files) {
    files.local = strMapToJson(files.local)
    files.database = strMapToJson(files.database);
    return files
}

function storeFilesObj(files){
    if (typeof window !== `undefined`) {
        localStorage.setItem('files', JSON.stringify(map_to_json_files(files)));
    }
}

function getFilesObj(){
    return json_to_map_files();
}

export function getFiles() {
    let files = getFilesObj();
    if (files){
        return files
    }
    return init_file_storage();
}

export function setFile(name, code, source) {
    let files = getFilesObj();
    if (files){
        files[source].set(name, code);
        storeFilesObj(files);
        return files
    }
}

export function removeFile(name, source) {
    let files = getFilesObj();
    if (files){
        files[source].delete(name);
        storeFilesObj(files);
        return files
    }
}

export function nameExists(name){
    let files = getFilesObj();
    if (files['local'].has(name)){
        return true
    }
    return false
}

export function renameTab(oldName, newName, tabValue){
        let files = getFilesObj();
        let local = files.local;
        try{
            local.set(newName, tabValue);
            local.delete(oldName);
            files.local = local
            storeFilesObj(files)
            return true
        } catch (e) {
            return false
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