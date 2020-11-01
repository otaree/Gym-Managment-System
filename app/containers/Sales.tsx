/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { format, parseISO } from 'date-fns';
import { useHistory } from 'react-router';
import {
  Box,
  Heading,
  Flex,
  Input,
  Text,
  IconButton,
  Stack,
  Select,
  Spinner,
} from '@chakra-ui/core';
import DatePicker, { DayValue } from 'react-modern-calendar-datepicker';

import Pagination from '../components/TablePagination';
import { ISaleDocument, ISaleQuery } from '../db';
import urlParser from '../utils/urlParser';
import ipcEvents from '../constants/ipcEvents.json';

const Sales = () => {
  const [sales, setSales] = useState<ISaleDocument[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [query, setQuery] = useState<{
    limit: number;
    skip: number;
    startDate: Date | null;
    endDate: Date | null;
  }>({
    limit: 10,
    skip: 0,
    startDate: null,
    endDate: null,
  });
  const [fetchingSales, setFetchingSales] = useState(false);
  const [selectStartDate, setSelectStartDate] = useState<DayValue>();
  const [selectEndDate, setSelectEndDate] = useState<DayValue>();
  const history = useHistory();

  const fetchSales = async (saleQuery: ISaleQuery) => {
    console.log('QUERY:::', saleQuery);
    setFetchingSales(true);
    const res = await ipcRenderer.invoke(ipcEvents.GET_SALES, saleQuery);
    setSales(res.sales);
    setTotalCount(res.totalCount);
    setFetchingSales(false);
  };

  const zeroPad = (num: number): string =>
    Number(num) < 10 ? `0${num}` : `${num}`;

  useEffect(() => {
    const queryPrepaid: ISaleQuery = {
      limit: query.limit,
      skip: query.skip,
    };

    if (query.startDate) {
      queryPrepaid.startDate = query.startDate;
    }

    if (query.endDate) {
      queryPrepaid.endDate = query.endDate;
    }

    fetchSales(queryPrepaid);
  }, [query, query.limit, query.skip, query.startDate, query.endDate]);

  useEffect(() => {
    const parsedQuery: any = urlParser(history.location.search);
    console.log('SALES_QUERY:::', parsedQuery);
    const newQuery: {
      limit: number;
      skip: number;
      startDate: Date | null;
      endDate: Date | null;
    } = {
      limit: 10,
      skip: 0,
      startDate: null,
      endDate: null,
    };
    if (parsedQuery.limit && Number.isInteger(Number(parsedQuery.limit))) {
      newQuery.limit = Number(parsedQuery.limit);
    }
    if (parsedQuery.skip && Number.isInteger(Number(parsedQuery.skip))) {
      newQuery.skip = Number(parsedQuery.skip);
    }
    // if (parsedQuery.startDate && parseISO(parsedQuery.startDate)) {
    //   const date = parseISO(parsedQuery.startDate)
    //   newQuery.startDate = date;
    // }
    // if (parsedQuery.endDate && parseISO(parsedQuery.endDate)) {
    //   newQuery.endDate = parseISO(parsedQuery.endDate);
    // }
    setQuery({ ...query, ...newQuery });
  }, [history.location.search]);

  return (
    <Box>
      <Heading>Sales</Heading>
      <Flex flexDirection="column" mt={4}>
        <Flex justifyContent="flex-end">
          <Stack isInline>
            <DatePicker
              value={selectStartDate}
              onChange={(value) => {
                setSelectStartDate(value);
                if (value) {
                  setQuery({
                    ...query,
                    startDate: new Date(value.year, value.month - 1, value.day),
                  });
                }
              }}
              renderInput={({ ref }) => {
                return (
                  <Input
                    ref={ref as React.RefObject<HTMLInputElement>}
                    placeholder="Start End"
                    onChange={() => {}}
                    value={
                      selectStartDate
                        ? `${zeroPad(selectStartDate?.day)}/${zeroPad(
                            selectStartDate?.month
                          )}/${selectStartDate?.year}`
                        : ''
                    }
                  />
                );
              }} // render a custom input
              shouldHighlightWeekends
              calendarPopperPosition="bottom"
            />
            <DatePicker
              value={selectEndDate}
              onChange={(value) => {
                setSelectEndDate(value);
                if (value) {
                  setQuery({
                    ...query,
                    endDate: new Date(value.year, value.month - 1, value.day),
                  });
                }
              }}
              renderInput={({ ref }) => {
                return (
                  <Input
                    ml={2}
                    ref={ref as React.RefObject<HTMLInputElement>}
                    placeholder="End Date"
                    onChange={() => {}}
                    value={
                      selectEndDate
                        ? `${zeroPad(selectEndDate?.day)}/${zeroPad(
                            selectEndDate?.month
                          )}/${selectEndDate?.year}`
                        : ''
                    }
                  />
                );
              }} // render a custom input
              shouldHighlightWeekends
              calendarPopperPosition="bottom"
            />
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
          </Stack>
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
                        onClick={() => {
                          history.push(
                            `/sales/${sale._id}?limit=${query.limit}&skip=${
                              query.skip
                            }&startDate=${
                              query.startDate && query.startDate.toISOString()
                            }&endDate=${
                              query.endDate && query.endDate.toISOString()
                            }`
                          );
                        }}
                      />
                    </Flex>
                  </Box>
                </Box>
              ))}
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
