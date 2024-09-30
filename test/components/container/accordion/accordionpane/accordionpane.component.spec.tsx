import React, {  createRef } from 'react';
import { render, waitFor, screen } from '@testing-library/react-native';
import WmAccordionpane from '@wavemaker/app-rn-runtime/components/container/accordion/accordionpane/accordionpane.component';
import WmAccordion from '@wavemaker/app-rn-runtime/components/container/accordion/accordion.component';
import WmAccordionProps from '@wavemaker/app-rn-runtime/components/container/accordion/accordion.props';
import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';
import { Platform } from 'react-native';


const defaultProps =  {
  animation : 'fadeInDown', 
  children : null,
  defaultpaneindex : 0, 
  closeothers : true, 
  name: 'accordion1'
} as  WmAccordionProps

const timer = (time = 100) =>
  new Promise((resolve: any, reject) => {
    setTimeout(() => resolve(), time);
});

const generateAccordionPane = (
  items: number = 1, 
  props: any = null, 
  renderPartial: any = ()=> null, 
  partialComponent: boolean = false
)=> {
  const arr: any = []
  for(let i=1; i<= items; i++){
    arr.push(<WmAccordionpane
    memoize="false"
    name={`accordionpane${i}`}
    title={`Title${i}`}
    subheading={`subtitle${i}`}
    badgevalue={`badge${i}`}
    iconclass={`wm-sl-l sl-apple`}
    badgetype="danger"
    key={`Title${i}`}
    renderPartial={()=>renderPartial()}
    {...props}
    >
    {!partialComponent && 
    <WmLabel
        name={`label${i}`}
        caption={`test caption${i} in accordion pane`}
  ></WmLabel>
   }
  </WmAccordionpane>)
  }
  return arr
}

const CompWithChildrens =   {
  children: generateAccordionPane(2)
} as WmAccordionProps

const renderComponent = (props = {}) =>
  render (<WmAccordion {...defaultProps} {...props}/>)

describe('Test Accordionpane component', () => {
    test('check for render wmaccordionpane correctly with default props', () => {
      const tree = renderComponent()
      expect(tree).toBeDefined();
      expect(tree).not.toBeNull();
      expect(tree).toMatchSnapshot()
    });


    test('check for isCollapsed method', ()=>{
      const ref = createRef()
      render(<WmAccordion>
        <WmAccordionpane ref={ref}>
            <WmLabel caption="test"></WmLabel>
        </WmAccordionpane>
      </WmAccordion>)

      ref.current?.setState({collapsed: true })
      expect(ref.current?.isCollapsed()).toBe(true)

      ref.current?.setState({collapsed: false })
      expect(ref.current?.isCollapsed()).toBe(false)  
    })

    test('check for expand method', async()=>{
      Platform.OS = 'web';
      const ref = createRef()
      const CompChildrensWithRef =   {
        children: generateAccordionPane(2, {ref: ref})
      } as WmAccordionProps

      renderComponent(CompChildrensWithRef)
      ref.current.expand(`accordionpane2`)
  
      timer(1000)
      const contentLabel = screen.getByTestId(`accordionpane2_content_label2`);
      await waitFor(()=>{
        expect(contentLabel.props.style).toEqual({})
      })
    })
  
    test('check for collapse method', async()=>{
      //  Simulating as web preview
      Platform.OS = 'web';
      const ref = createRef()
      const CompChildrensWithRef =   {
        children: generateAccordionPane(3, {ref: ref})
      } as WmAccordionProps

      renderComponent(CompChildrensWithRef)
      ref.current.collapse(`accordionpane2`)
  
      timer(1000)
      const contentLabel = screen.getByTestId(`accordionpane2_content_label2`);
      await waitFor(()=>{
        expect(contentLabel.props.style).toEqual({
          maxHeight: 0,
          overflow: "hidden",
        })
      })
    })

    test('check for partial load', ()=>{
      // renderComponent(CompWithChildrens)
      const ref = createRef()
      render(<WmAccordion>
        <WmAccordionpane ref={ref}>
            <WmLabel caption="test"></WmLabel>
        </WmAccordionpane>
      </WmAccordion>)

      ref.current.onPartialLoad()
    })

});