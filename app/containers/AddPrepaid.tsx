/* eslint-disable no-underscore-dangle */
import React from 'react';
import { ipcRenderer } from 'electron';
import { useHistory } from 'react-router';
import { Box, Heading } from '@chakra-ui/core';

import PrepaidForm from '../components/PrepaidForm';
import BackButton from '../components/BackButton';
import { IPrepaid } from '../db';
import ipcEvents from '../constants/ipcEvents.json';

const AddPrepaid = () => {
  const history = useHistory();

  const onSubmit = async (data: IPrepaid) => {
    await ipcRenderer.invoke(ipcEvents.CREATE_PREPAID, data);
    // history.push(`/prepaid/${prepaid._id}`);
    history.push(`/prepaid/all`);
  };
  return (
    <Box>
      <BackButton />
      <Heading>Add Prepaid</Heading>
      <PrepaidForm onSubmitted={onSubmit} />
    </Box>
  );
};

export default AddPrepaid;
