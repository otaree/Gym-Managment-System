import React from 'react';
import { Box, Flex } from '@chakra-ui/core';

import Aside from './Aside';

// eslint-disable-next-line react/prop-types
const Home: React.FC = ({ children }) => {
  return (
    <Box w="100%" h="100vh">
      <Flex>
        <Box w="15.5vw" h="100vh">
          <Aside />
        </Box>
        <Box h="100vh" width="83.5vw" backgroundColor="gray.50" p={8}>
          {children}
        </Box>
      </Flex>
    </Box>
  );
};

export default Home;
