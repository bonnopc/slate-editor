import React, { Component } from "react";
import EditorComponent from "./EditorComponent";

// const existingValue = JSON.parse(localStorage.getItem('content'))

export default class EditorContainer extends Component {
    render(){
        return(
            <div className="main-container">
                <div className="editor-container shadow">
                    <EditorComponent/>
                </div>
            </div>
        )
    }
}