/* eslint-disable no-underscore-dangle */
import React from 'react';
import { ipcRenderer } from 'electron';
import { useHistory } from 'react-router';
import { Box, Heading } from '@chakra-ui/core';

import EmployeeForm from '../components/EmployeeForm';
import BackButton from '../components/BackButton';
import ipcEvents from '../constants/ipcEvents.json';

const AddEmployee = () => {
  const history = useHistory();

  const onSubmit = async (data: any) => {
    await ipcRenderer.invoke(ipcEvents.CREATE_EMPLOYEE, data);
    // history.push(`/prepaid/${prepaid._id}`);
    history.push(`/employees`);
  };

  return (
    <Box>
      <BackButton />
      <Heading>Add Employee</Heading>
      <EmployeeForm onSubmitted={onSubmit} />
    </Box>
  );
};

export default AddEmployee;
