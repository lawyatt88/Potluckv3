import React from 'react'

const Modal = (props) => {
    const { name, isVisible, icon, body } = props
    return (
        <div>
        {/*<!-- Button trigger modal -->*/}
        {isVisible &&
        <button type="button" className="btn btn-primary" data-toggle="modal" data-target={`#${name}`}>
            {icon}
        </button>
        }

        {/*<!-- Modal -->*/}
        <div className="modal fade" id={name} tabIndex="-1" role="dialog" aria-labelledby={`#${name}Label`} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={`${name}Label`} />
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {body}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal
