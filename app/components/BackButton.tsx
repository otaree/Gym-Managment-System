import React from 'react';
import { useHistory } from 'react-router';
import { IconButton } from '@chakra-ui/core';

const BackButton = () => {
  const history = useHistory();

  return (
    <IconButton
      variant="ghost"
      icon="arrow-back"
      aria-label="back"
      size="lg"
      onClick={() => history.goBack()}
    />
  );
};

export default BackButton;
