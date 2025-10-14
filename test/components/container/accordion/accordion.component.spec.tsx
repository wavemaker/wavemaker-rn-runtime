import React, { createRef } from 'react';
import {
  render,
  fireEvent,
  waitFor,
  screen,
  act,
  cleanup,
} from '@testing-library/react-native';
import WmAccordion from '@wavemaker/app-rn-runtime/components/container/accordion/accordion.component';
import WmAccordionpane from '@wavemaker/app-rn-runtime/components/container/accordion/accordionpane/accordionpane.component';
import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import WmAccordionProps from '../../../../src/components/container/accordion/accordion.props';
import { Platform } from 'react-native';

const defaultProps = {
  animation: 'fadeInDown',
  children: null,
  defaultpaneindex: 0,
  closeothers: true,
  name: 'accordion1',
} as WmAccordionProps;

const timer = (time = 100) =>
  new Promise((resolve: any, reject) => {
    setTimeout(() => resolve(), time);
  });

const generateAccordionPane = (
  items: number = 1,
  props: any = null,
  renderPartial: any = () => null,
  partialComponent: boolean = false
) => {
  const arr: any = [];
  for (let i = 1; i <= items; i++) {
    arr.push(
      <WmAccordionpane
        memoize="false"
        name={`accordionpane${i}`}
        title={`Title${i}`}
        subheading={`subtitle${i}`}
        badgevalue={`badge${i}`}
        iconclass={`wm-sl-l sl-apple`}
        badgetype="danger"
        key={`Title${i}`}
        renderPartial={() => renderPartial()}
        {...props}
      >
        {!partialComponent && (
          <WmLabel
            name={`label${i}`}
            caption={`test caption${i} in accordion pane`}
          ></WmLabel>
        )}
      </WmAccordionpane>
    );
  }
  return arr;
};

const childrensLength = 3;
const CompWithChildrens = {
  children: generateAccordionPane(childrensLength),
} as WmAccordionProps;

const renderPartial = (props: any, onLoad: any) => {
  return (
    <WmLabel name={'PartialLabel'} caption={`Partial label caption`}></WmLabel>
  );
};

const CompWithPartial = {
  children: generateAccordionPane(
    1,
    { onLoad: jest.fn() },
    renderPartial,
    true
  ),
} as WmAccordionProps;

const getAccordionPanes = () => {
  return Array.from(CompWithChildrens.children);
};

const getTitles = () => {
  return Array.from(CompWithChildrens.children).map(
    (pane: any) => pane.props.title
  );
};

const getSubHeading = () => {
  return Array.from(CompWithChildrens.children).map(
    (pane: any) => pane.props.subheading
  );
};

const getBadgeValues = () => {
  return Array.from(CompWithChildrens.children).map(
    (pane: any) => pane.props.badgevalue
  );
};

const getIconClass = () => {
  return Array.from(CompWithChildrens.children).map((pane: any) => {
    const match = pane.props.iconclass
      ?.split(' ')[1]
      .replace(/^.*?-(.*)$/, '$1');
    return match;
  });
};

const renderComponent = (props = {}) =>
  render(<WmAccordion {...defaultProps} {...props} />);

afterEach(cleanup);

describe('WmAccordion Component', () => {
  test('check for render wmaccordion correctly with default props', async () => {
    const tree = renderComponent();
    expect(tree).toBeDefined();
    expect(tree).not.toBeNull();
    expect(tree).toMatchSnapshot();
  });

  xit('check for accordionpane getting except as an valid array', () => {
    // sending children default value of []
    expect(renderComponent({ children: [] })).toBeDefined();
  });

  xit('check for title, subheading rendered properly', () => {
    const { getAllByText } = renderComponent(CompWithChildrens);

    const panes_header_titles = getAllByText(/^Title\d{1,2}$/);
    expect(panes_header_titles.length).toBe(getTitles().length);
    const titles = panes_header_titles.map((title) => title.props.children);
    titles.map((t: string, i: number) => {
      expect(t).toBe(getTitles()[i]);
    });

    const panes_header_subheading = getAllByText(/^subtitle\d{1,2}$/);
    expect(panes_header_subheading.length).toBe(getSubHeading().length);
    const sub_headings = panes_header_subheading.map(
      (sub_heading) => sub_heading.props.children
    );
    sub_headings.map((s: string, i: number) => {
      expect(s).toBe(getSubHeading()[i]);
    });
  });

  xit('check for titleIcon rendered properly', () => {
    const { getAllByTestId, getByText } = renderComponent(CompWithChildrens);
    const accodionpane_icons = getAllByTestId(
      /^accordion\d_titleIcon\d+_icon$/
    );
    const icons = accodionpane_icons.map((icon) => icon.props.children);
    icons.map((ic: string, i: number) => {
      if (getIconClass()) expect(icons[i]).toBe(getIconClass()[i]);
    });
  });

  test('check for badge rendered properly with badgevalue', () => {
    const badgeArr = ['success', 'primary', 'info', 'warning', 'danger'];

    badgeArr.map((item, index) => {
      const CompWithBadge = {
        children: generateAccordionPane(1, { badgevalue: item }),
      };
      const tree = renderComponent(CompWithBadge);
      const badges_ids = tree.getAllByTestId(/^accordion\d_badge\d$/);
      const badges = badges_ids.map((b) => b.props.children);
      expect(badges[0]).toBe(badgeArr[index]);
    });

    const tree = renderComponent(CompWithChildrens);
    const badges_comp = tree.getAllByText(/^badge\d{1,2}$/);
    expect(badges_comp.length).toBe(getBadgeValues().length);
    const badge_values = badges_comp.map((i) => i.props.children);
    badge_values.map((b: string, i: number) => {
      expect(b).toBe(getBadgeValues()[i]);
    });
  });

  xit('should handle current item expanded correctly', async () => {
    // Simulating as web preview
    Platform.OS = 'web';
    const ref = createRef();
    const activeHeaderColor = '#4263eb'; // coming from theme primaryColor

    const { getByTestId, getByText } = renderComponent({
      ...CompWithChildrens,
      ref,
    });
    const currentItemIndex = childrensLength - 2;
    fireEvent.press(getByText(`Title${currentItemIndex + 1}`));

    // todo
    // first item it is expanded by default and not collapsing on other item expansion, need fix
    for (let i = 0; i < getAccordionPanes().length; i++) {
      await waitFor(() => {
        // check for header backgroundStyles applied properly
        const accordionHeader = getByTestId(`accordion1_header${i}`);
        const renderedHeaderStyles = accordionHeader.props.style[0][0];
        const expectedHeaderStyles = { backgroundColor: activeHeaderColor };
        if (i == currentItemIndex)
          expect(renderedHeaderStyles).toContainEqual(
            expect.objectContaining(expectedHeaderStyles)
          );
        else
          expect(renderedHeaderStyles).not.toContainEqual(
            expect.objectContaining(expectedHeaderStyles)
          );

        // check for accordionpane children displaying properly
        const contentLabel = getByTestId(
          `accordionpane${i + 1}_content_label${i + 1}`
        );
        const styleObj =
          i == currentItemIndex ? {} : { maxHeight: 0, overflow: 'hidden' };
        expect(contentLabel.props).toHaveProperty('style', styleObj);
      });
    }
  });

  xit('check for title, subheading styles applied properly', async () => {
    Platform.OS = 'web';
    const ref = createRef();
    const activeHeaderTitleColor = '#ffffff'; // coming from theme accordionActiveHeaderTextColor
    const expectedTitleStyles = { color: activeHeaderTitleColor };
    const expectedSubHeadingStyles = { color: activeHeaderTitleColor };

    renderComponent({ ...CompWithChildrens, ref });
    const currentItemIndex = childrensLength - 2;
    await waitFor(() => {
      fireEvent.press(screen.getByText(`Title${currentItemIndex + 1}`));
    });

    // todo
    // first item it is expanded by default and not collapsing on other item expansion, need fix
    for (let i = 0; i < getAccordionPanes().length; i++) {
      // check for title text color applied properly
      const title = screen.getByText(`Title${i + 1}`);
      const renderedTitleStyles = title.props.style;

      // check for subheader text color applied properly
      const subHeading = screen.getByText(`subtitle${i + 1}`);
      const renderedSubHeadingStyles = subHeading.props.style;

      await waitFor(() => {
        if (i == currentItemIndex) {
          expect(renderedTitleStyles).toContainEqual(
            expect.objectContaining(expectedTitleStyles)
          );
          expect(renderedSubHeadingStyles).toContainEqual(
            expect.objectContaining(expectedSubHeadingStyles)
          );
        } else {
          expect(renderedTitleStyles).not.toContainEqual(
            expect.objectContaining(expectedTitleStyles)
          );
          expect(renderedSubHeadingStyles).not.toContainEqual(
            expect.objectContaining(expectedSubHeadingStyles)
          );
        }
      });
    }
  });

  xit('check for expand method', async () => {
    //  Simulating as web preview
    Platform.OS = 'web';
    const ref = createRef();
    renderComponent({ ...CompWithChildrens, ref });

    ref.current.expand(`accordionpane2`);

    timer(1000);
    const contentLabel = screen.getByTestId(`accordionpane2_content_label2`);
    await waitFor(() => {
      expect(contentLabel.props.style).toEqual({});
    });
  });

  xit('check for collapse method', async () => {
    //  Simulating as web preview
    Platform.OS = 'web';
    const ref = createRef();
    renderComponent({ ...CompWithChildrens, ref });

    ref.current.collapse(`accordionpane2`);

    timer(1000);
    const contentLabel = screen.getByTestId(`accordionpane2_content_label2`);
    await waitFor(() => {
      expect(contentLabel.props.style).toEqual({
        maxHeight: 0,
        overflow: 'hidden',
      });
    });
  });

  test('check for onChange in accordion', async () => {
    const onChangeMock = jest.fn();
    const tree = renderComponent({
      ...CompWithChildrens,
      onChange: onChangeMock,
    });

    fireEvent.press(screen.getByText(`Title2`));

    await waitFor(() => {
      expect(onChangeMock).toHaveBeenCalled();
    });
  });

  test('check for onExpand and onCollpase in accordionpane', async () => {
    const onExpandMock = jest.fn();
    const onCollapseMock = jest.fn();
    const onChangeMock = jest.fn();

    const CompWithOnExpandCollpaseFn = {
      children: generateAccordionPane(childrensLength, {
        onExpand: onExpandMock,
        onCollapse: onCollapseMock,
      }),
    };
    // Simulating as web preview and expanding accordionpane
    Platform.OS = 'web';
    const ref = createRef();

    const { getByText } = renderComponent({
      ...CompWithOnExpandCollpaseFn,
      ref,
      onChange: onChangeMock,
    });
    const currentItemIndex = childrensLength - 2;
    fireEvent.press(getByText(`Title${currentItemIndex + 1}`));
    await timer(1000);
    expect(onExpandMock).toHaveBeenCalled();
    expect(onChangeMock).toHaveBeenCalled();

    fireEvent.press(getByText(`Title${currentItemIndex + 1}`));
    await timer(1000);
    expect(onCollapseMock).toHaveBeenCalled();
    expect(onChangeMock).toHaveBeenCalled();
  });

  test('render skeleton if showskeleton is true and showskeletonchildren is true', async () => {
    const renderSkeletonMock = jest.spyOn(
      WmAccordion.prototype,
      'renderSkeleton'
    );

    const tree = renderComponent({
      ...CompWithChildrens,
      showskeleton: true,
      showskeletonchildren: true,
    });
    expect(screen).toMatchSnapshot();

    expect(renderSkeletonMock).toHaveBeenCalled();
    const viewElement = tree.root;
    expect(viewElement.props.style.backgroundColor).toBe('transparent');
    expect(viewElement.props.style.borderColor).toBe('#eeeeee');
    renderSkeletonMock.mockRestore();
  });

  test('render skeleton if showskeleton is true and showskeletonchildren is false', async () => {
    const renderSkeletonMock = jest.spyOn(
      WmAccordion.prototype,
      'renderSkeleton'
    );

    const tree = renderComponent({
      ...CompWithChildrens,
      showskeleton: true,
      showskeletonchildren: false,
    });
    expect(screen).toMatchSnapshot();

    expect(renderSkeletonMock).toHaveBeenCalled();
    const viewElement = tree.root.props.children[0];
    expect(viewElement.props.style).toContainEqual({ opacity: 0 });
    renderSkeletonMock.mockRestore();
  });

  test('uses subheading when both subheading and description are set', () => {
    const children = (() => {
      const panes = Array.from(generateAccordionPane(1));
      const pane = React.cloneElement(panes[0] as any, {
        subheading: 'SH',
        description: 'DESC',
      });
      return [pane];
    })();

    const { getByText, queryByText } = renderComponent({ children });
    expect(getByText('SH')).toBeTruthy();
    expect(queryByText('DESC')).toBeNull();
  });

  test('falls back to description when subheading is undefined', () => {
    const children = (() => {
      const panes = Array.from(generateAccordionPane(1));
      const pane = React.cloneElement(panes[0] as any, {
        subheading: undefined,
        description: 'DESC_ONLY',
      });
      return [pane];
    })();

    const { getByText } = renderComponent({ children });
    expect(getByText('DESC_ONLY')).toBeTruthy();
  });

  test('uses custom expanded/collapsed icon classes when provided', async () => {
    const tree = renderComponent({
      ...CompWithChildrens,
      expandediconclass: 'wi wi-android',
      collapsediconclass: 'wi wi-close',
      defaultpaneindex: -1,
    });

    const getToggleIcon = () => {
      const icons = tree.UNSAFE_getAllByType(WmIcon) as any[];
      return icons.find(i => i.props.name === 'expand_collapse_icon');
    };

    expect(getToggleIcon().props.iconclass).toBe('wi wi-close');

    fireEvent.press(tree.getByText('Title1'));
    await waitFor(() => {
      expect(getToggleIcon().props.iconclass).toBe('wi wi-android');
    });
  });

  test('falls back to default collapsed icon when only expandediconclass is set', async () => {
    const tree = renderComponent({
      ...CompWithChildrens,
      expandediconclass: 'wi wi-android',
      defaultpaneindex: -1,
    });

    const getToggleIcon = () => {
      const icons = tree.UNSAFE_getAllByType(WmIcon) as any[];
      return icons.find(i => i.props.name === 'expand_collapse_icon');
    };

    expect(getToggleIcon().props.iconclass).toBe('wi wi-chevron-up');

    fireEvent.press(tree.getByText('Title1'));
    await waitFor(() => {
      expect(getToggleIcon().props.iconclass).toBe('wi wi-android');
    });
  });

  xit('check for partial inside accorionpane', async () => {
    const onLoadMock = jest.fn();
    const tree = renderComponent(CompWithPartial);
    expect(tree.getByText('Partial label caption')).toBeTruthy();

    // todo fix
    // check for partial onLoad event
    await waitFor(() => {
      expect(onLoadMock).toHaveBeenCalled();
    });
  });
});
