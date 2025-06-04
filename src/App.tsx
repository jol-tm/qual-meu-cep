import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Cep from './Cep';

const App = () => {
  return (
    <>
      <Cep />
      <StatusBar style="auto" />
    </>
  );
}

export default App;