import React, { Component, Fragment } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import EditorContainer from "../../editor/components/EditorContainer";
import SingleInputModal from "./SingleInputModal";
import { ToastContainer, toast } from 'react-toastify';
import { withRouter } from "react-router-dom";
import { DATASET } from "../config/constants";
// import { isEqual } from "../config/helper";
// import { Value } from 'slate';
import { InitialData } from "../../editor/plugins/InitialData";
import _ from "lodash";

class HomeComponent extends Component {
    state = {
        isShownSidebar: false,
        isShownSaveModal: false,
        wordIsInLimit: true,
        article: {}
    }

    componentDidMount(){
        // console.log("home mounted", Date.now())
        this.findSavedData();
    }

    componentDidUpdate(prevProps){
        // this.findSavedData();
        if (
            prevProps.location &&
            prevProps.location.state !== "new" &&
            this.props.location &&
            this.props.location.state === "new"
            // !isEqual(article, this.state.article)
        ){
            let article = { data: InitialData }
            this.setState({ article })
        } if(
            prevProps.location &&
            prevProps.location.state === "new" &&
            !_.isEmpty(this.findDataFromId(this.findIdFromUrl()))
        ){
            this.findSavedData()
        } 
    }

    findSavedData = id => {
        let articleId = id ? id : this.findIdFromUrl(),
            article = {};

        if(
            articleId &&
            !_.isEmpty(this.findDataFromId(articleId))
        ){
            article = {...this.findDataFromId(articleId)};
            // article.data = Value.fromJSON(article.data);
        } else {
            article = { data: InitialData }
        }

        console.log("findSavedData", article, !_.isEqual(article, this.state.article))

        if(!_.isEqual(article, this.state.article)){
            this.setState({ article })
        }
    }

    toggleSaveModal = event => {
        if(event) event.stopPropagation()
        if(
            this.state.article.id &&
            this.state.article.title &&
            this.state.article.data
        ) {
            this.saveDataToExisting(this.state.article.data, this.state.article.title, this.state.article.id)
        } else if (this.state.wordIsInLimit) {
            this.setState({ isShownSaveModal: !this.state.isShownSaveModal })
        }
    }

    toggleSidebar = event => {
        event.stopPropagation()
        this.setState({ isShownSidebar: !this.state.isShownSidebar })
    }

    closeSidebar = event => {
        event.stopPropagation()
        this.setState({ isShownSidebar: false });
    }

    // check whether it's new article or existing article
    findOrSaveData = value => {
        this.toggleSaveModal()

        // if no data saved in the state, return
        if(this.state.article && !this.state.article.data) return;

        let articleId = this.findIdFromUrl(),
            article = {};
        
        // check if ID is in existing data array
        if(articleId) article = this.findDataFromId(articleId)

        if(
            article.id &&
            article.title &&
            this.state.article.data
        ){
            this.saveDataToExisting(this.state.article.data,article.title,article.id)
        }
        else this.saveNewData(this.state.article.data,value)
    }

    processDataWithIdAndTitle = (data,title,id=Date.now()) => {
        let processedData = {};

        if(data) processedData.data = data
        if(title) processedData.title = title
        if(id) processedData.id = id

        return processedData
    }

    findIdFromUrl = () => {
        if(
            this.props.location &&
            this.props.location.state &&
            this.props.location.state.id
        ){
            return this.props.location.state.id;
        } 

        return false;
    }

    // save a new article
    saveNewData = (articleData,title) => {
        let dataset = [], 
            article = this.processDataWithIdAndTitle(articleData,title);

        if(localStorage.getItem(DATASET)){
            dataset = [...JSON.parse(localStorage.getItem(DATASET))]
        }

        console.log("saveNewData", dataset, article)

        dataset = [...dataset,article]
        this.submitDataAndLoadWithURLParams(dataset,article.id)
    }

    // load url with params after save
    submitDataAndLoadWithURLParams = (dataset,articleId) => {
        localStorage.setItem(DATASET, JSON.stringify(dataset))
        toast.success("Saved successfully!")
        this.props.history.push({
            pathname: "/",
            state: {
                id: articleId
            }
        })
        this.findSavedData(articleId)
    }

    // save changes to existing article
    saveDataToExisting = (data,title,id) => {
        let dataset = [], index;

        if(localStorage.getItem(DATASET)){
            dataset = [...JSON.parse(localStorage.getItem(DATASET))]
        }

        index = dataset.findIndex(data => {
            return data.id === id
        })

        if(
            index > -1 && 
            dataset[index] && 
            dataset[index].data
        ){
            let article = this.processDataWithIdAndTitle(data,title,id)
            dataset[index] = article;
            this.submitDataAndLoadWithURLParams(dataset,id)
        } 
    }

    // find ID from existing data
    findDataFromId = id => {
        let data = {}, dataset = [];

        if(localStorage.getItem(DATASET)){
            dataset = JSON.parse(localStorage.getItem(DATASET))
        }

        if(id && dataset.length){
            dataset.forEach(dt => {
                if(dt.id === id) data = dt;
            })
        }

        return data;
    }

    // check whether word is in limit
    checkWordIsInLimit = (wordCount,limit) => {
        let wordIsInLimit = true;
        if(limit && wordCount && wordCount > limit) wordIsInLimit = false;
        if(wordIsInLimit !== this.state.wordIsInLimit) this.setState({ wordIsInLimit })
    }

    // save current changes to state
    saveTextToState = value => {
        let article = {...this.state.article};
        article.data = value;
        this.setState({ article })
    }

    render(){
        const { isShownSidebar, isShownSaveModal, wordIsInLimit, article } = this.state;
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
                    article={article}
                    isShownSidebar={isShownSidebar} 
                    onClickItem={this.findSavedData}
                    closeSidebar={this.closeSidebar}/>
                <EditorContainer
                    {...this.props}
                    initialValue={article}
                    wordIsInLimit={this.checkWordIsInLimit}
                    onChangeText={this.saveTextToState}
                />
                <SingleInputModal 
                    modalHeader="Pick a title"
                    placeholder="Enter title"
                    onSave={value => this.findOrSaveData(value)}
                    isActive={isShownSaveModal} 
                    onClose={this.toggleSaveModal}/>
                <ToastContainer/>
            </Fragment>
        )
    }
}

export default withRouter(HomeComponent)