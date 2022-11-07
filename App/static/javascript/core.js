var event_registry = {};
export class Core {

    on(key, method){
        if (!event_registry[key]) {
            event_registry[key] = "";
        }
        event_registry[key] = method;
    }

    trigger(key, data){
       if (!event_registry[key])
         return;
        let method = event_registry[key];
        method(data);
    }
}
