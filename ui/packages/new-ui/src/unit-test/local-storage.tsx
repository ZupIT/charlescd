const storageMock = () => {
  let storage: { [key: string]: string } = {};

  return {
    setItem(key: string, value: string) {
      storage[key] = value;
    },
    getItem(key: string) {
      return storage[key];
    },
    removeItem(key: string) {
      delete storage[key];
    },
    key(item: number) {
      const keys = Object.keys(storage);

      return keys[item] || null;
    },
    restore() {
      storage = {};
    },
    clear() {
      storage = {};
    }
  };
};

export default storageMock;
