import { track, trigger } from './effect'
export function reactive(raw: Object) {
  return new Proxy(raw, {
    get(target, key) {
      const res = Reflect.get(target, key);
      track(target, key)
      return res;
    },
    set(target, key, value) {
      const res = Reflect.set(target, key, value);
      trigger(target, key)
      return res;
    },
  });
}

export function readonly(target) {
  return new Proxy(target, {
    get(target, key) {
      return Reflect.get(target, key);
    },
    set(target,key,value) {
      console.warn('只能读取，不能修改')
      return true
    }
  })
}

function createGetter(isReadonly = false){
  return function get(target,key){
    const res = Reflect.get(target,key)
    !isReadonly && track(target,key)
    return res
  }
}