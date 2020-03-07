import React from 'react';
import {Icon} from 'antd';

const Loading = props => {
    return (
        <div className="loading container">
            <Icon type='loading'/>
        </div>
    );
};

Loading.propTypes = {};

export default Loading;