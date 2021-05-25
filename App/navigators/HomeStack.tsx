import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Home from '../screens/Home'
import defaultStackOptions from './defaultStackOptions'

const Stack = createStackNavigator()

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={defaultStackOptions}>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  )
}

export default HomeStack