// 响应式依赖副作用
let activeEffect
class ReactiveEffect {
    private _fn
    constructor(fn) {
        this._fn = fn
    }
    run(){
        this._fn()
    }
}

export function effect(fn){
    const _effect = new ReactiveEffect(fn)
    _effect.run()
}
// 追踪 weakMap=>{target:{key:effect}}
let targetMap = new WeakMap()
export function track(target, key){
    let depsMap = targetMap.get(target)
    if(!depsMap){
        targetMap.set(depsMap, depsMap= new Map())
    }
    let dep = depsMap.get(key)
    if(!dep){
        depsMap.set(key, dep = new Set())
    }
    dep.add(activeEffect)
}

export function trigger(target, key){
    let depsMap = targetMap.get(target) //获取目标对象
    let dep = depsMap.get(key) //取值
    for(let effect of dep){
        effect.run()
    }
}