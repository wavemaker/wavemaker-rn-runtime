import { Dimensions } from "react-native";
import EventNotifier from "./event-notifier";


export const SCREEN_ORIENTATION = {
    LANDSCAPE: 'LANDSCAPE',
    PORTRAIT: 'PORTRAIT'
};

export const EVENTS = {
    ORIENTATION_CHANGE: 'orientationChange',
    SIZE_CHANGE: 'sizeChange'
};

class ViewPort extends EventNotifier {
    public width: number;
    public height: number;
    public orientation: string;

    constructor() {
        super();
        const dim = Dimensions.get('screen');
        this.width = dim.width;
        this.height = dim.height;
        this.orientation = this.width > this.height ? SCREEN_ORIENTATION.LANDSCAPE: SCREEN_ORIENTATION.PORTRAIT;
        Dimensions.addEventListener('change', () => {
            const dim = Dimensions.get('window');
            const orientation = dim.width > dim.height ? SCREEN_ORIENTATION.LANDSCAPE: SCREEN_ORIENTATION.PORTRAIT;
            this.notify(EVENTS.SIZE_CHANGE, [
                {width: dim.width, height: dim.height}, 
                {width: this.width, height: this.height}
            ]);
            this.width = dim.width;
            this.height = dim.height;
            if (this.orientation != orientation) {
                this.notify(EVENTS.ORIENTATION_CHANGE, [orientation, this.orientation]);
                this.orientation = orientation;
            }
        });
    }
}

export default new ViewPort();