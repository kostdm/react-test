import React from 'react';

import AppMinMax from '~c/inputs/minmax';
import LinkButton from '~c/links/button';

import { routesMap } from '~/routes';

import withStore from '~/hocs/withStore';

class Cart extends React.Component{
    render(){
        let cartModel = this.props.stores.cart;

        let productsRows = cartModel.productsDetailed.map((product) => {
            let disable = cartModel.inProcess(product.id);
            return (
                <tr key={product.id}>
                    <td>{product.title}</td>
                    <td>{product.price}</td>
                    <td>
                        <AppMinMax 
                            disable={disable}
                            min={1} 
                            max={product.rest} 
                            cnt={product.cnt} 
                            onChange={(cnt) => cartModel.change(product.id, cnt)}
                        />
                    </td>
                    <td>{product.price * product.cnt}</td>
                    <td>
                        <button onClick={() => cartModel.remove(product.id)}>
                            X
                        </button>
                    </td>
                </tr>
            );
        });

        return (
            <div>
                <h2>Cart</h2>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <td>Title</td>
                            <td>Price</td>
                            <td>Count</td>
                            <td>Total</td>
                            <td>Actions</td>
                        </tr>
                    </thead>
                    <tbody>
                        {productsRows}
                    </tbody> 
                </table>
                <h3>Total: {cartModel.total}</h3>
                <hr/>
                <LinkButton to={routesMap.order} className="btn btn-primary">
                    Proceed
                </LinkButton>
            </div>
        );
    }
}

export default withStore(Cart);