/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { useParams, useHistory } from 'react-router';
import { Box, Heading, Spinner, Flex } from '@chakra-ui/core';

import EmployeeForm from '../components/EmployeeForm';
import BackButton from '../components/BackButton';
import { IEmployeeDocument } from '../db';
import ipcEvents from '../constants/ipcEvents.json';

const EditEmployee = () => {
  const [employee, setEmployee] = useState<IEmployeeDocument>();
  const [isFetching, setIsFetching] = useState(false);
  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  const onSubmit = async (data: any) => {
    await ipcRenderer.invoke(ipcEvents.UPDATE_EMPLOYEE, { id, data });
    // history.push(`/prepaid/${prepaid._id}`);
    history.push(`/employees/${id}`);
  };

  useEffect(() => {
    const fetchEmployee = async () => {
      // const isAuth = await ipcRenderer.invoke(ipcEvents.STAFF_LOGIN, data);
      setIsFetching(true);
      const resEmployee = await ipcRenderer.invoke(ipcEvents.GET_EMPLOYEE, id);
      setEmployee(resEmployee);
      setIsFetching(false);
    };
    fetchEmployee();
  }, [id]);

  if (isFetching) {
    return (
      <Flex height="80vh" justifyContent="center" alignItems="center">
        <Spinner color="purple.500" size="lg" />
      </Flex>
    );
  }

  return (
    <Box>
      <BackButton />
      <Heading>Edit Employee</Heading>
      <EmployeeForm onSubmitted={onSubmit} isEdit employee={employee} />
    </Box>
  );
};

export default EditEmployee;
