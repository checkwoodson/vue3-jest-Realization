import { track, trigger } from './effect'
class ProxyInterface {
  createGetter(isReadonly = false) {
    return (target, key) => {
      if(key === 'is_reactive') return !isReadonly;
      const res = Reflect.get(target, key)
      !isReadonly && track(target, key)
      return res
    }
  }
  createSetter(isReadonly = false) {
    return (target, key, value) => {
      if (isReadonly) {
        console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target)
        return true
      }
      const res = Reflect.set(target, key, value);
      trigger(target, key)
      return res;
    }
  }
}

export default function reactiveHandler() {
  const { createGetter, createSetter } = new ProxyInterface()
  return {
    reactiveBase: {
      get: createGetter(),
      set: createSetter()
    },
    isReadonly: {
      get: createGetter(true),
      set: createSetter(true)
    }
  }
}
