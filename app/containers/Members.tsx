/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { compareAsc } from 'date-fns';
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
  Avatar,
  IconButton,
  Tag,
  TagIcon,
  TagLabel,
  Stack,
  Select,
  Button,
  Spinner,
} from '@chakra-ui/core';
import { FaFileCsv } from 'react-icons/fa';

import Pagination from '../components/TablePagination';
import { IMemberDocument } from '../db';
import { IMembersQuery } from '../main.dev';
import urlParser from '../utils/urlParser';
import ipcEvents from '../constants/ipcEvents.json';

const Members = () => {
  const [members, setMembers] = useState<IMemberDocument[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [query, setQuery] = useState<{
    limit: number;
    skip: number;
    isMember: string;
    search: string;
    paymentDue: string;
  }>({
    limit: 10,
    skip: 0,
    isMember: '',
    search: '',
    paymentDue: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [fetchingMembers, setFetchingMembers] = useState(false);
  const [buildingCSV, setBuildingCSV] = useState(false);
  const history = useHistory();

  const fetchMembers = async (queryMembers: IMembersQuery) => {
    setFetchingMembers(true);
    const res = await ipcRenderer.invoke(ipcEvents.GET_MEMBERS, queryMembers);
    setMembers(res.members);
    setTotalCount(res.totalCount);
    setFetchingMembers(false);
  };

  const downloadCSV = async () => {
    setBuildingCSV(true);
    await ipcRenderer.invoke(ipcEvents.CSV_MEMBERS);
    setBuildingCSV(false);
  };

  useEffect(() => {
    const queryMembers: IMembersQuery = {
      limit: query.limit,
      skip: query.skip,
    };
    if (query.isMember === 'yes') {
      queryMembers.isMember = true;
    } else if (query.isMember === 'no') {
      queryMembers.isMember = false;
    }

    if (query.paymentDue === 'due') {
      queryMembers.paymentDue = true;
    } else if (query.paymentDue === 'none') {
      queryMembers.paymentDue = false;
    }

    if (query.search.trim().length > 0) {
      queryMembers.search = query.search.trim();
    }

    fetchMembers(queryMembers);
  }, [
    query,
    query.limit,
    query.skip,
    query.isMember,
    query.paymentDue,
    query.search,
  ]);

  useEffect(() => {
    const parsedQuery: any = urlParser(history.location.search);
    const newQuery = {
      limit: 10,
      skip: 0,
      isMember: '',
      search: '',
      paymentDue: '',
    };
    if (parsedQuery.limit && Number.isInteger(Number(parsedQuery.limit))) {
      newQuery.limit = Number(parsedQuery.limit);
    }
    if (parsedQuery.skip && Number.isInteger(Number(parsedQuery.skip))) {
      newQuery.skip = Number(parsedQuery.skip);
    }
    if (parsedQuery.isMember) {
      newQuery.isMember = parsedQuery.isMember;
    }
    if (parsedQuery.paymentDue) {
      newQuery.paymentDue = parsedQuery.paymentDue;
    }
    if (parsedQuery.search) {
      newQuery.search = parsedQuery.search;
    }
    setQuery({ ...query, ...newQuery });
  }, [history.location.search]);

  return (
    <Box>
      <Heading>Members</Heading>
      <Flex flexDirection="column" mt={4}>
        <Flex justifyContent="space-between">
          <Stack isInline>
            <InputGroup w="26vw">
              <InputLeftElement>
                <Icon name="search" color="gray.300" />
              </InputLeftElement>
              <Input
                type="text"
                placeholder="Search by member's name or member's Id..."
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
              onClick={() => {
                setQuery({ ...query, search: searchTerm, skip: 0 });
              }}
            />
          </Stack>
          <Flex>
            <Select
              placeholder="Payment Due"
              ml={4}
              w="10vw"
              value={query.paymentDue}
              onChange={(e) => {
                const paymentDue = e.target.value;
                setQuery((prevQuery) => ({ ...prevQuery, paymentDue }));
              }}
            >
              <option value="due">Due</option>
              <option value="none">None</option>
            </Select>
            <Select
              placeholder="Member"
              ml={4}
              w="10vw"
              value={query.isMember}
              onChange={(e) => {
                const isMember = e.target.value;
                setQuery((prevQuery) => ({
                  ...prevQuery,
                  isMember,
                }));
              }}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Select>
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
              leftIcon={FaFileCsv}
              variantColor="green"
              aria-label="Add member"
              borderRadius="0"
              onClick={downloadCSV}
              isLoading={buildingCSV}
              isDisabled={buildingCSV}
            >
              CSV
            </Button>
            <Button
              ml={4}
              leftIcon="add"
              variantColor="purple"
              aria-label="Add member"
              borderRadius="0"
              onClick={() => history.push('/members/add')}
            >
              Add Member
            </Button>
          </Flex>
        </Flex>
        <Box pos="relative">
          <Box as="table" my={4} backgroundColor="white" minH={200} w="100%">
            <Box as="thead">
              <Box as="tr">
                <Text as="th" borderWidth={1} w={140}>
                  Photo
                </Text>
                <Text as="th" borderWidth={1}>
                  Name
                </Text>
                <Text as="th" borderWidth={1} w={120}>
                  Member Id
                </Text>
                <Text as="th" borderWidth={1} w={120}>
                  Phone No.
                </Text>
                <Text as="th" borderWidth={1} w={120}>
                  Payment Due
                </Text>
                <Text as="th" borderWidth={1} w={76}>
                  Member
                </Text>
                <Text as="th" borderWidth={1} w={76}>
                  View
                </Text>
              </Box>
            </Box>
            <Box as="tbody" borderWidth={1}>
              {members.map((member) => (
                // eslint-disable-next-line no-underscore-dangle
                <Box as="tr" key={member._id} h="100%">
                  <Box as="td">
                    <Flex justifyContent="center">
                      <Avatar
                        size="lg"
                        name={`${member.firstName} ${member.lastName}`}
                        src={member.img}
                      />
                    </Flex>
                  </Box>
                  <Text as="td" pl={2}>
                    {`${member.firstName} ${member.lastName}`}
                    {compareAsc(new Date(), member.memberShipExpirationDate) ===
                      1 && (
                      <Tag
                        variantColor="red"
                        variant="outline"
                        rounded="full"
                        size="sm"
                        ml={2}
                      >
                        <TagLabel>Expired</TagLabel>
                      </Tag>
                    )}
                  </Text>
                  <Text as="td" textAlign="center">
                    {member.memberId}
                  </Text>
                  <Text as="td" textAlign="center">
                    {member.phoneNo}
                  </Text>
                  <Box as="td">
                    <Flex justifyContent="center">
                      {member.hasPaymentDue ? (
                        <Tag
                          size="sm"
                          variantColor="red"
                          variant="solid"
                          rounded="full"
                        >
                          <TagLabel>Due</TagLabel>
                        </Tag>
                      ) : (
                        <Tag
                          size="sm"
                          variantColor="green"
                          variant="solid"
                          rounded="full"
                        >
                          <TagLabel>None</TagLabel>
                        </Tag>
                      )}
                    </Flex>
                  </Box>
                  <Box as="td">
                    <Flex justifyContent="center">
                      {member.isMember ? (
                        <Tag
                          variantColor="green"
                          variant="solid"
                          rounded="full"
                        >
                          <TagIcon icon="check" size="12px" />
                        </Tag>
                      ) : (
                        <Tag
                          size="sm"
                          variantColor="red"
                          variant="solid"
                          rounded="full"
                        >
                          <TagIcon icon="close" size="12px" />
                        </Tag>
                      )}
                    </Flex>
                  </Box>
                  <Box as="td">
                    <Flex justifyContent="center">
                      <IconButton
                        icon="view"
                        aria-label="view"
                        variant="ghost"
                        variantColor="purple"
                        onClick={() => {
                          history.push(
                            `/members/${member._id}/details?skip=${query.skip}&limit=${query.limit}&isMember=${query.isMember}&paymentDue=${query.paymentDue}&search=${query.search}`
                          );
                        }}
                      />
                    </Flex>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
          {fetchingMembers && (
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
        </Box>
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

export default Members;
