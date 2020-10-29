/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { format } from 'date-fns';
import { useHistory } from 'react-router';
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
  Tag,
  TagLabel,
  Stack,
  Select,
  Button,
  Spinner,
} from '@chakra-ui/core';

import Pagination from '../components/TablePagination';
import { ISaleProduct, ISale, ISaleDocument, ISaleQuery } from '../db';
import ipcEvents from '../constants/ipcEvents.json';

const Sales = () => {
  const [sales, setSales] = useState<ISaleDocument[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [query, setQuery] = useState<{
    limit: number;
    skip: number;
  }>({
    limit: 10,
    skip: 0,
  });
  const [fetchingSales, setFetchingSales] = useState(false);
  const history = useHistory();

  const fetchSales = async (saleQuery: ISaleQuery) => {
    setFetchingSales(true);
    const res = await ipcRenderer.invoke(ipcEvents.GET_SALES, saleQuery);
    setSales(res.sales);
    setTotalCount(res.totalCount);
    setFetchingSales(false);
  };

  useEffect(() => {
    const queryPrepaid: ISaleQuery = {
      limit: query.limit,
      skip: query.skip,
    };

    fetchSales(queryPrepaid);
  }, [query, query.limit, query.skip]);

  return (
    <Box>
      <Heading>Sales</Heading>
      <Flex flexDirection="column" mt={4}>
        <Flex justifyContent="flex-end">
          <Box>
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
          </Box>
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
                <Text as="th" w={180}>
                  Date
                </Text>
                <Text as="th">Buyer</Text>
                <Text as="th" w={180}>
                  Purchase Price(&#8377;)
                </Text>
                <Text as="th" w={180}>
                  Selling Price(&#8377;)
                </Text>
                <Text as="th" w={180}>
                  Profit Margin(&#8377;)
                </Text>
                <Text as="th" w={76}>
                  View
                </Text>
              </Box>
            </Box>
            <Box as="tbody">
              {sales.map((sale, i) => (
                <Box as="tr" key={sale._id} borderTopWidth={i === 0 ? 0 : 1}>
                  <Text as="td" textAlign="center">
                    {format(sale.createdAt, 'hh:mm aaaa dd/mm/yyyy')}
                  </Text>
                  <Text as="td" pl={2}>
                    {sale.buyer.name}
                  </Text>
                  <Text as="td" textAlign="center">
                    {sale.totalPurchasePrice}
                  </Text>
                  <Text as="td" textAlign="center">
                    {sale.totalSellingPrice}
                  </Text>
                  <Text as="td" textAlign="center">
                    {sale.totalSellingPrice - sale.totalPurchasePrice}
                  </Text>
                  <Box as="td">
                    <Flex justifyContent="center">
                      <IconButton
                        icon="view"
                        aria-label="view"
                        variant="ghost"
                        variantColor="purple"
                        onClick={() => {}}
                      />
                    </Flex>
                  </Box>
                </Box>
              ))}
            </Box>
            <Box as="tfoot" w="100%" borderTopWidth={1}>
              <Box as="tr" w="100%">
                <Text as="td"> </Text>
                <Text as="td" textAlign="center" aria-rowspan={2}>
                  Total Amount(&#8377;)
                </Text>
                <Text as="td" textAlign="center">
                  100
                </Text>
                <Text as="td" textAlign="center">
                  100
                </Text>
                <Text as="td" textAlign="center">
                  {' '}
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
        {fetchingSales && (
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

export default Sales;
