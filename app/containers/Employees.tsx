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

  return (
    <Box>
      <Heading>Employees</Heading>
    </Box>
  );
};

export default Employees;
