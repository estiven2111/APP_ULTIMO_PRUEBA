import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, Keyboard } from 'react-native';

import { AuthContext} from "./context/context"
import api from "../api/api"
import AsyncStorage from "@react-native-async-storage/async-storage";
const SearchBar = () => {
  const {finalValue, searchText, globalSearch, showOptions, globalOptions} = useContext(AuthContext)
  // const [searchText, setSearchText] = useState('');
  const [options, setOptions] = useState([]);
  // const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    finalValue("")
  },[])

  useEffect(() => {
    const fetchOptions = async () => {
      console.log( "variables de search", searchText, options, showOptions, finalValue)

      try {
        const user_name = await AsyncStorage.getItem("name");
        const email = await AsyncStorage.getItem("email");
        const response = await api.get(`/proyect?search=${searchText}&email=${email}`);
        const data = await response.data;
        setOptions(data.map(pro => pro.proyecto));
        globalOptions(true);
      } catch (error) {
        console.error(error);
      }
    };

    if (searchText === '') {
      globalOptions(false);
    } else if (!options.includes(searchText)) { 
      fetchOptions();
    }
    
  }, [searchText]);

  const handleSearch = (text) => {
    if (text !== searchText) {
        globalSearch(text);
        globalOptions(true);
      } else {
        globalOptions(false); 
      }
    };
    
    const renderOption = ({ item }) => (
      <TouchableOpacity onPress={() => handleSelectOption(item)}>
      <Text style={styles.option}>{item}</Text>
    </TouchableOpacity>
  );
  
  const handleSelectOption = (option) => {
    Keyboard.dismiss();
    globalSearch(option);
    finalValue(option)
    globalOptions(false);
    
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={searchText}
        onChangeText={handleSearch}
        placeholder="Busca el Proyecto o sin Proyecto"
        placeholderTextColor="grey"
      />
      {showOptions && (
        <View style={styles.modalContainer}>
          <FlatList
            data={options}
            renderItem={renderOption}
            keyExtractor={(item) => item}
          />
        </View>
      )}
    </View>
  );
};

const styles = {
  container: {
    marginHorizontal: 5,
    marginTop: -30,
    
    
  },
  input: {
    height: 40,
    borderWidth: 1,
    backgroundColor: "rgb(210,210,210)",
    borderColor: "rgb(120,120,120)",
    padding: 10,
    borderRadius: 10
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  option: {
    padding: 10,
  },
};

export default SearchBar;
