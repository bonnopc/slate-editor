import React, { Component, Fragment } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import EditorContainer from "../../editor/components/EditorContainer";
import SingleInputModal from "./SingleInputModal";
import { ToastContainer } from 'react-toastify';

export default class HomeComponent extends Component {
    state = {
        isShownSidebar: false,
        isShownSaveModal: false
    }

    toggleSaveModal = event => {
        event.stopPropagation()
        console.log("tt", this.state.isShownSaveModal)
        this.setState({ isShownSaveModal: !this.state.isShownSaveModal })
    }

    toggleSidebar = event => {
        event.stopPropagation()
        this.setState({ isShownSidebar: !this.state.isShownSidebar })
    }

    closeSidebar = event => {
        event.stopPropagation()
        this.setState({ isShownSidebar: false });
    }

    saveData = event => {
        event.preventDefault();

    }

    render(){
        const { isShownSidebar, isShownSaveModal } = this.state;
        console.log("HomeComponent", this.state);
        return(
            <Fragment>
                <Navbar 
                    save={this.saveData}
                    toggleSidebar={this.toggleSidebar} 
                    closeSidebar={this.closeSidebar}/>
                <Sidebar 
                    isShownSidebar={isShownSidebar} 
                    closeSidebar={this.closeSidebar}/>
                <EditorContainer/>
                <SingleInputModal 
                    modalHeader="Pick a name"
                    placeholder="Enter name"
                    onSave={value => console.log("submitted", value)}
                    isActive={isShownSaveModal} 
                    onClose={this.toggleSaveModal}/>
                <ToastContainer/>
            </Fragment>
        )
    }
}