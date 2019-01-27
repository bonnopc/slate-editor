import React, { Component, Fragment } from "react";
import _ from "lodash";
import { DATASET } from "../config/constants";
import { MdAccessTime, MdAdd } from "react-icons/md";

export default class Sidebar extends Component {
    state = {
        dataset: []
    }

    componentDidMount(){
        this.getAllData()
        document.addEventListener("click", this.handleClickOutside)
    }

    componentDidUpdate(prevProps){
        if(
            this.props.article &&
            !_.isEqual(this.props.article.id,prevProps.article.id)
        ){
            this.getAllData()
        }
    }

    componentWillUnmount(){
        document.removeEventListener("click", this.handleClickOutside)
    }

    getAllData = () => {
        if(localStorage.getItem(DATASET)){
            this.setState({ dataset: [...JSON.parse(localStorage.getItem(DATASET))] });
        }
    }

    handleClickOutside = event => {
        event.stopPropagation();
        if(
            this.props.isShownSidebar && 
            this.OutSidebarRef &&
            this.OutSidebarRef.contains(event.target)
        ){
            this.props.closeSidebar(event)
        }
    }

    selectItem = (id,event) => {
        this.props.onClickItem(id)
        this.props.closeSidebar(event)
    }

    render(){
        const { isShownSidebar, article } = this.props, { dataset } = this.state
        console.log("Sidebar", this.props, "state", this.state)
        return(
            <Fragment>
                {/* sidebar backdrop */}
                {
                    isShownSidebar ?
                    <div 
                        className="backdrop" 
                        style={{ zIndex: 1 }}
                        ref={node => this.OutSidebarRef = node}/> : ""
                }

                {/* content */}
                <div 
                    className={`sidebar shadow ${isShownSidebar ? "show" : ""}`} 
                    ref={node => this.InSidebarRef = node}>
                    {
                        dataset.length ?
                        dataset.map(data => (
                            <div 
                                key={data.id}
                                onClick={e => this.selectItem(data.id,e)}
                                className={`sidebar-item ${article && article.id === data.id ? "active" : ""}`}>
                                <div className="title text-truncate">{data.title}</div>
                                <div className="sub-title text-truncate">
                                    <MdAccessTime/> {new Date(data.id).toLocaleString()}
                                </div>
                            </div>
                        )) :
                        <div className="mt-4 text-center">
                            No Data found
                            <div className="sidebar-item" onClick={e => this.selectItem("new",e)}>
                                <MdAdd className="mb-1"/> Create new
                            </div>
                        </div>
                    }
                </div>
            </Fragment>
            
        )
    }
}