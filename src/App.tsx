import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Cep from './Cep';

const App = () => {
  return (
    <View style={styles.container}>
      <Cep />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
});

export default App;