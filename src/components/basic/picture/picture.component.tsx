import React from 'react';
import {  DimensionValue, Image, LayoutChangeEvent, View } from 'react-native';
import {Image as EXPOImage} from 'expo-image';
import { isNumber } from 'lodash-es';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import ImageSizeEstimator from '@wavemaker/app-rn-runtime/core/imageSizeEstimator';
import { isFullPathUrl } from '@wavemaker/app-rn-runtime/core/utils';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility';

import WmPictureProps from './picture.props';
import { DEFAULT_CLASS, WmPictureStyles } from './picture.styles';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';
import WmSkeleton, { createSkeleton } from '../skeleton/skeleton.component';

export class WmPictureState extends BaseComponentState<WmPictureProps> {
  naturalImageWidth: number = 0;
  naturalImageHeight: number = 0;
  imageWidth: number = 0;
  imageHeight: number = 0;
  originalContainerWidth: number = 0;
  originalContainerHeight: number = 0;
}

export default class WmPicture extends BaseComponent<WmPictureProps, WmPictureState, WmPictureStyles> {

  private _pictureSource = null as any;
  private _picturePlaceHolder = null as any;

  // The below property will be used to track and remove the calculateImageSize listenrs of individual picturesource
  private _cleanupTracker = {} as any

  constructor(props: WmPictureProps) {
    super(props, DEFAULT_CLASS, new WmPictureProps());
  }

  loadImage(image: string | undefined) {
    if (!image || !this.loadAsset) {
      return null;
    }
    const imageSrc = this.loadAsset(image) as any;
    if (imageSrc && typeof imageSrc === 'object' && typeof imageSrc.default === 'function') {
      return null;
    }
    // if(this.state.props.aspectratio) {
    //   return imageSrc;
    // }
    if (isNumber(imageSrc)) {
      const {width, height} = Image.resolveAssetSource(imageSrc);
      this.updateState({
        naturalImageWidth: width,
        naturalImageHeight: height
      } as WmPictureState);
    } else if (imageSrc !== null) {
      const cancel = ImageSizeEstimator.getSize(imageSrc, (width: number, height: number) => {
        this.updateState({
          naturalImageWidth: width,
          naturalImageHeight: height
        } as WmPictureState);
        this.cleanup.splice(this.cleanup.indexOf(cancel), 1);
      });
      if(this.props.picturesource && this._cleanupTracker[this.props.picturesource]) {
        this._cleanupTracker[this.props.picturesource].push(cancel)
      } else if(this.props.picturesource && !this._cleanupTracker[this.props.picturesource]) {
        this._cleanupTracker[this.props.picturesource] = [];
        this._cleanupTracker[this.props.picturesource].push(cancel)
      }
      this.cleanup.push(cancel);
    }
    return imageSrc;
  }

    // Check if the image source prop is changed from previous update to remove all listeners
  componentDidUpdate(prevProps: Readonly<WmPictureProps>, prevState: Readonly<WmPictureState>, snapshot?: any): void {
    if(this.state.props.picturesource !== prevProps.picturesource) {
      if(prevProps.picturesource && this._cleanupTracker[prevProps.picturesource]) {
        this._cleanupTracker[prevProps.picturesource].forEach((func: any) => {
          func();
        });  
        this._cleanupTracker[prevProps.picturesource] = []
        delete this._cleanupTracker[prevProps.picturesource] 
      }
    }
    super.componentDidUpdate(prevProps, prevState)
  }


  onPropertyChange(name: string, $new: any, $old: any) {
    switch(name) {
      case 'picturesource':
        this._pictureSource = null;
      case 'pictureplaceholder':
        this._picturePlaceHolder = null;
        break;
    }
  }

  onViewLayoutChange = (e: LayoutChangeEvent) => {
    let imageWidth = e.nativeEvent.layout.width;
    let imageHeight = e.nativeEvent.layout.height;
    if (!imageWidth && !imageHeight) {
      return;
    }
    if (!this.styles?.root.height
        || (typeof this.styles?.root.height === 'string'
          && !this.styles?.root.height.includes('%'))) {
        imageHeight = 0;
    }
    if(this.state.props.aspectratio && !imageHeight && imageWidth) {
      imageHeight = imageWidth / parseFloat(this.state.props.aspectratio as string)
    } else if (this.state.props.aspectratio && !imageWidth && imageHeight) {
      imageWidth = imageWidth * parseFloat(this.state.props.aspectratio as string)
    } else if (imageWidth && !imageHeight) {
      imageHeight = imageWidth * this.state.naturalImageHeight / this.state.naturalImageWidth;
    } else if (imageHeight && !imageWidth) {
      imageWidth = imageHeight * this.state.naturalImageWidth / this.state.naturalImageHeight;
    }
    this.updateState({
      imageWidth: imageWidth,
      imageHeight: imageHeight,
      originalContainerWidth: this.styles.root.width ? e.nativeEvent.layout.width : 0,
      originalContainerHeight: this.styles.root.height ? e.nativeEvent.layout.height: 0
    } as WmPictureState);
  };

  createShape(shape: string | undefined, imageWidth?: number | string): WmPictureStyles {
    if (shape) {
      switch(shape) {
        case 'circle':
          return {
            picture: {
              borderRadius: isNumber(imageWidth) ? imageWidth / 2 : 4
            }
          } as WmPictureStyles;
        case 'rounded' :
          return (this.theme.getStyle('rounded-image') as WmPictureStyles);
        case 'thumbnail' :
          return (this.theme.getStyle('thumbnail-image') as WmPictureStyles);
      }
    }
    return {} as WmPictureStyles;
  }

  getElementToShow(props: WmPictureProps, imgSrc: any, shapeStyles: WmPictureStyles) {
    let elementToshow, source;
    if (imgSrc && typeof imgSrc === 'object' && typeof imgSrc?.default === 'function') {
      let imgStyle : any = {};
      if (props.resizemode === 'contain') {
        imgStyle['width'] = '100%';
        imgStyle['height'] = '100%';
      }
      elementToshow = React.createElement(imgSrc?.default, imgStyle);
    //} else if (!isWebPreviewMode() && props.isSvg) {
    //  svg from uri
    //  elementToshow = <SvgUri testID={this.getTestId('picture')} width={this.styles.root.width as NumberProp} height={this.styles.root.height as NumberProp} uri={imgSrc}/>;
    } else if (isFullPathUrl(imgSrc)) {
      source = {
        uri: imgSrc
      };
    } else {
      source = imgSrc;
    }
    if (this.state.naturalImageWidth || this.state.props.aspectratio) {
      elementToshow = (
        // * INFO: if any issue arises like freezing of application because of 
        // * rendering large number of images, check the cache policy.
        <EXPOImage
          cachePolicy='memory' 
          {...this.getTestProps('picture')}
          style={[this.styles.picture, shapeStyles.picture, (props.fastload || this.state.imageWidth) ? {opacity: 1} : {opacity: 0} ]}
          contentFit={props.resizemode}
          source={source}
        />
      );
    }
    return elementToshow;
  }

  public renderSkeleton(props: WmPictureProps){
    const imageWidth = this.state.imageWidth;
    const imageHeight = this.state.imageHeight;
    const shapeStyles = this.createShape(this.props.shape, imageWidth);
    const skeletonWidth = this.props.skeletonwidth || this.styles.root?.width || shapeStyles.root?.width || shapeStyles.picture?.width || imageWidth;
    const skeletonHeight = this.props.skeletonheight || this.styles.root?.height || shapeStyles.root?.height || shapeStyles.picture?.height || imageHeight;
    return createSkeleton(this.theme, this.styles.skeleton, {
      ...this.styles.root,
      borderRadius:  this.props.shape == 'circle' && this.styles.root?.width ? 25 : shapeStyles.picture?.borderRadius || shapeStyles.root?.borderRadius || this.styles.root?.borderRadius || 4,
      width: skeletonWidth as DimensionValue,
      height: skeletonHeight as DimensionValue
    });
  }

  showImage = (imageElement: any, props: WmPictureProps) => {
    return imageElement;
  }


    //TODO: remove the re calculation logic later. Keeping it as an extra safety.  
    calculateBasedOnaspectratio(): {imageWidth: number, imageHeight: number} | null  {
      if(this.state.props.aspectratio) {
        if(this.state.originalContainerWidth) {
          return {
            imageHeight: this.state.originalContainerWidth / parseFloat(this.state.props.aspectratio as string),
            imageWidth: this.state.originalContainerWidth
          }
        } else if(this.state.originalContainerHeight) {
          return {
            imageHeight: this.state.originalContainerHeight, 
            imageWidth: this.state.originalContainerHeight * parseFloat(this.state.props.aspectratio as string),
          }
        }
      }
      return null
    }
    
    //TODO: remove the re calculation logic later. Keeping it as an extra safety.  
    calculateBasedOnNaturalDimensions(): {imageWidth: number, imageHeight: number} | null {
      // No need to calculate width & height if the user already passign them explicitly from props.  
      const widthAndHeightExistsInProps = this.styles.root.width && this.styles.root.height
      if(!this.state.props.aspectratio && !widthAndHeightExistsInProps) {
        if(this.state.originalContainerWidth) {
          return {
            imageHeight: this.state.originalContainerWidth * this.state.naturalImageHeight / this.state.naturalImageWidth,
            imageWidth: this.state.originalContainerWidth
          }
        } else if(this.state.originalContainerHeight) {
          return {
            imageHeight: this.state.originalContainerHeight, 
            imageWidth: this.state.originalContainerHeight * this.state.naturalImageWidth / this.state.naturalImageHeight
          }
        }
      }
      return null
    }
  

  renderWidget(props: WmPictureProps) {
    let imageWidth = this.state.imageWidth;
    let imageHeight = this.state.imageHeight;


    //TODO: remove the re calculation logic later. Keeping it as an extra safety.  
    const aspectDimensions = this.calculateBasedOnaspectratio();
    const naturalDimensions = this.calculateBasedOnNaturalDimensions();
    if(aspectDimensions) {
      const dimensions = aspectDimensions as {imageWidth: number, imageHeight: number}
      imageWidth = dimensions.imageWidth;
      imageHeight = dimensions.imageHeight
    } else if(naturalDimensions) {
      const dimensions = naturalDimensions as {imageWidth: number, imageHeight: number}
      imageHeight = dimensions.imageHeight
      imageWidth = dimensions.imageWidth
    }
    const shapeStyles = this.createShape(props.shape, imageWidth);
    this._pictureSource =  this._pictureSource || this.loadImage(props.picturesource);
    this._picturePlaceHolder = props.fastload ? 
      (this._pictureSource || this._picturePlaceHolder || this.loadImage(props.pictureplaceholder)) :
      (this._picturePlaceHolder || this.loadImage(props.pictureplaceholder));
    const imgSrc: any = this._pictureSource || this._picturePlaceHolder;
    let elementToshow;
    if (imgSrc) {
      elementToshow = this.getElementToShow(props, imgSrc, shapeStyles);
    }
    return imgSrc && (this.state.naturalImageWidth || props.isSvg || props.aspectratio) ? (
      <View 
      style={[{
        width: imageWidth,
        height: imageHeight
      }, this.styles.root, shapeStyles.root, shapeStyles.picture]}
      onLayout={(event) => this.handleLayout(event)}
    >
        {this._background}
      <View style={[{overflow: 'hidden', width: '100%',
        height: '100%'}]} onLayout={this.onViewLayoutChange}>
        <Tappable
          disableTouchEffect={this.state.props.disabletoucheffect}
          {...this.getTestPropsForAction()}
          rippleColor={this.styles.root.rippleColor}
          target={this} styles={{width: imageWidth ? null : '100%', height: imageHeight ? null : '100%'}}>
          <Animatedview entryanimation={props.animation} delay={props.animationdelay} style={[{
                height: imageHeight,
                width: imageWidth,
                borderRadius: shapeStyles.picture?.borderRadius
              }]}
            accessibilityProps={props.accessible ? {...getAccessibilityProps(AccessibilityWidgetType.PICTURE, props)} : {}}>
                {this.showImage(elementToshow, props)}
            </Animatedview>
          </Tappable>
        </View>
      </View>
    ): null;
  }
}
