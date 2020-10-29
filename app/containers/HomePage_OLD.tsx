import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/core';

import Aside from '../components/Aside';
import AddMemberForm from './AddMemberForm';
import Members from './Members';
// import routes from '../constants/routes.json';

const Home: React.FC = () => {
  console.log('YOYOYO!');
  return (
    <Box w="100%" h="100vh">
      <Flex>
        <Box w="15.5vw" h="100vh">
          <Aside />
        </Box>
        <Box h="100vh" width="83.5vw" backgroundColor="gray.50" p={8}>
          <Switch>
            <Route exact path="/members" component={Members} />
            <Route exact path="/members/add" component={AddMemberForm} />
            <Redirect from="/" to="/members" exact />
          </Switch>
        </Box>
      </Flex>
    </Box>
  );
};

export default Home;
