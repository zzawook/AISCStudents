import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

function Modal({
    className,
    onClose,
    maskClosable,
    closable,
    visible,
    children,
}) {
    const onMaskClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose(e)
        }
    }

    const close = (e) => {
        if (onClose) {
            onClose(e)
        }
    }

    const closeButtonStyle = {
        position: 'absolute',
        top: '20px',
        left: '20px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#4742A8',
        color: 'white',
        padding: '10px'
    }
    return (
        <>
            <ModalOverlay visible={visible} />
            <ModalWrapper
                className={className}
                onClick={maskClosable ? onMaskClick : null}
                tabIndex="-1"
                visible={visible}
            >
                <ModalInner tabIndex="0" className="modal-inner">
                    {closable && <button className="modal-close" style={closeButtonStyle} onClick={close}>Close</button>}
                    {children}
                </ModalInner>
            </ModalWrapper>
        </>
    )
}

Modal.propTypes = {
    visible: PropTypes.bool,
}

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

const ModalWrapper = styled.div`
  box-sizing: border-box;
  display: ${(props) => (props.visible ? 'block' : 'none')};
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 12500;
  overflow: auto;
  outline: 0;
  
`

const ModalOverlay = styled.div`
  box-sizing: border-box;
  display: ${(props) => (props.visible ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 12499;
`

const ModalInner = styled.div`
  box-sizing: border-box;
  position: relative;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.5);
  background-color: white;
  border-radius: 10px;
  border: none;
  width: ${windowWidth*0.5}px;
  height: ${(windowHeight*0.9)+35}px;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 auto;
  padding: 1px 20px;
  color: white
`

export default Modal