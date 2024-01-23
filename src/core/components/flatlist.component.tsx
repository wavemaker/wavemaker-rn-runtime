import { isEmpty } from 'lodash-es';
import React from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

const WMFlatList = (props: any) => {
  return (
    <View style={[{ flex: 1 }]}>
      {!isEmpty(props.groupedData)
        ? props.groupedData.map((v: any, i: number) => (
            <View
              style={{ marginBottom: 16, flex: 1 }}
              // key={v.key || props.getKey(v)} // * will cause re-render
              key={i}
            >
              {props.renderHeader(props, v.key)}
              <View style={{ flex: 1 }}>
                <FlatList
                  // estimatedItemSize={200}
                  onEndReachedThreshold={0.3}
                  onEndReached={props.handleOnEndReached}
                  keyExtractor={props.generateItemKey
                  }
                  horizontal={props.isHorizontal}
                  data={isEmpty(v.data[0]) ? [] : v.data}
                  ListEmptyComponent={props.listEmptyComponent
                  }
                  renderItem={props.renderItem
                  }
                  {...(props.isHorizontal
                    ? {}
                    : { numColumns: props.noOfColumns })}
                ></FlatList>
              </View>
            </View>
          ))
        : props.renderEmptyMessage}
    </View>
  );
};

export default WMFlatList;
