/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import { ipcRenderer } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Heading, Text, Stack, IconButton, Flex } from '@chakra-ui/core';

import {
  selectCart,
  incrementItem,
  decrementItem,
  removeProduct,
} from '../features/cart/cartSlice';
import { IProductDocument } from '../db';
import ipcEvents from '../constants/ipcEvents.json';

const Cart = () => {
  const cart = useSelector(selectCart);
  const dispatch = useDispatch();

  const increaseQuantity = (item: {
    product: IProductDocument;
    quantity: number;
  }) => {
    const productQuantity = Number(item.product.quantity);
    if (productQuantity >= item.quantity + 1) {
      dispatch(incrementItem(item.product._id));
    }
  };

  const decreaseQuantity = (item: {
    product: IProductDocument;
    quantity: number;
  }) => {
    if (Number(item.quantity) - 1 > 0) {
      dispatch(decrementItem(item.product._id));
    }
  };

  const totalAmount = cart.reduce((acc, curr) => {
    // eslint-disable-next-line no-param-reassign
    acc += curr.product.sellingPrice * curr.quantity;
    return acc;
  }, 0);

  return (
    <Box backgroundColor="gray.50">
      <Box w="80%">
        <Flex justifyContent="space-between">
          <Heading>Cart</Heading>
          <Text fontWeight="medium" fontSize="xl" color="gray.600">
            Total: &#8377; {totalAmount}
          </Text>
        </Flex>
        <Box as="table" borderWidth={1} my={4} backgroundColor="white" w="100%">
          <Box as="thead">
            <Box as="tr" borderBottomWidth={1}>
              <Text as="th">Product</Text>
              <Text as="th" w={180}>
                Quantity
              </Text>
              <Text as="th" w={120}>
                Price(&#8377;)
              </Text>
              <Text as="th" w={80}>
                Remove
              </Text>
            </Box>
          </Box>
          <Box as="tbody">
            {cart.map((item, i) => (
              <Box
                as="tr"
                key={item.product._id!}
                borderTopWidth={i === 0 ? 0 : 1}
              >
                <Text as="td" p={2}>
                  {item.product.name}
                </Text>
                {/* <Text as="td">{item.quantity}</Text> */}
                <Flex justifyContent="center" alignItems="center">
                  <Stack isInline alignItems="center">
                    <IconButton
                      icon="minus"
                      aria-label="remove from cart"
                      variant="ghost"
                      variantColor="red"
                      size="sm"
                      onClick={() => decreaseQuantity(item)}
                    />
                    <Text mx={2}>{item.quantity}</Text>
                    <IconButton
                      icon="add"
                      aria-label="add to cart"
                      variant="ghost"
                      variantColor="green"
                      size="sm"
                      onClick={() => increaseQuantity(item)}
                    />
                  </Stack>
                </Flex>
                <Text as="td" textAlign="center">
                  {item.product.sellingPrice}
                </Text>
                <Flex as="td" justifyContent="center">
                  <IconButton
                    icon="delete"
                    aria-label="add to cart"
                    variant="ghost"
                    variantColor="red"
                    onClick={() => dispatch(removeProduct(item.product._id))}
                  />
                </Flex>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Cart;
