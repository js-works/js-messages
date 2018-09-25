import defineStore from './defineStore';

const symbolObservable =
    typeof Symbol === 'function' && Symbol.observable
        ? Symbol.observable
        : '@@observable';

export default function defineProcess(messageCreators, createState) {
    const createStore = defineStore(messageCreators, createState);

    return (...args) => {
        const store = createStore(...args);

        return actionObservable => {
            actionObservable.subscribe({
                next: value => store.dispatch(value)
            });
            
            const ret = {
                subscribe: subscriber => {
                    let closed = false;

                    const dispose = store.subscribe(
                        () => subscriber.next(store.getState()));

                    subscriber.next(store.getState());

                    const subscription = {
                        unsubscribe() {
                            dispose();
                            closed = true;
                        },

                        get closed() {
                            return closed;
                        },
                    
                        [symbolObservable]: ret
                    };

                    return subscription;
                }
            };

            return ret;
        };
    };    
}
