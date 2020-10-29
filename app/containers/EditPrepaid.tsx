/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { useHistory, useParams } from 'react-router';
import { Box, Heading, Flex, Spinner } from '@chakra-ui/core';

import PrepaidForm from '../components/PrepaidForm';
import BackButton from '../components/BackButton';
import { IPrepaid, IPrepaidDocument } from '../db';
import ipcEvents from '../constants/ipcEvents.json';

const EditPrepaid = () => {
  const [prepaid, setPrepaid] = useState<IPrepaidDocument | null>();
  const [isFetching, setIsFetching] = useState(false);
  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  const onSubmit = async (data: IPrepaid) => {
    await ipcRenderer.invoke(ipcEvents.UPDATE_PREPAID, { id, data });
    // history.push(`/prepaid/${prepaid._id}`);
    history.goBack();
  };

  useEffect(() => {
    const fetchPrepaid = async () => {
      // const isAuth = await ipcRenderer.invoke(ipcEvents.STAFF_LOGIN, data);
      setIsFetching(true);
      const resPrepaid: IPrepaidDocument = await ipcRenderer.invoke(
        ipcEvents.GET_PREPAID,
        id
      );
      setPrepaid(resPrepaid);
      setIsFetching(false);
    };
    fetchPrepaid();
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
      <Heading>Edit Prepaid</Heading>
      <PrepaidForm
        onSubmitted={onSubmit}
        prepaid={prepaid as IPrepaidDocument}
      />
    </Box>
  );
};

export default EditPrepaid;
