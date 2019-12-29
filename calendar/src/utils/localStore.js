const localStore = window.localStorage;
export default {
    getItem(key) {
        let result = localStore.getItem(key);
        return result ? JSON.parse(result) : null;
    },
    saveItem(key, value) {
        localStore.setItem(key, JSON.stringify(value));
    }
}
