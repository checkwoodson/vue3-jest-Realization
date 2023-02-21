import { track, trigger } from './effect'
export function reactive(raw: Object) {
  return new Proxy(raw, {
    get: createGetter(),
    set: createSetter()
  });
}

export function readonly(target) {
  return new Proxy(target, {
    get: createGetter(true),
    set: createSetter(true)
  })
}

function createGetter(isReadonly = false) {
  return (target, key) => {
    const res = Reflect.get(target, key)
    !isReadonly && track(target, key)
    return res
  }
}
function createSetter(isReadonly = false) {
  return (target, key, value) => {
    if(isReadonly) return true;
    const res = Reflect.set(target, key, value);
    trigger(target, key)
    return res;
  }
}