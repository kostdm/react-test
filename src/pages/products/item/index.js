import React from 'react';
import { Link } from 'react-router-dom';

import E404 from '~c/errors/404';
import ProductItem from '~c/products/item';

import { routesMap } from '~/routes';

import withStore from '~/hocs/withStore';

class Product extends React.Component{
    render(){
        let id = this.props.match.params.id;
        let product = this.props.stores.products.getById(id);
        let cart = this.props.stores.cart;
        
        if(product === null){
            return <E404/>
        }
        else{
            return <ProductItem 
                        title={product.title} 
                        price={product.price} 
                        backUrl={routesMap.home} 
                        linkComponent={Link}
                        inCart={cart.inCart(product.id)}
                        onAdd={() => cart.add(product.id)}
                        onRemove={() => cart.remove(product.id)}
                    />
        }
    }
}

export default withStore(Product);