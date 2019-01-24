import React, { Component, Fragment } from "react";
import { Editor } from 'slate-react';
import { Value, Block } from 'slate';
import EditorToolbar from "./EditorToolbar";
import { toast } from 'react-toastify';
import SingleInputModal from "../../core/components/SingleInputModal";

const existingValue = JSON.parse(localStorage.getItem('content'))
const initialValue = Value.fromJSON(
    existingValue || {
        document: {
            nodes: [
                {
                    object: 'block',
                    type: 'paragraph',
                    nodes: [
                        {
                            object: 'text',
                            leaves: [
                                {
                                    text: 'A line of text in a paragraph.',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    }
)

const DEFAULT_NODE = 'paragraph';

const schema = {
    document: {
        last: { type: 'paragraph' },
        normalize: (editor, { code, node }) => {
            if(code === "last_child_type_invalid"){
                return editor.insertNodeByKey(node.key, node.nodes.size, Block.create(DEFAULT_NODE));
            }
        }
    },
    blocks: {
        image: {
            isVoid: true
        }
    }
};

const MarkHotkey = options => {
    const { type, key } = options

    // Return our "plugin" object, containing the `onKeyDown` handler.
        return {
        onKeyDown(event, editor, next) {
            // If it doesn't match our `key`, let other plugins handle it.
            if (!event.ctrlKey || event.key !== key) return next()

            // Prevent the default characters from being inserted.
            event.preventDefault()

            // Toggle the mark `type`.
            editor.toggleMark(type)
        },
    }
}

const insertImage = (editor, src, target) => {
    if (target) editor.select(target);

    editor.insertBlock({
        type: 'image',
        data: { src }
    });
}

// Create an array of plugins.
const plugins = [
    MarkHotkey({ key: 'b', type: 'bold' }),
    MarkHotkey({ key: '`', type: 'code' }),
    MarkHotkey({ key: 'i', type: 'italic' }),
    MarkHotkey({ key: '~', type: 'strikethrough' }),
    MarkHotkey({ key: 'u', type: 'underline' }),
]

const getBase64Data = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    const allowedFileTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif'
    ];
    if (!allowedFileTypes.includes(file.type)) {
        toast.error('Please upload a .jpg, .png & .gif file!');
        return;
    }
    // check if file size is less than 2 MB
    if(file.size && file.size > 2097152){
        toast.warn('File is too large! Please upload an image file of less than 2MB');
        return;
    }
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
});




export default class EditorComponent extends Component {
    state = {
        value: initialValue,
        isShownImageUrlModal: false
    }

    onChange = ({ value }) => {
        if (value.document !== this.state.value.document) {
            const content = JSON.stringify(value.toJSON())
            localStorage.setItem('content', content)
        }
    
        this.setState({ value })
    }

    openImageUrlModal = () => this.setState({ isShownImageUrlModal: true })

    closeImageUrlModal = () => this.setState({ isShownImageUrlModal: false })

    onKeyDown = (event, editor, next) => {
        if(!this.hasBlock("list-item")) return next();
        console.log("evev", event.shiftKey)

        // if shift + Tab key pressed in a list
        if(event.shiftKey && event.key === 'Tab') this.downTabIndentLevel(event, editor, next)
        // or only Tab key pressed in a list
        else if(!event.shiftKey && event.key === 'Tab') this.upTabIndentLevel(event, editor, next)

        return next();
    }

    hasBlock = type => this.state.value.blocks.some((node) => node.type === type);

    upTabIndentLevel = (event, editor, next) => {
        event.preventDefault();
        const block = editor.value.blocks.first();
        const parent = block ? editor.value.document.getParent(block.key) : null;
        const type = !parent.type ? 'bulleted-list' : parent.type;
    
        // check if it's in last level
        const depth = editor.value.document.getDepth(block.key);
        if (depth > 3) {
            event.preventDefault();
            return next();
        }
    
        if (parent) {
            editor.setBlocks('list-item').wrapBlock(type);
        }
    }

    downTabIndentLevel = (event, editor, next) => {
        event.preventDefault();
    
        const block = editor.value.blocks.first();
        const parent = block ? editor.value.document.getParent(block.key) : null;
        
        const firstBlockDepth = block && editor.value.document.getDepth(block.key);
        let multiLevelSelected = false;
    
        editor.value.blocks.map(currentKey => {
            const currentDepth = editor.value.document.getDepth(currentKey.key);
            multiLevelSelected = !!(firstBlockDepth !== currentDepth);
            return true;
        });
    
        // if multi level list items are selected, then return
        if (multiLevelSelected) return next();
    
        // if first level list-items selected then, make paragraph
        if (parent && typeof parent.type === 'undefined') {
            editor
            .setBlocks(DEFAULT_NODE)
            .unwrapBlock('bulleted-list')
            .unwrapBlock('numbered-list');
            return next();
        }
        const depth = editor.value.document.getDepth(block.key);
    
        const isActive =
            this.hasBlock('list-item') && block &&
            (parent.type === 'numbered-list' || parent.type === 'bulleted-list');
    
        const onlyList = this.hasBlock('list-item');
    
        if (isActive) {
            editor
            .setBlocks('list-item')
            .unwrapBlock('bulleted-list')
            .unwrapBlock('numbered-list');
        } else if (isActive && depth <= 2) {
            editor
            .setBlocks(DEFAULT_NODE)
            .unwrapBlock('bulleted-list')
            .unwrapBlock('numbered-list');
        } else {
            editor
            .setBlocks(DEFAULT_NODE)
            .unwrapBlock('bulleted-list')
            .unwrapBlock('numbered-list');
        }
        // if list item is without parent
        if (onlyList && depth <= 2) {
            editor
            .setBlocks(DEFAULT_NODE)
            .unwrapBlock('list-item')
            .unwrapBlock('bulleted-list')
            .unwrapBlock('numbered-list');
        }
    }

    insertImageFromUrl = value => {
        this.closeImageUrlModal();
        setTimeout(() => {
            this.editor.focus()
            this.editor.command(insertImage, value);
        }, 1)
    }

    toggleMark = (event,type) => {
        event.preventDefault();
        this.editor.toggleMark(type);
    }

    toggleBlock = (event,type) => {
        event.preventDefault();

        // insert image from a url
        if (type === 'image') this.openImageUrlModal()
        
        // insert image from file browser
        if (type === 'imageBrowser') {
            getBase64Data(event.currentTarget.files[0]).then((imageData) => {
                this.editor.command(insertImage, imageData);
            });
        }
    
        // list types
        if (type !== 'bulleted-list' && type !== 'numbered-list') {
            const isActive = this.hasBlock(type)
            const isList = this.hasBlock('list-item')
    
            if (isList) {
                this.editor
                .setBlocks(isActive ? DEFAULT_NODE : type)
                .unwrapBlock('bulleted-list')
                .unwrapBlock('numbered-list');
            } else {
                this.editor.setBlocks(isActive ? DEFAULT_NODE : type);
            }
        } else {
            const isList = this.hasBlock('list-item');
            const isType = this.editor.value.blocks.some(block =>
                !!this.editor.value.document.getClosest(block.key, (parent) => parent.type === type)
            )
    
            if (isList && isType) {
                this.editor.setBlocks(DEFAULT_NODE)
                .unwrapBlock('bulleted-list')
                .unwrapBlock('numbered-list')
            } else if (isList) {
                this.editor
                .unwrapBlock(type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list')
                .wrapBlock(type);
            } else {
                this.editor.setBlocks('list-item').wrapBlock(type);
            }
        }
    }

    renderMark = (props, editor, next) => {
        let { mark, attributes, children } = props;
        switch (mark.type) {
            case "bold":
                return <strong {...attributes}>{children}</strong>
            case "italic":
                return <em {...attributes}>{children}</em>
            case "strikethrough":
                return <del {...attributes}>{children}</del>
            case "code":
                return <code>{children}</code>
            case "underline":
                return <u {...attributes}>{children}</u>
            default:
                return next()
        }
    }

    renderNode = (props, editor, next) => {
        let { node, attributes, children } = props;
        switch (node.type) {
            case "heading-one":
                return <h1 {...attributes}>{children}</h1>
            case "heading-two":
                return <h2 {...attributes}>{children}</h2>
            case "paragraph":
                return <p {...attributes}>{children}</p>
            case "blockquote":
                return <blockquote {...attributes} className="quote">{children}</blockquote>
            case "bulleted-list":
                return <ul {...attributes}>{children}</ul>
            case "numbered-list":
                return <ol {...attributes}>{children}</ol>
            case "list-item":
                return <li {...attributes}>{children}</li>
            case "code":
                return <pre {...attributes}><code>{children}</code></pre>
            case "image":
                return <img src={node.data.get("src")} alt={`image_${Date.now()}`} {...attributes} />
            default:
                return next()
        }
    }

    render(){
        return(
            <Fragment>
                <EditorToolbar 
                    toggleBlock={this.toggleBlock}
                    toggleMark={this.toggleMark}/>
                <Editor 
                    ref={node => this.editor = node}
                    plugins={plugins}
                    autoFocus={true}
                    className="editor-field"
                    value={this.state.value} 
                    onKeyDown={this.onKeyDown}
                    renderMark={this.renderMark}
                    renderNode={this.renderNode}
                    schema={schema}
                    onChange={this.onChange} />
                {
                    this.state.isShownImageUrlModal ?
                        <SingleInputModal
                            modalHeader="Insert image from URL"
                            placeholder="Enter url"
                            onSave={value => this.insertImageFromUrl(value)}
                            isActive={this.state.isShownImageUrlModal} 
                            onClose={this.closeImageUrlModal}
                        /> : ""
                }
            </Fragment>
            
        )
    }
}