import React, { useEffect, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useAnimatedValue } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const Cep = () => {
  const [loaded, error] = useFonts({ 'Nunito-Regular': require('./assets/fonts/Nunito-Regular.ttf'), 'Nunito-Bold': require('./assets/fonts/Nunito-Bold.ttf') });
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [street, setStreet] = useState('');
  const [message, setMessage] = useState(<Text></Text>);
  const [resultCEPs, setResultCEPs] = useState([]);
  const scaleAnimation = useAnimatedValue(0.9);
  const opacityAnimation = useAnimatedValue(0);
  const animatedStyles = {
    transform: [{ scale: scaleAnimation }],
    opacity: opacityAnimation
  }

  // Handle font load
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Handle animations
  useEffect(() => {
    scaleAnimation.setValue(0.9);
    opacityAnimation.setValue(0);
    Animated.parallel([
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  }, [resultCEPs]);

  const searchCEP = async () => {
    const regex = /\b(av|r)\b/i;

    if (!state || !city || !street) {
      setMessage(<Text style={styles.alert}>Preencha todas as informações!</Text>);
      return;
    }

    if (regex.test(street)) {
      setMessage(<Text style={styles.alert}>Escreva 'Avenida' ou 'Rua' sem abreviações</Text>);
      return;
    }

    const urlToFetch = `https://viacep.com.br/ws/${state}/${city}/${street}/json/`;
    let result = [];
    setResultCEPs([]);
    setMessage(<Text style={styles.txt}>Pesquisando...</Text>);

    try {
      await fetch(urlToFetch)
        .then(Response => Response.json())
        .then((Response) => {
          if (Response != '') {
            Response.forEach((element: { cep: string; bairro: string; }) => {
              const CEPAndNeighborhood = `${element.cep} | ${element.bairro}`;
              result.push(CEPAndNeighborhood);
            });
            setMessage(<Text style={styles.txt}>Os possíveis CEP's são:</Text>);
            setResultCEPs(result);
          } else {
            setMessage(<Animated.Text style={[styles.error, animatedStyles]}>Sem resultados</Animated.Text>)
          }
        })
    } catch (error) {
      setMessage(<Animated.Text style={[styles.error, animatedStyles]}>Erro na consulta! Favor verificar as informações.</Animated.Text>)
    }
  }

  return (
    <ScrollView contentContainerStyle={{
      width: '100%',
      padding: 10,
      paddingTop: 20,
      alignSelf: 'center',
      gap: 10
    }}>
      <Text style={styles.titles}>Qual meu CEP?</Text>
      <TextInput style={styles.input} placeholder='Cidade' onChangeText={(value) => setCity(value)} />
      <TextInput style={styles.input} placeholder='UF (Ex. SP)' onChangeText={(value) => setState(value)} />
      <TextInput style={styles.input} placeholder='Logradouro (Ex. Avenida M 25)' onChangeText={(value) => setStreet(value)} />
      <TouchableOpacity style={styles.btn} onPress={searchCEP}><Text style={styles.btnTxt}>Pesquisar</Text></TouchableOpacity>
      {message}
      {resultCEPs.map((cep, index) => (
        <Animated.Text style={[styles.cepBox, animatedStyles]} key={index}>{cep}</Animated.Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: 'lightgreen',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5
  },
  btnTxt: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
  },
  input: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    padding: 12,
    borderWidth: 2,
    borderColor: 'lightgreen',
    borderRadius: 5
  },
  titles: {
    fontFamily: 'Nunito-Bold',
    fontSize: 25,
  },
  txt: {
    fontFamily: 'Nunito-Regular',
    fontSize: 18,
  },
  cepBox: {
    fontFamily: 'Nunito-Regular',
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5
  },
  error: {
    fontFamily: 'Nunito-Bold',
    backgroundColor: 'lightcoral',
    padding: 10,
    borderRadius: 5
  },
  alert: {
    fontFamily: 'Nunito-Bold',
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5
  }
});

export default Cep;