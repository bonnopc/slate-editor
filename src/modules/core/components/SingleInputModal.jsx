import React, { Component } from "react";
import { Modal, ModalContent } from "./Modal";

export default class SingleInputModal extends Component {
    state = {
        value: "",
        valueValidity: true
    }

    componentDidMount(){
        if(this.inputRef) {
            console.log("yes")
            setTimeout(() => this.inputRef.focus(), 100);
        }
    }

    save = event => {
        event.preventDefault();
        if(this.checkValidity()) {
            this.props.onSave(this.state.value)
            this.setState({ value: "" })
        }
        else this.setState({ valueValidity: false })
    }

    checkValidity = () => {
        if(this.state.value) return true;
        return false;
    }

    handleChange = event => {
        this.setState({ value: event.target.value, valueValidity: true })
    }

    render(){
        const { isActive, onClose, modalHeader, placeholder } = this.props;
        return(
            <Modal isActive={isActive} onClose={onClose}>
                <ModalContent>
                    {
                        modalHeader ?
                        <h5>Pick a name</h5> : ""
                    }
                    <form 
                        noValidate
                        onSubmit={e => this.save(e)} 
                        className={`needs-validation ${this.state.valueValidity ? "" : "was-validated"}`}>

                        {/* -- value input -- */}
                        <input 
                            ref={node => this.inputRef = node}
                            className={`form-control ${this.state.valueValidity ? "" : "invalid"}`}
                            placeholder={placeholder ? placeholder : ""}
                            value={this.state.value}
                            required
                            autoFocus={true}
                            onChange={e => this.handleChange(e)}
                            type="text"/>

                        <div className="invalid-feedback">
                            This is a required field
                        </div>

                        {/* action buttons */}
                        <div className="action-buttons">
                            <button type="button" onClick={e => onClose(e)} className="btn btn-sm btn-light">
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                onClick={e => this.save(e)}
                                className="btn btn-sm btn-primary">
                                Save
                            </button>
                        </div>
                    </form>
                </ModalContent>
            </Modal>
        )
    }
}