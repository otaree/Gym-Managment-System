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
import { IPrepaidDocument } from '../db';
import { IPrepaidQuery } from '../main.dev';
import urlParser from '../utils/urlParser';
import ipcEvents from '../constants/ipcEvents.json';

const AllPrepaid = () => {
  const [allPrepaid, setAllPrepaid] = useState<IPrepaidDocument[]>([]);
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
  const [fetchingAllPrepaid, setFetchingAllPrepaid] = useState(false);
  const history = useHistory();

  const fetchAllPrepaid = async (queryAllPrepaid: IPrepaidQuery) => {
    setFetchingAllPrepaid(true);
    const res = await ipcRenderer.invoke(
      ipcEvents.GET_ALL_PREPAID,
      queryAllPrepaid
    );
    setAllPrepaid(res.allPrepaid);
    setTotalCount(res.totalCount);
    setFetchingAllPrepaid(false);
  };

  useEffect(() => {
    const queryPrepaid: IPrepaidQuery = {
      limit: query.limit,
      skip: query.skip,
    };

    if (query.search.trim().length > 0) {
      queryPrepaid.search = query.search.trim();
    }

    fetchAllPrepaid(queryPrepaid);
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

  return (
    <Box>
      <Heading>All Prepaid</Heading>
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
              onClick={() => history.push('/prepaid/add')}
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
                <Text as="th" w={120}>
                  Phone No.
                </Text>
                <Text as="th" w={120}>
                  Amount (&#8377;)
                </Text>
                <Text as="th" w={120}>
                  Paid
                </Text>
                <Text as="th" w={200}>
                  Start Time
                </Text>
                <Text as="th" w={200}>
                  End Time
                </Text>
                <Text as="th" w={76}>
                  View
                </Text>
              </Box>
            </Box>
            <Box as="tbody">
              {allPrepaid.map((prepaid, i) => (
                <Box as="tr" key={prepaid._id} borderTopWidth={i === 0 ? 0 : 1}>
                  <Text as="td" pl={2}>
                    {`${prepaid.firstName} ${prepaid.lastName}`}
                  </Text>
                  <Text as="td" textAlign="center">
                    {prepaid.phone}
                  </Text>
                  <Text as="td" textAlign="center">
                    {prepaid.amount}
                  </Text>
                  <Box as="td">
                    <Flex justifyContent="center">
                      <Tag
                        variantColor={prepaid.paid ? 'green' : 'red'}
                        variant="solid"
                        rounded="full"
                        size="sm"
                      >
                        <TagLabel>{prepaid.paid ? 'Paid' : 'Due'}</TagLabel>
                      </Tag>
                    </Flex>
                  </Box>
                  <Text as="td" textAlign="center">
                    {format(prepaid.startAt, 'hh:mm aaaa dd/mm/yyyy')}
                  </Text>
                  <Text as="td" textAlign="center">
                    {format(prepaid.endAt, 'hh:mm aaaa dd/mm/yyyy')}
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
                            `/prepaid/${prepaid._id}?limit=${query.limit}&skip=${query.skip}&search=${query.search}`
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
        {fetchingAllPrepaid && (
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

export default AllPrepaid;
