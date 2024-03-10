export default class EventNotifier {
    private listeners = {} as any;
    private parent: EventNotifier = null as any;
    private children: EventNotifier[] = [];

    setParent(parent: EventNotifier) {
        if (parent !== this.parent) {
            this.parent = parent;
            this.parent.children.push(this);
        }
    }

    public notify(event: string, args: any[]) {
        let propagate = true;
        if (this.listeners[event]) {
            propagate = !this.listeners[event].find((l: Function) => {
                try {
                    return (l && l.apply(null, args)) === false;
                } catch(e) {
                    console.error(e);
                }
                return true;
            });
        }
        if (propagate) {
            this.children.forEach((c) => {
                c.notify(event, args);
            });
        }
    }

    public subscribe(event: string, fn: Function) {
        this.listeners[event] = this.listeners[event] || [];
        this.listeners[event].push(fn);
        return () => {
            const eventListeners = this.listeners[event];
            const i = eventListeners.findIndex((fni: Function) => fni === fn);
            eventListeners.splice(i, 1);
        };
    }

    public destroy() {
        if (this.parent) {
            const i = this.parent.children.indexOf(this) || -1;
            this.parent.children.splice(i, 1);
        }
    }
}