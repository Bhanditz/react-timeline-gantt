import React from 'react'
import ReactDOM from 'react-dom'
import TimeLine from './TimeLine'
import {BUFFER_DAYS,DATA_CONTAINER_WIDTH} from 'libs/Const'
import { shallow ,mount} from 'enzyme';



describe('TimeLine Initialization ', function () {
    it('Initilise properly when all properties are null',()=>{
        const wrapper = shallow(<TimeLine  />);
        expect(wrapper.find('.timeLine')).toBeDefined();
        expect(wrapper.find('.timeLine-main')).toBeDefined();
    })

    it('Initialise on Size',()=>{
        let itemheight=30;
        let dayWidth=20;
        let data=[{name: `Task Today`,start:new Date(),end:new Date().setDate(new Date().getDate(),5) ,color:'red'}]
        let onNeedData=(start,end)=>{return data}
        const wrapper =shallow(<TimeLine data={data}  
                                            itemheight={itemheight} 
                                            dayWidth={dayWidth}
                                            onNeedData={onNeedData}/>);
        //This needs to be improve
        expect(wrapper.state().currentday).toBe(0);
        expect(wrapper.state().nowposition).toBe(0);
        expect(wrapper.state().startRow).toBe(0);
        expect(wrapper.state().endRow).toBe(30);
        expect(wrapper.state().scrollLeft).toBe(0);
        expect(wrapper.state().numVisibleRows).toBe(30);
        expect(wrapper.state().numVisibleDays).toBe(60);
        expect(wrapper.instance().initialise).toBe(false)
        wrapper.instance().onSize({width:500,height:500})
        expect(wrapper.instance().initialise).toBe(true)
        expect(wrapper.state().startRow).toBe(0);
        expect(wrapper.state().numVisibleRows).toBe(Math.ceil(500/itemheight));
        expect(wrapper.state().numVisibleDays).toBe(Math.ceil(500/dayWidth)+BUFFER_DAYS);
        expect(wrapper.instance().pxToScroll).toBe((1-(500/DATA_CONTAINER_WIDTH)) * DATA_CONTAINER_WIDTH-1);
        wrapper.instance().onSize({width:500,height:10})
        expect(wrapper.state().numVisibleRows).toBe(Math.ceil(10 / itemheight));
        expect(wrapper.state().endRow).toBe(30);
    
    })    
})

describe('TimeLine Scroll left ', function () {
    it('Initilise properly when all properties are null',()=>{
        const wrapper = shallow(<TimeLine  />);
        expect(wrapper.find('.timeLine')).toBeDefined();
        expect(wrapper.find('.timeLine-main')).toBeDefined();
    })

    it('Render and handle mouse move right and Right',()=>{
        let itemheight=30;
        let dayWidth=20;
        let data=[{name: `Task Today`,start:new Date(),end:new Date().setDate(new Date().getDate(),5) ,color:'red'}]
        let onNeedData=(start,end)=>{return data}
        const wrapper =mount(<TimeLine data={data}  
                                            itemheight={itemheight} 
                                            dayWidth={dayWidth}
                                            onNeedData={onNeedData}/>);
        wrapper.instance().onSize({width:500,height:500})
        expect(wrapper.state().nowposition).toBe(0);
        expect(wrapper.state().scrollLeft).toBe(0);
        wrapper.instance().doMouseDown({clientX:0})
        wrapper.instance().doMouseMove({clientX:-10})
        expect(wrapper.state().nowposition).toBe(0);
        expect(wrapper.state().scrollLeft).toBe(10);
        wrapper.instance().doMouseMove({clientX:-20})
        expect(wrapper.state().nowposition).toBe(0);
        expect(wrapper.state().scrollLeft).toBe(20);
        wrapper.instance().doMouseMove({clientX:-5000})
        expect(wrapper.state().nowposition).toBe(-4999);
        expect(wrapper.state().scrollLeft).toBe(0);
        wrapper.instance().doMouseMove({clientX:10})
        expect(wrapper.state().nowposition).toBe(0);
        expect(wrapper.state().scrollLeft).toBe(4999);
        wrapper.instance().doMouseMove({clientX:5020})
        expect(wrapper.state().nowposition).toBe(4999);
        expect(wrapper.state().scrollLeft).toBe(4999)
        wrapper.instance().doMouseMove({clientX:5030})
        expect(wrapper.state().nowposition).toBe(4999);
        expect(wrapper.state().scrollLeft).toBe(4989)
        wrapper.unmount();
    })    
})


describe('TimeLine Scroll Up ', function () {
    it('Calculate Num of visible rows properly',()=>{
        let itemheight=30;
        let dayWidth=20;
        let data=[]
        for(let i=0;i<20;i++){
            data.push({name: `Task Today`,start:new Date(),end:new Date().setDate(new Date().getDate(),5) ,color:'red'})
        }
        let onNeedData=(start,end)=>{return data}
        const wrapper =shallow(<TimeLine data={data}  
                                            itemheight={itemheight} 
                                            dayWidth={dayWidth}
                                            onNeedData={onNeedData}/>);
        wrapper.instance().onSize({width:500,height:500})
        expect(wrapper.state().nowposition).toBe(0);
        expect(wrapper.state().scrollTop).toBe(0);
        expect(wrapper.state().startRow).toBe(0);
        expect(wrapper.state().endRow).toBe(30);
        let numVisibleRows=Math.ceil(500/itemheight)
        expect(wrapper.state().numVisibleRows).toBe(numVisibleRows);
        //Test moving 10
        wrapper.instance().verticalChange(10)
        expect(wrapper.state().scrollTop).toBe(10);
        expect(wrapper.state().startRow).toBe(0);
        expect(wrapper.state().endRow).toBe(numVisibleRows);
        //Tes send same scroll
        expect(wrapper.state().scrollTop).toBe(10);
        expect(wrapper.state().startRow).toBe(0);
        expect(wrapper.state().endRow).toBe(numVisibleRows);
        wrapper.instance().verticalChange(31)
        expect(wrapper.state().scrollTop).toBe(31);
        expect(wrapper.state().startRow).toBe(1);
        expect(wrapper.state().endRow).toBe(numVisibleRows+1);
        wrapper.instance().verticalChange(61)
        expect(wrapper.state().scrollTop).toBe(61);
        expect(wrapper.state().startRow).toBe(2);
        expect(wrapper.state().endRow).toBe(numVisibleRows+2);
        wrapper.instance().verticalChange(451)
        expect(wrapper.state().scrollTop).toBe(451);
        expect(wrapper.state().startRow).toBe(15);
        expect(wrapper.state().endRow).toBe(numVisibleRows+2);
        wrapper.instance().verticalChange(481)
        expect(wrapper.state().scrollTop).toBe(481);
        expect(wrapper.state().startRow).toBe(16);
        expect(wrapper.state().endRow).toBe(numVisibleRows+2);
        wrapper.unmount();
    })    
})

describe('Testing onTaskListSizing ', function () {
    it('recalculate width properly whe moving vertical Bar',()=>{
        let itemheight=30;
        let dayWidth=20;
        let data=[]
        for(let i=0;i<20;i++){
            data.push({name: `Task Today`,start:new Date(),end:new Date().setDate(new Date().getDate(),5) ,color:'red'})
        }
        let onNeedData=(start,end)=>{return data}
        const wrapper =shallow(<TimeLine data={data}  
                                            itemheight={itemheight} 
                                            dayWidth={dayWidth}
                                            onNeedData={onNeedData}/>);
        wrapper.instance().onSize({width:500,height:500})
        expect(wrapper.state().sideStyle.width).toBe(200);
        wrapper.instance().onTaskListSizing(10)
        expect(wrapper.state().sideStyle.width).toBe(190);
        wrapper.instance().onTaskListSizing(-20)
        expect(wrapper.state().sideStyle.width).toBe(210);
        
    })    
})
