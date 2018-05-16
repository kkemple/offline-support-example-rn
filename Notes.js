import React from 'react';
import {
  Alert,
  AsyncStorage,
  Button,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import ConnectionState from './components/ConnectionState';
import CachedImage from './components/CachedImage';

export default class Notes extends React.Component {
  state = {
    notes: [],
    value: '',
  };

  componentWillMount = async () => {
    const notes = await AsyncStorage.getItem('@notes');

    if (notes) {
      this.setState(() => ({ notes: JSON.parse(notes) }));
    }
  };

  _onTextChange = input => {
    this.setState(({ value }) => ({ value: input }));
  };

  _saveNote = () => {
    const note = this.state.value;
    const notes = [...this.state.notes, note];
    this.setState(() => ({ notes, value: '' }));

    try {
      AsyncStorage.setItem('@notes', JSON.stringify(notes));
    } catch (error) {
      notes.pop();
      this.setState(() => ({ notes, value: note }));
      Alert.alert(`Failed to save note: ${error.message}`);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        <ConnectionState />

        <CachedImage
          style={styles.image}
          source={{
            uri: 'https://images.unsplash.com/photo-1515285143317-784290b9489a',
          }}
        />

        <Text style={styles.title}>Notes</Text>

        <TextInput
          autoFocus
          style={styles.textInput}
          value={this.state.value}
          onChangeText={this._onTextChange}
        />

        <View style={styles.button}>
          <Button title="SAVE NOTE" onPress={this._saveNote} color="#ffffff" />
        </View>

        <ScrollView style={styles.notes}>
          {this.state.notes.map(note => (
            <Text key={note} style={styles.note}>
              {`- ${note}`}
            </Text>
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 36,
  },
  image: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.4,
  },
  title: {
    fontSize: 24,
    color: '#ffffff',
    marginTop: 24,
  },
  notes: {
    flex: 0,
    maxHeight: 400,
    borderWidth: 1,
    borderColor: '#ffffff',
    width: '100%',
    padding: 16,
  },
  note: {
    color: '#ffffff',
    marginBottom: 8,
  },
  textInput: {
    borderBottomColor: '#ffffff',
    borderBottomWidth: 1,
    width: '100%',
    color: '#ffffff',
    marginTop: 'auto',
  },
  button: {
    padding: 4,
    borderWidth: 1,
    borderColor: '#ffffff',
    marginBottom: 'auto',
    marginTop: 16,
  },
});
