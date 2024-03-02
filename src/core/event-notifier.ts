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
        if (this.listeners[event]) {
            this.listeners[event].forEach((l: Function) => {
                try {
                    l && l.apply(null, args);
                } catch(e) {
                    console.error(e);
                }
            });
        }
        this.children.forEach((c) => {
            c.notify(event, args);
        })
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