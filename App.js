import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { AppLoading, FileSystem, Asset } from 'expo';
import sha256 from 'crypto-js/sha256';

import Notes from './Notes';

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      let name = sha256(image);
      let filepath = `${FileSystem.documentDirectory}${name}.png'`;

      return FileSystem.downloadAsync(image, filepath);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default class App extends React.Component {
  state = {
    loaded: false,
  };

  _precache = async () => {
    const imageAssets = cacheImages([
      'https://images.unsplash.com/photo-1515285143317-784290b9489a',
      // require('./assets/images/circle.jpg'),
    ]);

    await Promise.all(imageAssets);
  };

  render() {
    return this.state.loaded ? (
      <Notes />
    ) : (
      <AppLoading
        startAsync={this._precache}
        onFinish={() => this.setState({ loaded: true })}
        onError={console.warn}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
