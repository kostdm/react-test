import React from 'react';

import withStore from '~/hocs/withStore';
import styles from './style.module.css';

class Notify extends React.Component{
    
    notify = this.props.stores.notify;

    render(){
        let messagesList = [];
        
        for (let id in this.notify.messages) {
            let style;
            let item = this.notify.messages[id];

            switch (item.type) {
                case 'warning':
                    style = styles.warning;
                    break;
                default:
                    style = styles.default;
            }

            messagesList.push(
                <div className={styles.message + style} key={id}>
                    {id} - {item.text}
                </div>
            );
        }

        return (
            <div className={styles.messages}>
                {messagesList}
            </div>
        );
    }
}

export default withStore(Notify);