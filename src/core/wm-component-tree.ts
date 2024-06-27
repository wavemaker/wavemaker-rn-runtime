import { BaseComponent } from "./base.component";

export class WmComponentNode {
    type?: string;
    private _classnameMap: Map<string, boolean> = new Map();
    private _classnameVal = '';
    parent?: WmComponentNode;
    readonly children: WmComponentNode[] = [];
    instance?: BaseComponent<any, any, any>;
    

    public constructor(args: {
        type?: string,
        classname?: string,
        children?: WmComponentNode[],
        instance?: BaseComponent<any, any, any>
    }) {
        this.type = args.type;
        this.instance = args.instance;
        args.children?.forEach(c => this.add(c));
        this.classname = args.classname || '';
    }

    set classname(val: string) {
        if (val != this._classnameVal) {
            this._classnameVal = val || '';
            this._classnameMap = new Map();
            val?.split(' ').filter(c => !!c).forEach(c => {
                this._classnameMap.set(c, true);
            });
            this.refresh();
        }
    }

    private refreshSiblings() {
        // refresh siblings
        this.parent?.children?.forEach((c) => {
            c?.instance?.refresh();
        });
    }

    private refresh() {
        this.refreshSiblings();
        this.instance?.refresh();
        this.children?.forEach((c) => {
            c?.refresh();
        });
    }

    get classname() {
        return this._classnameVal;
    }

    hasClass(name: string) {
        return this._classnameMap.has(name);
    }

    add(node: WmComponentNode) {
        if (node.parent !== this) {
            node.parent?.remove(this);
            this.children.push(node);
            node.parent = this;
            node.refresh();
        }
    }

    remove(node: WmComponentNode) {
        const i = this.children.findIndex((n) => n === node);
        if (i >= 0) {
            this.children.splice(i, 1);
            node.parent = undefined;
            this.children?.forEach((c) => {
                c.refresh();
            });
        }
    }
}