import { type JSX } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../types';
import { IconeOcorrencias, IconeLixeiras, IconeNova } from '../components/TabIcons';
import BotaoSair from '../components/BotaoSair';
import OcorrenciasScreen from '../screens/OcorrenciasScreen';
import LixeirasScreen from '../screens/LixeirasScreen';
import NovaOcorrenciaScreen from '../screens/NovaOcorrenciaScreen';

// TABS: barra fixa embaixo, uma seção por tab. O SAIR fica no header de todas
const Tab = createBottomTabNavigator<TabParamList>();

const HomeTabs = (): JSX.Element => {
  return (
    <Tab.Navigator screenOptions={{ headerRight: () => <BotaoSair /> }}>
      <Tab.Screen
        name="Ocorrencias"
        component={OcorrenciasScreen}
        options={{ title: 'Ocorrências', tabBarIcon: IconeOcorrencias }}
      />
      <Tab.Screen
        name="Lixeiras"
        component={LixeirasScreen}
        options={{ title: 'Lixeiras', tabBarIcon: IconeLixeiras }}
      />
      <Tab.Screen
        name="NovaOcorrencia"
        component={NovaOcorrenciaScreen}
        options={{ title: 'Nova ocorrência', tabBarLabel: 'Nova', tabBarIcon: IconeNova }}
      />
    </Tab.Navigator>
  );
};

export default HomeTabs;
