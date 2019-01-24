import React, { Component, Fragment } from "react";

export default class Sidebar extends Component {
    componentDidMount(){
        document.addEventListener("click", this.handleClickOutside)
    }

    componentWillUnmount(){
        document.removeEventListener("click", this.handleClickOutside)
    }

    handleClickOutside = event => {
        event.stopPropagation();
        if(
            this.props.isShownSidebar && 
            this.OutSidebarRef &&
            this.OutSidebarRef.contains(event.target)
        ){
            this.props.closeSidebar(event,"side");
        }
    }

    render(){
        const { isShownSidebar } = this.props;

        return(
            <Fragment>
                {
                    isShownSidebar ?
                    <div 
                        className="backdrop" 
                        style={{ zIndex: 1 }}
                        ref={node => this.OutSidebarRef = node}/> : ""
                }
                <div 
                    className={`sidebar shadow ${isShownSidebar ? "show" : ""}`} 
                    ref={node => this.InSidebarRef = node}
                >
                    sidebar
                </div>
            </Fragment>
            
        )
    }
}