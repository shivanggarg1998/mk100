import React from 'react';
import { Modal, Input , Icon } from 'antd';
import {withApollo} from 'react-apollo'

class ApprovalDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            yesModal: false,
            noModal: false,
            comment: ''
        }
    }

    handleOkYesModal = (e) => {
        this.props.handleApproval(this.state, this.props.client);
        this.setState({yesModal: false})
    }

    handleOkNoModal = (e) => {
        this.props.handleApproval(this.state , this.props.client);
        this.setState({noModal: false})
    }

    handleCancelYesModal = (e) => {
        this.setState({
            yesModal: false,
            comment: ''
        });
    }

    handleCancelNoModal = (e) => {
        this.setState({
            noModal: false,
            comment: ''
        });
    }
    

    render() {
        return (
            <div>
                <div style={{display: 'inline'}} onClick={() => this.setState(prevState => ({yesModal: !prevState.yesModal}))}>
                    <Icon type='check'/>
                </div>
                &nbsp;&nbsp;
                <div style={{display: 'inline'}} onClick={() => this.setState(prevState => ({noModal: !prevState.noModal}))}>
                    <Icon type='close'/>
                </div>
                <Modal 
                    visible={this.state.yesModal}
                    onCancel={this.handleCancelYesModal}
                    onOk={this.handleOkYesModal}
                >
                    <p>Do you approve?</p>
                    <Input 
                        type="text" 
                        placeholder="Leave a comment"
                        onChange={(e) => this.setState({comment: e.target.value})}
                    />
                </Modal>

                <Modal 
                    visible={this.state.noModal}
                    onCancel={this.handleCancelNoModal}
                    onOk={this.handleOkNoModal}
                >
                    <p>You don't approve?</p>
                    <Input 
                        type="text" 
                        placeholder="Leave a comment"
                        onChange={(e) => this.setState({comment: e.target.value})}
                    />
                </Modal>
            </div>
        )
    }
}

export default withApollo(ApprovalDialog);