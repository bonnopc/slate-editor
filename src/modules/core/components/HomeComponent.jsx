import React, { Component, Fragment } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import EditorContainer from "../../editor/components/EditorContainer";
import SingleInputModal from "./SingleInputModal";
import { ToastContainer } from 'react-toastify';
import { withRouter } from "react-router-dom";
import { DATASET } from "../config/constants";

class HomeComponent extends Component {
    state = {
        isShownSidebar: false,
        isShownSaveModal: false,
        wordIsInLimit: true,
        article: {}
    }

    componentDidMount(){
        this.findSavedData();
    }

    findSavedData = () => {
        // find route params
        // if yes, get dataset
        // match param with data
        // set to state
        // if()
        if(localStorage.getItem(DATASET)){
            let data = JSON.parse(localStorage.getItem(DATASET))
        }
    }

    toggleSaveModal = event => {
        event.stopPropagation()
        console.log("tt", this.state.isShownSaveModal)
        if(this.state.wordIsInLimit) this.setState({ isShownSaveModal: !this.state.isShownSaveModal })
    }

    toggleSidebar = event => {
        event.stopPropagation()
        this.setState({ isShownSidebar: !this.state.isShownSidebar })
    }

    closeSidebar = event => {
        event.stopPropagation()
        this.setState({ isShownSidebar: false });
    }

    saveDataToStorage = value => {
        // check url params if id exist
        // if not, 
        let articleId = "", article = {};
        if(
            this.props.location &&
            this.props.location.state &&
            this.props.location.state.id
        ){
            let articleId = this.props.location.state.id;
        } 

        if(articleId) article = this.findDataFromId(articleId)

        if(article.id && this.state.article && this.state.article.data){
            article.title = value;
            article.data = this.state.article.data;
        }

    }

    findDataFromId = id => {
        let data = {}, dataset = [];

        if(localStorage.getItem(DATASET)){
            let dataset = JSON.parse(localStorage.getItem(DATASET))
        }

        if(id && dataset.length){
            data = dataset.filter(data => {
                return data.id === id && data
            })
        }

        return data;
    }

    checkWordIsInLimit = (wordCount,limit) => {
        let wordIsInLimit = true;
        if(limit && wordCount && wordCount > limit) wordIsInLimit = false;
        if(wordIsInLimit !== this.state.wordIsInLimit) this.setState({ wordIsInLimit })
    }

    saveText = value => {
        let article = {...this.state.article};
        article.data = value;
        this.setState({ article })
        // localStorage.setItem('content', JSON.stringify(value.toJSON()))
    }

    render(){
        const { isShownSidebar, isShownSaveModal, wordIsInLimit, article } = this.state;
        console.log("HomeComponent", this.props, "state", this.state)
        return(
            <Fragment>
                <Navbar 
                    {...this.props}
                    save={this.saveDataToStorage}
                    toggleSidebar={this.toggleSidebar} 
                    openSaveModal={this.toggleSaveModal}
                    wordIsInLimit={wordIsInLimit}
                    closeSidebar={this.closeSidebar}/>
                <Sidebar 
                    isShownSidebar={isShownSidebar} 
                    closeSidebar={this.closeSidebar}/>
                <EditorContainer
                    initialValue={article}
                    wordIsInLimit={this.checkWordIsInLimit}
                    onChangeText={this.saveText}
                />
                <SingleInputModal 
                    modalHeader="Pick a title"
                    placeholder="Enter title"
                    onSave={value => console.log("submitted", value)}
                    isActive={isShownSaveModal} 
                    onClose={this.toggleSaveModal}/>
                <ToastContainer/>
            </Fragment>
        )
    }
}

export default withRouter(HomeComponent)