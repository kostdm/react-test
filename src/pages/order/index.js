import React from 'react';
import {Form, Button, Modal, Table} from 'react-bootstrap';
import { Link } from 'react-router-dom';

import withStore from '~/hocs/withStore';

import { routesMap } from '~/routes';


class Order extends React.Component{
    state = {
        showModal: false
    }

    show = () => {
        this.setState({showModal: true});
    }

    hide = () => {
        this.setState({showModal: false});
    }

    confirm = () => {
        let order = this.props.stores.order;
        let cart = this.props.stores.cart;

        order.addOrder(cart.productsDetailed, order.data);

        cart.clean();
        
        this.hide();
        this.props.history.push(routesMap.result);
    }

    render(){
        let orderModel = this.props.stores.order;
        let cartModel = this.props.stores.cart;
        let formFields = [];

        for(let name in orderModel.formData){
            let field = orderModel.formData[name];
            
            formFields.push(
                <Form.Group key={name} controlId={'order-form-' + name}>
                    <Form.Label>{field.label}</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={field.value}
                        onChange={(e) => orderModel.change(name, e.target.value)}
                    />
                    {field.valid === null || field.valid ? '' : 
                        <Form.Text className="text-muted">
                            {field.errorText}
                        </Form.Text>
                    }
                </Form.Group>
            );
        }

        let productRows = cartModel.productsDetailed.map((pr) => {
            return (
                <tr key={pr.id}>
                    <td>{pr.title}</td>
                    <td>{pr.price}</td>
                    <td>{pr.cnt}</td>
                    <td>{pr.price * pr.cnt}</td>
                </tr>
            );
        });

        let userdata = orderModel.data;

        return (
            <div>
                <h2>Order</h2>
                <hr/>
                <Form>
                    {formFields}
                </Form>
                <Link className="btn btn-warning" to={routesMap.home}>
                    Back to cart
                </Link>
                &nbsp;
                <Button variant="primary" 
                        onClick={this.show} 
                        disabled={!orderModel.formValid}>
                    Apply order
                </Button>
                <Modal show={this.state.showModal} backdrop="static" onHide={this.hide}>
                    <Modal.Header closeButton>
                        <Modal.Title>Check information</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Your order:</h4>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Price</th>
                                    <th>Title</th>
                                    <th>Count</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productRows}
                                <tr>
                                    <td colSpan="4">
                                        <h4>Total: {cartModel.total}</h4>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                        <h4>Customer information:</h4>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>E-mail</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{userdata.name}</td>
                                    <td>{userdata.phone}</td>
                                    <td>{userdata.email}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.hide}>
                            Ooops
                        </Button>
                        <Button variant="primary" onClick={this.confirm}>
                            All right
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default withStore(Order);