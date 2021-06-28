import { BaseComponent, BaseComponentState } from "@wavemaker/app-rn-runtime/core/base.component";
import BaseDatasetProps from '@wavemaker/app-rn-runtime/components/input/basedataset/basedataset.props';
import { includes, isUndefined, isNull, orderBy, groupBy, toLower, get, forEach, sortBy, cloneDeep, keys, values } from 'lodash';
import { DEFAULT_CLASS, DEFAULT_STYLES, BaseDatasetStyles } from "@wavemaker/app-rn-runtime/components/input/basedataset/basedataset.styles";
import moment from "moment";

export class BaseDatasetState <T extends BaseDatasetProps> extends BaseComponentState<T> {
  dataItems: any;
  groupedData: any;
}
const GROUP_BY_OPTIONS = {
  ALPHABET: 'alphabet',
  WORD: 'word',
  OTHERS: 'Others'
};
const TIME_ROLLUP_OPTIONS = {
  HOUR: 'hour',
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year'
};

export abstract class BaseDatasetComponent< T extends BaseDatasetProps, S extends BaseDatasetState<T>, L extends BaseDatasetStyles> extends BaseComponent<T, S, L> {

  constructor(props: T, public defaultClass: string = DEFAULT_CLASS, defaultStyles: L = DEFAULT_STYLES as L, defaultProps?: T, defaultState?: S) {
    super(props, defaultClass, defaultStyles, defaultProps, defaultState);

  }

  /**
   * This method prepares the grouped data.
   *
   * @param fieldDefs array of objects i.e. dataset
   * @param groupby string groupby
   * @param match string match
   * @param orderby string orderby
   * @param dateFormat string date format
   */
  getGroupedData(fieldDefs: any, groupby: string, match: string, orderby: string, dateFormat: string) {
    // handling case-in-sensitive scenario
    // ordering the data based on groupby field. If there is innerItem then apply orderby using the innerItem's containing the groupby field.
    fieldDefs = orderBy(fieldDefs, fieldDef => {
      const groupKey = get(fieldDef.dataObject, groupby);
      if (groupKey) {
        return toLower(groupKey);
      }
      return '';
    });

    // extract the grouped data based on the field obtained from 'groupDataByField'.
    const groupedLiData = groupBy(fieldDefs, function (fieldDef) {
      let concatStr = get(fieldDef.dataObject, groupby);
      // by default set the undefined groupKey as 'others'
      if (isUndefined(concatStr) || isNull(concatStr) || concatStr.toString().trim() === '') {
        return GROUP_BY_OPTIONS.OTHERS;
      }
      // if match prop is alphabetic ,get the starting alphabet of the word as key.
      if (match === GROUP_BY_OPTIONS.ALPHABET) {
        concatStr = concatStr.substr(0, 1);
      }

      // if match contains the time options then get the concatStr using 'getTimeRolledUpString'
      if (includes(values(TIME_ROLLUP_OPTIONS), match)) {
        dateFormat = dateFormat && dateFormat.replace(/d/g, 'D');
        dateFormat = dateFormat && dateFormat.replace(/y/g, 'Y');
        concatStr = moment(concatStr).format(dateFormat);
      }

      return concatStr;
    });

    return this.getSortedGroupedData(groupedLiData, groupby, orderby);
  };

    /**
     * function to get the ordered dataset based on the given orderby
     */
  getOrderedDataset(dataSet: any, orderby: string, innerItem?: any) {
      if (!orderBy) {
        return cloneDeep(dataSet);
      }

      // The order by only works when the dataset contains list of objects.
      const items = orderby && orderby.split(','),
        fields: any = [],
        directions: any = [];
      items && items.forEach( obj => {
        const item = obj.split(':');
        fields.push(innerItem ? innerItem + '.' + item[0] : item[0]);
        directions.push(item[1]);
      });
      return orderBy(dataSet, fields, directions);
    };


  /**
   * This method returns sorted data based to groupkey.
   * Returns a array of objects, each object containing key which is groupKey and data is the sorted data which is sorted by groupby field in the data.
   *
   * @param groupedLiData, grouped data object with key as the groupKey and its value as the array of objects grouped under the groupKey.
   * @param groupBy, string groupby property
   * @returns {any[]}
   */
  getSortedGroupedData(groupedLiData: any, groupBy: string, orderby: string) {
    const _groupedData: any = [];
    forEach(keys(groupedLiData), (groupkey, index) => {
      const liData = this.getOrderedDataset(groupedLiData[groupkey], orderby, 'dataObject');
      _groupedData.push({
        key: groupkey,
        data: sortBy(liData, data => {
          data._groupIndex = index + 1;
          return get(data, groupBy) || get(data.dataObject, groupBy);
        })
      });
    });
    return _groupedData;
  };

  onPropertyChange(name: string, $new: any, $old: any) {
    const props = this.state.props;
    switch (name) {
      case 'dataset':
        this.setDataItems($new);
        break;
      case 'groupby':
      case 'match':
        this.setGroupData(this.state.dataItems);
    }
  }

  setGroupData(items: any) {
    const dataItems = items;
    const props = this.state.props;
    if (props.groupby) {
      const groupedData = dataItems && this.getGroupedData(dataItems, props.groupby, props.match, props.orderby, props.dateformat);
      this.updateState({ groupedData: groupedData } as S);
    }
  }

  onChange(value: any) {
    if (!value) {
      return;
    }

    this.updateState({ props: { datavalue: value } } as S,
      ()=>this.invokeEventCallback('onChange', [ undefined, this.proxy, value, this.state.props.datavalue ]));
  }
  setDataItems(dataset: any) {
    const name = this.props.name;
    const props = this.state.props;
    const datavalue = props.datavalue;
    let dataItems: any = [];
    let datavalueItems: any = [];
    if (typeof datavalue === 'string') {
      datavalueItems = datavalue.split(',');
    }
    if (typeof dataset === 'string') {
      dataItems = dataset.split(',').map((s, i) => {
        return {
          key: `${name}_item${i}`,
          dataObject: s,
          displayfield: s,
          datafield: s,
          selected: includes(datavalueItems, s) || datavalue === s ? true : false,
        };
      });
    } else if (dataset) {
      dataItems = (dataset as any[]).map((d, i) => {
        return {
          key: `${name}_item${i}`,
          dataObject: d,
          displayfield: d[this.state.props.displayfield],
          datafield: d[this.state.props.datafield],
          displayexp: this.state.props.getDisplayExpression ? this.state.props.getDisplayExpression(d) : d[this.state.props.displayfield],
          selected: includes(datavalueItems, d[this.state.props.datafield]) || datavalue === d[this.state.props.datafield] ? true : false,
        };
      });
    }
    this.updateState({ dataItems: dataItems } as S);
    this.setGroupData(dataItems);
  }
}
