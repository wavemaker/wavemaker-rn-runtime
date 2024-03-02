let i = 1;
export default class EventNotifier {
    public name = '';
    public id = i++;
    private listeners = {} as any;
    private parent: EventNotifier = null as any;
    private children: EventNotifier[] = [];

    setParent(parent: EventNotifier) {
        if (parent !== this.parent) {
            this.removeFromParent();
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

    private removeFromParent() {
        if (this.parent) {
            const i = this.parent.children.indexOf(this) || -1;
            if (i >= 0) {
                this.parent.children.splice(i, 1);
            }
            this.parent = null as any;
        }
    }

    public destroy() {
        this.removeFromParent();
    }
}