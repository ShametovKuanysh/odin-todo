function getFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem('projects'));
    return data;
}

function saveToLocalStorage(data) {
    return localStorage.setItem('projects', JSON.stringify(data));
}

export { getFromLocalStorage, saveToLocalStorage };