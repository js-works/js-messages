import defineEffect from './defineEffect';

export default Object.freeze({
    log: defineEffect('log', (...args) => () => {
        console.log(...args);
    }),

    dispatch: defineEffect('dispatch', (...msgs) => ({ dispatch }) => {
        const messages = typeof msgs == 'function' ? msgs() : msgs;


        for (let i = 0; i < messages.length; ++i) {
            dispatch(messages[i]);
        }
    }),

    interval: defineEffect('interval', config => ({ dispatch, registerReceiver }) => { 
        const
            milliseconds = config.milliseconds,
            involvedStartTypes = {},
            involvedStopTypes = {};

        if (config === null && typeof config !== 'object') {
            throw new TypeError('[interval] Configuration must be an object');
        } else if (typeof config.milliseconds !== 'number') {
            throw new TypeError('[interval] Configuration parameter "milliseconds" must be a number');
        } else if (config.milliseconds <= 0) {
            throw new TypeError('[interval] Configuration parameter must be a positive number');
        }

        const
            startWhen = config.startWhen
                ? (Array.isArray(config.startWhen) ? config.startWhen : [config.startWhen])
                : null,

            stopWhen = config.stopWhen
                ? (Array.isArray(config.stopWhen) ? config.stopWhen : [config.stopWhen])
                : null;

        let
            startTime = null,
            intervalId = null;
        
        if (!startWhen) {
            startTime = new Date();

            intervalId = setInterval(() => {
                dispatch(config.onTick(new Date(), startTime));
            }, milliseconds);
        } else {
            for (let i = 0; i < startWhen.length; ++i) {
                const startType =
                    typeof startWhen[i] === 'function'
                        ? startWhen[i].type
                        : startWhen[i];

                involvedStartTypes[startType] = true;

                const unregister = registerReceiver(msg => { 
                    if (msg && msg.type && involvedStartTypes[msg.type] === true) {
                        unregister();
                        
                        startTime = new Date();

                        intervalId = setInterval(() => {
                            dispatch(config.onTick(new Date(), startTime));
                        }, milliseconds);

                        if (config.onStart) {
                            dispatch(config.onStart(new Date()));
                        }
                    }
                });
            }

        }

        if (stopWhen) {
            for (let i = 0; i < stopWhen.length; ++i) {
                const stopType =
                    typeof stopWhen[i] === 'function'
                        ? stopWhen[i].type
                        : stopWhen[i];

                involvedStopTypes[stopType] = true;
            }

            const unregister = registerReceiver(msg => {
                if (msg && msg.type && involvedStopTypes[msg.type] === true) {
                    clearInterval(intervalId);
                    unregister();

                    intervalId = null;

                    if (config.onStop) {
                        dispatch(config.onStop(new Date(), startTime));
                    }
                }
            });
        }

        const date = new Date();

        if (config.onInit) {
            dispatch(config.onInit(date));
        }

        if (config.onStart && !config.startWhen) {
            dispatch(config.onStart(date));
        }
    })
});
