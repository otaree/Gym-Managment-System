/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Heading,
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
  Icon,
  Text,
  IconButton,
  Stack,
  Select,
  Button,
  Spinner,
} from '@chakra-ui/core';

import Pagination from '../components/TablePagination';
import {
  selectCart,
  addProduct,
  removeProduct,
} from '../features/cart/cartSlice';
import { IProductDocument, IProductQuery } from '../db';
import urlParser from '../utils/urlParser';
import ipcEvents from '../constants/ipcEvents.json';

const Products = () => {
  const [products, setProducts] = useState<IProductDocument[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [query, setQuery] = useState<{
    limit: number;
    skip: number;
    search: string;
  }>({
    limit: 10,
    skip: 0,
    search: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [fetchingProducts, setFetchingProducts] = useState(false);
  const cart = useSelector(selectCart);
  const dispatch = useDispatch();
  const history = useHistory();

  const fetchProducts = async (productQuery: IProductQuery) => {
    setFetchingProducts(true);
    const res = await ipcRenderer.invoke(ipcEvents.GET_PRODUCTS, productQuery);
    setProducts(res.products);
    setTotalCount(res.totalCount);
    setFetchingProducts(false);
  };

  useEffect(() => {
    const queryPrepaid: IProductQuery = {
      limit: query.limit,
      skip: query.skip,
    };

    if (query.search.trim().length > 0) {
      queryPrepaid.search = query.search.trim();
    }

    fetchProducts(queryPrepaid);
  }, [query, query.limit, query.skip, query.search]);

  useEffect(() => {
    const parsedQuery: any = urlParser(history.location.search);
    const newQuery = {
      limit: 10,
      skip: 0,
      search: '',
    };
    if (parsedQuery.limit && Number.isInteger(Number(parsedQuery.limit))) {
      newQuery.limit = Number(parsedQuery.limit);
    }
    if (parsedQuery.skip && Number.isInteger(Number(parsedQuery.skip))) {
      newQuery.skip = Number(parsedQuery.skip);
    }
    if (parsedQuery.search) {
      newQuery.search = parsedQuery.search;
    }
    setQuery({ ...query, ...newQuery });
  }, [history.location.search]);

  const inCart = (id: string) => {
    const product = cart.find((item) => item.product._id === id);
    return !!product;
  };

  return (
    <Box>
      <Heading>Products</Heading>
      <Flex flexDirection="column" mt={4}>
        <Flex justifyContent="space-between">
          <Stack isInline>
            <InputGroup w="26vw">
              <InputLeftElement>
                <Icon name="search" color="gray.300" />
              </InputLeftElement>
              <Input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const term = e.target.value;
                  setSearchTerm(term);
                }}
              />
            </InputGroup>
            <IconButton
              icon="search"
              aria-label="search"
              onClick={() => setQuery({ ...query, search: searchTerm })}
            />
          </Stack>
          <Flex>
            <Select
              placeholder="Limit"
              ml={4}
              w="5vw"
              defaultValue="10"
              value={query.limit}
              onChange={(e) => {
                const limit = e.target.value;
                // eslint-disable-next-line no-restricted-globals
                if (!isNaN(Number(limit))) {
                  setQuery((prevQuery) => ({
                    ...prevQuery,
                    limit: Number(limit),
                  }));
                }
              }}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </Select>
            <Button
              ml={4}
              leftIcon="add"
              variantColor="purple"
              aria-label="Add member"
              borderRadius="0"
              onClick={() => history.push('/products/add')}
            >
              Add Prepaid
            </Button>
          </Flex>
        </Flex>
        <Box pos="relative">
          <Box
            as="table"
            my={4}
            backgroundColor="white"
            minH={200}
            w="100%"
            borderWidth={1}
          >
            <Box as="thead">
              <Box as="tr" borderBottomWidth={1}>
                <Text as="th">Name</Text>
                <Text as="th" w={180}>
                  Purchase Price(&#8377;)
                </Text>
                <Text as="th" w={180}>
                  Selling Price(&#8377;)
                </Text>
                <Text as="th" w={180}>
                  Profit Margin(&#8377;)
                </Text>
                <Text as="th" w={120}>
                  Quantity
                </Text>
                <Text as="th" w={80}>
                  Actions
                </Text>
              </Box>
            </Box>
            <Box as="tbody">
              {products.map((product, i) => (
                <Box as="tr" key={product._id} borderTopWidth={i === 0 ? 0 : 1}>
                  <Text as="td" pl={2} textTransform="capitalize">
                    {product.name}
                  </Text>
                  <Text as="td" textAlign="center">
                    {product.purchasePrice}
                  </Text>
                  <Text as="td" textAlign="center">
                    {product.sellingPrice}
                  </Text>
                  <Text as="td" textAlign="center">
                    {(product.sellingPrice - product.purchasePrice).toFixed(2)}
                  </Text>
                  <Text as="td" textAlign="center">
                    {product.quantity}
                  </Text>
                  <Box as="td">
                    <Stack isInline>
                      <IconButton
                        icon="view"
                        aria-label="view"
                        variant="ghost"
                        variantColor="purple"
                        onClick={() => {
                          history.push(
                            `/products/${product._id}?limit=${query.limit}&skip=${query.skip}&search=${query.search}`
                          );
                        }}
                      />
                      {inCart(product._id!) ? (
                        <IconButton
                          icon="minus"
                          aria-label="remove from cart"
                          variant="ghost"
                          variantColor="red"
                          onClick={() => dispatch(removeProduct(product._id))}
                        />
                      ) : (
                        <IconButton
                          icon="add"
                          aria-label="add to cart"
                          variant="ghost"
                          variantColor="green"
                          onClick={() => dispatch(addProduct(product))}
                        />
                      )}
                    </Stack>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        {fetchingProducts && (
          <Flex
            justifyContent="center"
            alignItems="center"
            pos="absolute"
            top={0}
            bottom={0}
            left={0}
            right={0}
          >
            <Spinner size="lg" color="purple.500" />
          </Flex>
        )}
        <Flex justifyContent="flex-end">
          <Pagination
            goTo={(skip: number) => setQuery({ ...query, skip })}
            limit={query.limit}
            skip={query.skip}
            totalCount={totalCount}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Products;
