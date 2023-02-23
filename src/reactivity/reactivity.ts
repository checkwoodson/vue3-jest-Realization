import reactiveHandler from "./baseHandlers";
const { reactiveBase, isReadonly } = reactiveHandler()
export function reactive(raw: Object) {
  return new Proxy(raw, reactiveBase);
}

export function readonly(target) {
  return new Proxy(target, isReadonly)
}

export function isReactive(value) {
  // setting one of value's property to a reactive object will make it reactive
  return !!value['is_reactive']
}