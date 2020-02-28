import React from 'react';
import { Link } from 'react-router-dom';

import withStore from '~/hocs/withStore';

import { routesMap } from '~/routes';

class Result extends React.Component{
    
    render(){
        let order = this.props.stores.order.lastOrderCache;
        console.log(order);
        return (
            <div>
                <h2>Congratulations!</h2>
                <p>Hi, {order.user.name}!</p>
                <p><strong>Total: {order.total}</strong></p>
                <div>
                    <Link to={routesMap.home}>Go to home</Link>
                </div>
            </div>
        )
    }
}

export default withStore(Result);