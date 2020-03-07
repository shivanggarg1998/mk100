import React from 'react';
import LoginForm from './Login';

export default class LoginPage extends React.Component {
    render() {
        return (
            <div>
                <div className="header">
                    <div className="header__brand">
                        <img src="http://pngimg.com/uploads/microsoft/microsoft_PNG10.png" alt="Logo"/>
                    </div>
                </div>
                <div className="container_80">
                    <LoginForm />
                </div>
            </div>
        )
    }
}