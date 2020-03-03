import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Main from './pages/Main';
import User from './pages/User';

const Stack = createStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: '#7159c1' },
          headerTintColor: '#fff',
          headerBackTitle: false,
        }}
      >
        <Stack.Screen
          name="home"
          options={{ title: 'Usuários do GitHub' }}
          component={Main}
        />
        <Stack.Screen
          name="user"
          options={{ title: 'Detalhes' }}
          component={User}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
