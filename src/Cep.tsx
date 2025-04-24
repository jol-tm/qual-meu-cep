import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const Cep = () => {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [street, setStreet] = useState('');
  const [message, setMessage] = useState(<Text></Text>);
  const [resultCEPs, setResultCEPs] = useState([]);

  const searchCEP = async () => {
    const urlToFetch = `https://viacep.com.br/ws/${state}/${city}/${street}/json/`;
    let result = [];
    setResultCEPs([]);

    try {
      await fetch(urlToFetch)
        .then(Response => Response.json())
        .then((Response) => {
          if (Response != '') {
            console.log(Response);
            Response.forEach((element: { cep: string; bairro: string; }) => {
              const CEPAndNeighborhood = `${element.cep} | ${element.bairro}`;
              result.push(CEPAndNeighborhood);
            });
            setMessage(<Text style={styles.txt}>Os possíveis CEP's são:</Text>);
            setResultCEPs(result);
          } else {
            setMessage(<Text style={styles.error}>Sem resultados</Text>)
          }
        })
    } catch (error) {
      setResultCEPs([]);
      setMessage(<Text style={styles.error}>Erro na consulta! Favor verificar as informações.</Text>)
    }
  }

  return (
    <ScrollView contentContainerStyle={{ width: 300, gap: 10 }}>
      <Text style={styles.titles}>Qual meu CEP?</Text>
      <TextInput style={styles.input} placeholder='Cidade' onChangeText={(value) => setCity(value)} />
      <TextInput style={styles.input} placeholder='UF (Ex. SP)' onChangeText={(value) => setState(value)} />
      <TextInput style={styles.input} placeholder='Logradouro (Ex. Avenida M 25)' onChangeText={(value) => setStreet(value)} />
      <Button title='Buscar' color={'lightgreen'} onPress={searchCEP} />
      {message}
      {resultCEPs.map((cep, index) => (
        <Text style={styles.cepBox} key={index}>{cep}</Text>
      ))}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  input: {
    fontSize: 20,
    padding: 10,
    borderWidth: 2,
    borderColor: 'lightgreen',
    borderRadius: 5
  },
  titles: {
    fontSize: 25,
    fontWeight: '900',
  },
  txt: {
    fontSize: 18,
    fontWeight: 700,
  },
  cepBox: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5
  },
  error: {
    fontWeight: '900',
    backgroundColor: 'lightcoral',
    padding: 10,
    borderRadius: 5
  }
});

export default Cep;