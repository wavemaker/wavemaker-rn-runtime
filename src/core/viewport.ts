import { Dimensions, Platform } from "react-native";
import EventNotifier from "./event-notifier";
import * as ScreenOrientation from 'expo-screen-orientation';

export const SCREEN_ORIENTATION = {
    LANDSCAPE: 'LANDSCAPE',
    PORTRAIT: 'PORTRAIT'
};

export const EVENTS = {
    ORIENTATION_CHANGE: 'orientationChange',
    SIZE_CHANGE: 'sizeChange'
};


const getCurrentOrientation = (orientationIndex: number) => {
    switch (orientationIndex) {
        case ScreenOrientation.Orientation.LANDSCAPE_LEFT:
            return SCREEN_ORIENTATION.LANDSCAPE;
        case ScreenOrientation.Orientation.LANDSCAPE_RIGHT:
            return SCREEN_ORIENTATION.LANDSCAPE;
        case ScreenOrientation.Orientation.PORTRAIT_DOWN:
            return SCREEN_ORIENTATION.PORTRAIT;
        case ScreenOrientation.Orientation.PORTRAIT_UP:
            return SCREEN_ORIENTATION.PORTRAIT;
        default:
            const {width, height} = Dimensions.get('window');
            return  width > height ? SCREEN_ORIENTATION.LANDSCAPE: SCREEN_ORIENTATION.PORTRAIT;
    }
}

export class ViewPort extends EventNotifier {
    public width: number;
    public height: number;
    public orientation: string;
    public isMobileType = true;

    constructor() {
        super();
        const dim = Dimensions.get('window');
        this.width = dim.width;
        this.height = dim.height;
        this.orientation = this.width > this.height ? SCREEN_ORIENTATION.LANDSCAPE: SCREEN_ORIENTATION.PORTRAIT;
        this.init();

        ScreenOrientation.addOrientationChangeListener((event: ScreenOrientation.OrientationChangeEvent) => {
            const dim = Dimensions.get('window');
            if(Platform.OS === 'ios' && Platform.isPad) {
                if(getCurrentOrientation(event.orientationInfo.orientation) !== this.orientation) {
                    const screenDim = Dimensions.get('screen');
                    const {width: sWidth, height: sHeight} = screenDim;
                    screenDim.width = sHeight;
                    screenDim.height = sWidth;
                    
                    const {width, height} = dim;
                    dim.width = height;
                    dim.height = width;

                    Dimensions.set({
                        "screen": screenDim,
                        "window": dim
                    });
                }
            }
            
            const orientation = getCurrentOrientation(event.orientationInfo.orientation);
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

    private init() {
        this.notify(EVENTS.SIZE_CHANGE, [
            {width: this.width, height: this.height},
            {width: 0, height: 0} 
        ]);
        this.notify(EVENTS.ORIENTATION_CHANGE, [this.orientation, this.orientation]);
    }
}

export default new ViewPort();