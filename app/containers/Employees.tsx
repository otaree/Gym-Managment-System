/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
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

import { IEmployeeDocument } from '../db';
import ipcEvents from '../constants/ipcEvents.json';

const Employees = () => {
  const [employees, setEmployees] = useState<IEmployeeDocument[]>([]);
  const [fetchingEmployees, setFetchingEmployees] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const fetchEmployees = async () => {
      setFetchingEmployees(true);
      const resEmployees = await ipcRenderer.invoke(ipcEvents.GET_EMPLOYEES);
      setEmployees(resEmployees);
      setFetchingEmployees(false);
    };
    fetchEmployees();
  }, []);

  if (fetchingEmployees) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner color="purple.600" size="lg" />
      </Flex>
    );
  }

  return (
    <Box>
      <Heading>Employees</Heading>
      <Flex justifyContent="flex-end">
        <Button
          leftIcon="add"
          variantColor="green"
          size="md"
          borderRadius={0}
          onClick={() => history.push('/employees/add')}
        >
          Add Employee
        </Button>
      </Flex>
      <Box as="table" backgroundColor="white" my={4} w="100%">
        <Box as="thead">
          <Box as="tr">
            <Text as="th" borderWidth={1} w={140}>
              Photo
            </Text>
            <Text as="th" borderWidth={1}>
              Name
            </Text>
            <Text as="th" borderWidth={1} w={80}>
              Sex
            </Text>
            <Text as="th" borderWidth={1} w={120}>
              Mobile
            </Text>
            <Text as="th" borderWidth={1} w={76}>
              View
            </Text>
          </Box>
        </Box>
        <Box as="tbody" borderWidth={1}>
          {employees.map((employee) => (
            <Box as="tr" key={employee._id!} my={2}>
              <Box as="td">
                <Flex justifyContent="center">
                  <Avatar
                    size="lg"
                    name={`${employee.firstName} ${employee.lastName}`}
                    src={employee.img}
                  />
                </Flex>
              </Box>
              <Text as="td" pl={2}>
                {`${employee.firstName} ${employee.lastName}`}
                {!employee.isEmployed && (
                  <Tag
                    variantColor="red"
                    variant="outline"
                    rounded="full"
                    size="sm"
                    ml={2}
                  >
                    <TagLabel>Not Employed</TagLabel>
                  </Tag>
                )}
              </Text>
              <Text as="td" textAlign="center" textTransform="capitalize">
                {employee.sex}
              </Text>
              <Text as="td" textAlign="center">
                {employee.mobile}
              </Text>
              <Box as="td">
                <Flex justifyContent="center">
                  <IconButton
                    icon="view"
                    aria-label="view"
                    variant="ghost"
                    variantColor="purple"
                    onClick={() => history.push(`/employees/${employee._id}`)}
                  />
                </Flex>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Employees;
