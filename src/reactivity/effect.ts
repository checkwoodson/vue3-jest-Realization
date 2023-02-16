// 响应式依赖副作用
let activeEffect
class ReactiveEffect {
    private _fn
    constructor(fn, public scheduler?) {
        this._fn = fn
    }
    run() {
        activeEffect = this
        return this._fn()
    }
}

export function effect(fn, options: any = {}) {
    const _effect = new ReactiveEffect(fn, options.scheduler)
    _effect.run()
    // 当前调用的_effect指向ReactiveEffect实例
    return _effect.run.bind(_effect)
}
// 追踪 weakMap=>{target:{key:effect}}
let targetMap = new WeakMap()
export function track(target, key) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
    }
    let dep = depsMap.get(key)
    if (!dep) {
        depsMap.set(key, (dep = new Set()))
    }
    dep.add(activeEffect)
}

export function trigger(target, key) {
    let depsMap = targetMap.get(target) //获取目标对象
    let dep = depsMap.get(key) //取值
    for (let effect of dep) {
        if (effect.scheduler) {
            effect.scheduler()
        } else {
            effect.run()
        }
    }
}