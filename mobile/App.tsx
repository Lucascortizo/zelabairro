import { type JSX } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NAV_THEME } from './theme';
import { RootStackParamList } from './types';
import LoginScreen from './screens/LoginScreen';
import HomeTabs from './navigation/HomeTabs';
import DetalheOcorrenciaScreen from './screens/DetalheOcorrenciaScreen';

// STACK: uma tela por cima da outra. É a raiz do app
const Stack = createNativeStackNavigator<RootStackParamList>();

const App = (): JSX.Element => {
  return (
    <NavigationContainer theme={NAV_THEME}>
      <StatusBar style="light" />
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeTabs} options={{ headerShown: false }} />
        <Stack.Screen name="DetalheOcorrencia" component={DetalheOcorrenciaScreen} options={{ title: 'Ocorrência' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
