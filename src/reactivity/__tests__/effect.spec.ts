import { reactive } from '../reactivity';
import { effect } from '../effect';
describe('effect', function () {
    it('effect part', function () {
        // * 首先定义一个响应式对象
        const user = reactive({
            age: 10
        })

        // * get -> 收集依赖
        let nextAge;
        effect(() => {
            nextAge = user.age + 1;
        })

        // * effect默认会执行一次
        expect(nextAge).toBe(11);

        // * set -> 触发依赖
        user.age++;
        expect(nextAge).toBe(12);
    });
    it('runner', () => {
        let foo = 10;
        const runner = effect(() => {
            foo++;
            return 'foo'
        })
        expect(foo).toBe(11);
        const r = runner(); // 接住返回值
        expect(foo).toBe(12); //第二次执行 foo++
        expect(r).toBe('foo');
    })
    it('scheduler', () => {
        let dummy;
        let run: any;
        const scheduler = jest.fn(() => {
            run = runner;
        });
        const obj = reactive({ foo: 1 });
        const runner = effect(
            () => {
                dummy = obj.foo;
            },
            { scheduler },
        );
        expect(scheduler).not.toHaveBeenCalled();
        expect(dummy).toBe(1);
        // should be called on first trigger
        obj.foo++;
        expect(scheduler).toHaveBeenCalledTimes(1);
        // should not run yet
        expect(dummy).toBe(1);
        // manually run
        run();
        // should have run
        expect(dummy).toBe(2);
    });
});