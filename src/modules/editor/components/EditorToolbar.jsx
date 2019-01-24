import React, { Component } from "react";
import { 
    MdFormatBold, MdFormatItalic, MdFormatUnderlined, MdCode, MdLooksOne,
    MdLooksTwo, MdFormatQuote, MdFormatListNumbered, MdFormatListBulleted,
    MdFormatStrikethrough, MdFileUpload, MdImage
} from "react-icons/md";

export default class EditorToolbar extends Component {
    render(){
        const { toggleMark, toggleBlock } = this.props;
        return(
            <div className="editor-toolbar">
                <button 
                    title="Bold"
                    className="tool cursor-pointer" 
                    onPointerDown={e => toggleMark(e,"bold")}>
                    <MdFormatBold/>
                </button>
                <button 
                    title="Italic"
                    className="tool cursor-pointer" 
                    onPointerDown={e => toggleMark(e,"italic")}>
                    <MdFormatItalic/>
                </button>
                <button 
                    title="Underline"
                    className="tool cursor-pointer" 
                    onPointerDown={e => toggleMark(e,"underline")}>
                    <MdFormatUnderlined/>
                </button>
                <button 
                    title="Strikethrough"
                    className="tool cursor-pointer" 
                    onPointerDown={e => toggleMark(e,"strikethrough")}>
                    <MdFormatStrikethrough/>
                </button>
                <button 
                    title="Code"
                    className="tool cursor-pointer" 
                    onPointerDown={e => toggleBlock(e,"code")}>
                    <MdCode/>
                </button>
                <button 
                    title="Heading 1"
                    className="tool cursor-pointer" 
                    onPointerDown={e => toggleBlock(e,"heading-one")}>
                    <MdLooksOne/>
                </button>
                <button 
                    title="Heading 2"
                    className="tool cursor-pointer" 
                    onPointerDown={e => toggleBlock(e,"heading-two")}>
                    <MdLooksTwo/>
                </button>
                <button 
                    title="Blockquote"
                    className="tool cursor-pointer" 
                    onPointerDown={e => toggleBlock(e,"blockquote")}>
                    <MdFormatQuote/>
                </button>
                <button 
                    title="Numbered list"
                    className="tool cursor-pointer" 
                    onPointerDown={e => toggleBlock(e,"numbered-list")}>
                    <MdFormatListNumbered/>
                </button>
                <button 
                    title="Bulleted list"
                    className="tool cursor-pointer" 
                    onPointerDown={e => toggleBlock(e,"bulleted-list")}>
                    <MdFormatListBulleted/>
                </button>
                <button title="Upload Image" className="tool cursor-pointer">
                    <input
                        type="file"
                        className="file-input cursor-pointer"
                        onChange={e => toggleBlock(e,"imageBrowser")}
                    />
                    <MdFileUpload/>
                </button>
                <button 
                    title="Image from url"
                    className="tool cursor-pointer" onPointerDown={e => toggleBlock(e,"image")}>
                    
                    <MdImage/>
                </button>
            </div>
        )
    }
}