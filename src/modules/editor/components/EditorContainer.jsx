import React, { Component } from "react";
import EditorComponent from "./EditorComponent";
import { BlockCounter, MarkHotkey } from "../plugins/EditorPlugins"
// import { isEqual } from "../../core/config/helper";
// import { InitialData } from "../plugins/InitialData";
// import { Value } from 'slate';

export default class EditorContainer extends Component {
    state = {
        blockLimit: 0,
        blockCount: 0,
        plugins: [],
        editorComponent: ""
    }

    componentDidMount(){
        this.updatePlugins()
    }

    updatePlugins = () => {
        this.setState({
            plugins: [
                MarkHotkey({ key: 'b', type: 'bold' }),
                MarkHotkey({ key: '`', type: 'code' }),
                MarkHotkey({ key: 'i', type: 'italic' }),
                MarkHotkey({ key: '~', type: 'strikethrough' }),
                MarkHotkey({ key: 'u', type: 'underline' }),
                BlockCounter({ 
                    limit: this.state.blockLimit, 
                    onChangeCounter: this.onChangeBlockCounter,
                    blockCount: this.state.blockCount
                })
            ]
        }, this.props.wordIsInLimit(this.state.blockCount,this.state.blockLimit))
    }

    handleChangeBlockLimit = event => {
        if(event.target.value >= 0) {
            this.setState({ blockLimit: parseInt(event.target.value) }, () => this.updatePlugins())
        }
    }

    onChangeBlockCounter = count => {
        if(count && count !== this.state.blockCount) {
            this.setState({ blockCount: count }, () => this.updatePlugins())
        }
    }

    render(){
        const { blockCount, blockLimit, plugins } = this.state;
        console.log("EditorContainer", this.props);
        // const initData = {data: Value.fromJSON(InitialData)}

        return(
            <div className="main-container">
                <div className="editor-container shadow">
                    {
                        this.props.initialValue && this.props.initialValue.data ?
                        <EditorComponent 
                            {...this.props}
                            plugins={plugins}
                            // initialValue={this.props.initialValue}
                            blockCount={blockCount}
                            onChangeBlockCounter={this.onChangeBlockCounter}
                            // onChangeText={value => this.props.onChangeText(value)}
                            blockLimit={blockLimit}
                            handleChangeBlockLimit={e => this.handleChangeBlockLimit(e)}
                            /> : ""
                    }
                </div>
            </div>
        )
    }
}