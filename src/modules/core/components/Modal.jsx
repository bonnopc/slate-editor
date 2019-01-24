import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

export class Modal extends Component {
    static propTypes = {
        isActive: PropTypes.bool.isRequired,
        onClose: PropTypes.func
    }

    render = () => (
        <Fragment>
            {
                this.props.isActive ?
                    <Fragment>
                        <div className="modal-backdrop" onClick={e => this.props.onClose(e)}/>
                        {this.props.children}
                    </Fragment> : ""
            }
        </Fragment>
    )
}

export class ModalContent extends Component {
    render = () => (
        <div className="modal-content shadow-lg">
            {
                this.props.children instanceof Array ?
                this.props.children.map((child,index) => <Fragment key={index}>{child}</Fragment>) :
                this.props.children
            }
        </div>
    )
}