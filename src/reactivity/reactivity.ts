import reactiveHandler from "./baseHandlers";
const { reactiveBase , isReadonly } = reactiveHandler()
export function reactive(raw: Object) {
  return new Proxy(raw,reactiveBase);
}

export function readonly(target) {
  return new Proxy(target, isReadonly)
}

