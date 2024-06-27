import { last } from 'lodash-es';
import { WmComponentNode } from "@wavemaker/app-rn-runtime/core/wm-component-tree";

//https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity
class SpecificityWeight {

    private _value = 0;

    constructor(private w1 = 0, private w2 = 0, private w3 = 0) {
        this._value = this.w1 * 10000 + this.w2 * 100 + this.w3;
    }

    add(weight: SpecificityWeight) {
        return new SpecificityWeight(
            this.w1 + weight.w1,
            this.w2 + weight.w2,
            this.w3 + weight.w3
        );
    }

    get value() {
        return this._value;
    }

    compare(that: SpecificityWeight) {
        if (this._value > that._value) {
            return 1
        } else if (this._value < that._value) {
            return -1;
        }
        return 0;
    }

};

export abstract class Selector {
    constructor(public specificityWeight = new SpecificityWeight(0, 0, 0)) {

    }
    abstract select(node?: WmComponentNode): WmComponentNode | undefined;
}

export const parseSelector = (selectorStr: string): Selector => {
    const splits = selectorStr.trim()
        .replace(/\s[>]\s*/g, '>')
        .replace(/\s*[+]\s*/g, '+')
        .replace(/\s*~\s*/g, '~')
        .replace(/[\s]+/g, ' ')
        .replace(/([\s\+>~])/g, (v) => `_${v}_`)
        .split('_')
        .reverse();
    let selector: Selector = new NodeSelector(splits[0]);
    for (let i = 1; i < splits.length;) {
        const operator = splits[i];
        const nextSelector =  new NodeSelector(splits[i + 1]);
        if(operator === ' ') {
            selector = new ChildSelector(selector, nextSelector);
        } else if(operator === '+') {
            selector = new AdjacentSiblingSelector(selector, nextSelector);
        } else if(operator === '>') {
            selector = new ImmediateChildSelector(selector, nextSelector);
        } else if(operator === '~') {
            selector = new GeneralSiblingSelector(selector, nextSelector);
        }
        i += 2;
    }
    return selector;
};

export class NodeSelector extends Selector {

    readonly selectors: Selector[] = [];

    constructor(private selector: string) {
        super();
        const pseudoSelector = selector.split(':')[1];
        if (pseudoSelector === 'first-child') {
            this.selectors.push(new FirstChildSelector());
        } else if (pseudoSelector === 'last-child') {
            this.selectors.push(new LastChildSelector());
        }
        const _selector = selector.split(':')[0].split('.');
        _selector.forEach((s, i) => {
          if (i === 0) {
            s && this.selectors.push(new TypeSelector(s));
          } else {
            this.selectors.push(new ClassSelector(s));
          }
        });
        this.specificityWeight = this.selectors.reduce<SpecificityWeight>((p, s) => p.add(s.specificityWeight), new SpecificityWeight(0, 0, 0));
    }

    select(node?: WmComponentNode) {
        if(node && this.selectors.reduce<boolean>((p, s) => p && !!s.select(node), true)) {
            return node;
        }
        return undefined;
    }

}

export class ClassSelector extends Selector {

    constructor(private classname: string) {
        super(new SpecificityWeight(0, 1, 0));
    }

    select(node?: WmComponentNode) {
        return node?.hasClass(this.classname) ? node : undefined;
    }
}

export class TypeSelector extends Selector {

    constructor(private type: string) {
        super(new SpecificityWeight(0, 0, 1));
    }

    select(node?: WmComponentNode) {
        return node?.type === this.type ? node : undefined;
    }
}

export class FirstChildSelector extends Selector {

    constructor() {
        super(new SpecificityWeight(0, 1, 0));
    }

    select(node?: WmComponentNode) {
        return node?.parent?.children[0] === node ? node: undefined;
    }
}

export class LastChildSelector extends Selector {

    constructor() {
        super(new SpecificityWeight(0, 1, 0));
    }

    select(node?: WmComponentNode) {
        return last(node?.parent?.children) === node ? node: undefined;
    }
}

export class AdjacentSiblingSelector extends Selector {
    constructor(private selector: Selector, private sibling: Selector) {
        super();
        this.specificityWeight = this.specificityWeight
            .add(this.selector.specificityWeight)
            .add(this.sibling.specificityWeight);
    }

    select(node?: WmComponentNode) {
        if(!node) {
            return undefined;
        }
        node = this.selector.select(node) as WmComponentNode;
        if (node) {
            const siblings = node.parent?.children || [];
            const adjSibling = siblings[siblings.indexOf(node) - 1];
            if (this.sibling.select(adjSibling)) {
                return adjSibling;
            }
        }
        return undefined;
    }
}

export class GeneralSiblingSelector extends Selector {
    constructor(private selector: Selector, private sibling: Selector) {
        super();
        this.specificityWeight = this.specificityWeight
            .add(this.selector.specificityWeight)
            .add(this.sibling.specificityWeight);
    }

    select(node?: WmComponentNode) {
        if(!node) {
            return undefined;
        }
        node = this.selector.select(node);
        if (node) {
            const siblings = node.parent?.children || [] as WmComponentNode[];
            const index = siblings.indexOf(node);
            return siblings.filter((s, i) => i < index)
                .find(s => !!this.sibling.select(s)) as any;
        }
        return undefined;
    }
}

export class ChildSelector extends Selector {

    constructor(private selector: Selector, private parentSelector: Selector) {
        super();
        this.specificityWeight = this.specificityWeight
            .add(this.selector.specificityWeight)
            .add(this.parentSelector.specificityWeight);
    }

    select(node?: WmComponentNode) {
        if(!node) {
            return undefined;
        }
        node = this.selector.select(node);
        if (node) {
            let parent = node.parent;
            while(parent) {
                if (this.parentSelector.select(parent)) {
                    return parent;
                }
                parent = parent.parent;
            }
        }
        return undefined;
    }
}

export class ImmediateChildSelector extends Selector {

    constructor(private selector: Selector, private parentSelector: Selector) {
        super();
        this.specificityWeight = this.specificityWeight
            .add(this.selector.specificityWeight)
            .add(this.parentSelector.specificityWeight);
    }

    select(node?: WmComponentNode){
        if(!node) {
            return undefined;
        }
        node = this.selector.select(node) 
        if (node) {
            return this.parentSelector.select(node.parent);
        }
        return undefined;
    }
}