import * as React from "react";
import { Dimensions, LayoutChangeEvent, Text, View } from "react-native";
import { GestureUpdateEvent, PanGestureChangeEventPayload, PanGestureHandlerEventPayload } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";

// const data = [...new Array(6).keys()];
// const width = Dimensions.get("window").width;

type ContainerDimension = {
  height: number;
  width: number;
}

const CarousalAnimation = (props: any) => {
  let count = 0;

  const ref = React.useRef<ICarouselInstance>(null);
  const gestureTranslateXValue = React.useRef<number | null>(null);
  const prevIndex = React.useRef<number>(0);
  const swipeStartRef = React.useRef<any>(null)

  const [height, setHeight] = React.useState<number | null>(null);

  const progress = useSharedValue<number>(0);
  const [containerDimension, setContainerDimension] = React.useState<null | ContainerDimension>(null);
  let childLayout: any[] = [];

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };

  const setChildrenLayout = (event: LayoutChangeEvent, index: number) => {
    childLayout[index] = event.nativeEvent.layout;
    if (containerDimension === null) {
      setContainerDimension({
        height: event.nativeEvent.layout.height,
        width: event.nativeEvent.layout.width
      })
    }
  }

  const handleGestureChange = (event: GestureUpdateEvent<PanGestureHandlerEventPayload & PanGestureChangeEventPayload>) => {
    "worklet";
    gestureTranslateXValue.current = event.translationX;
  }

  // const startScrollTimer = ({count, animated}: {count: number, animated: boolean}) => {
  //   if(ref.current === null) {
  //     return;
  //   }

  //   ref.current.scrollTo({
  //     count,
  //     animated
  //   });
  // }

  // const clearScrollTimer = () => {
  //   clearTimeout(swipeStartRef.current);
  //   swipeStartRef.current = null;
  // }

  const handleScrollEnd = (index: number) => {
    if (
      ref.current === null ||
      gestureTranslateXValue.current === null ||
      !props.data?.length ||
      prevIndex.current !== index
    ) {
      prevIndex.current = index;
      return;
    }

    if (
      props.data.length === index + 1 &&
      gestureTranslateXValue.current < -29
    ) {
      prevIndex.current = 0;
      ref.current.scrollTo({
        count: -index,
        animated: true
      })
    }

    if (
      index === 0 &&
      gestureTranslateXValue.current > 29
    ) {
      prevIndex.current = props.data.length - 1;
      ref.current.scrollTo({
        count: props.data.length - 1,
        animated: true
      })
    }
  }

  React.useEffect(() => {
    if (ref !== null && ref.current !== null) {
      props.setRef(ref.current)
    }
  }, [ref, ref.current, props.height])

  return (
    <View
      style={{ flex: 1 }}
    >
      <>
        {(props.width && props.width > 0 && props.height && props.height > 0) &&
          <Carousel
            loop={false}
            ref={ref}
            width={props.width}
            height={props.height}
            data={props.data}
            // onProgressChange={progress}
            onProgressChange={(offsetProgress: number, absoluteProgress: number)=>{
              if(props.activeIndex !== (Math.floor(absoluteProgress) + 1)){
                props.updateActiveIndex((Math.floor(absoluteProgress) + 1))
              }
            }}
            // snapEnabled={true}
            containerStyle={{flex: 1, height: '100%'}}
            mode="parallax"
            onConfigurePanGesture={gestureChain => {
              'worklet';
              gestureChain.activeOffsetX([-30, 30]).onChange(handleGestureChange)
            }}
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 50,
              parallaxAdjacentItemScale: 0.9,
            }}
            onScrollEnd={handleScrollEnd}
            renderItem={({ item, index }) => {
              return (
                <View style={[props.slideMinWidth ? {
                  minWidth: props.slideMinWidth
                } : {
                  width: props.slideWidth
                },
                props.style?.height === '100%' ? {
                  height: '100%'
                } : {},
                ]}
                >
                  {props.renderItem({ item, index })}
                </View>
              )
            }}
          />
        }
      </>
      {
        props.height === null && (
          <View style={[props.slideMinWidth ? {
            minWidth: props.slideMinWidth
          } : {
            width: props.slideWidth
          },
          props.style?.height === '100%' ? {
            height: '100%'
          } : {},
          { zIndex: -99, opacity: 0 }
          ]}
            onLayout={(event: any) => {
              if (event.nativeEvent.layout.height && event.nativeEvent.layout.height !== props.height) {
                // setHeight(event.nativeEvent.layout.height)
                const {height, width} = event.nativeEvent.layout
                props.callback();
                setTimeout(() => {
                  props.updateDimensions({
                    // width,
                    height
                  })
                }, 5)
              }
            }}
          >
            {props.renderItem({ item: props.data[0], index: 0 })}
          </View>
        )
      }

    </View>
  );
  {/* <Pagination.Basic
      progress={progress}
      data={props.data}
      dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 50 }}
      containerStyle={{ gap: 5, marginTop: 10 }}
      onPress={onPressPagination}
    /> */}
}

export default React.memo(CarousalAnimation);