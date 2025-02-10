import React from "react";

export class StickyHeight {
    public headerHeight: number;
    public stickyPosition: number;
    public stickyPositionUpdated: boolean;
    public testVal: string;

    constructor(){
        this.headerHeight = 0;
        this.stickyPosition = 0;
        this.stickyPositionUpdated = false;
        this.testVal = ''
    }

    setHeaderHeight(h: number): void{
        this.headerHeight = h;
    };
    getHeaderHeight(){
        console.log( this.headerHeight, ' this.headerHeight in context')
        return this.headerHeight;
    }

    setStickyPosition(p: number): void{
        console.log(this.stickyPositionUpdated, 'stickyPositionupdated==')
        if(!this.stickyPositionUpdated) {
            this.stickyPosition = p;
            this.stickyPositionUpdated = true;
        }
    }
    getStickyPosition(){
        console.log( this.stickyPosition, ' this.stickyPosition in context')
       return this.stickyPosition ;
    }

    setTest(v: string): void{
        console.log('setTest')
        this.testVal = v; 
    }

    getTest(){
        return this.testVal; 
    }
}

const StickyHeightContext = React.createContext<StickyHeight>(new StickyHeight());

export const StickyHeightProvider = StickyHeightContext.Provider;
export const StickyHeigtConsumer = StickyHeightContext.Consumer;

