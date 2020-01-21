/* eslint-disable react/state-in-constructor */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { MdShoppingCart } from 'react-icons/md';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as CarActions from '../../store/modules/cart/actions';

import api from '../../services/api';
import { formatPrice } from '../../util/format';
import { ProductList } from './styles';

function Home({ amount, addToCartRequest }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      const resp = await api.get('products');
      const data = resp.data.map(product => ({
        ...product,
        priceFormatted: formatPrice(product.price),
      }));
      setProducts(data);
    }
    loadProducts();
  }, []);

  return (
    <ProductList>
      {products.map(product => (
        <li key={product.id}>
          <img src={product.image} alt={product.title} />
          <strong>{product.title}</strong>
          <span>{product.priceFormatted}</span>

          <button type="button" onClick={() => addToCartRequest(product.id)}>
            <div>
              <MdShoppingCart size={16} color="#FFF" />
              {amount[product.id] || 0}
            </div>
            <span>Adicionar ao carrinho</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
}

Home.propTypes = {
  amount: PropTypes.objectOf(PropTypes.number).isRequired,
  addToCartRequest: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  amount: state.cart.reduce((amount, product) => {
    amount[product.id] = product.amount;
    return amount;
  }, {}),
});

const mapDispatchToProps = dispatch => bindActionCreators(CarActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
