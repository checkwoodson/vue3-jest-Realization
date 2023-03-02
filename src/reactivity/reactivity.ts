import reactiveHandler from "./baseHandlers";
import { reactiveFlag } from "./enum/reactivty";
const { reactiveBase, isReadonly } = reactiveHandler()
export function reactive(raw: Object) {
  return new Proxy(raw, reactiveBase);
}

export function readonly(target) {
  return new Proxy(target, isReadonly)
}

export function isReactive(value) {
  // setting one of value's property to a reactive object will make it reactive
  return !!value[reactiveFlag.IS_REACTIVE]
}

export function isReadOnly(value){
  return !!value[reactiveFlag.IS_READONLY]
}