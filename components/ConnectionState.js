import React from 'react';
import { Animated, StyleSheet, Text, View, NetInfo } from 'react-native';

const resolveConnectionStatus = type => {
  switch (type) {
    case 'none':
    case 'unknown':
      return false;
    case 'cellular':
    case 'wifi':
      return true;
  }
};

export default class ConnectionState extends React.Component {
  state = {
    isOnline: true,
    animatedValue: new Animated.Value(0),
  };

  componentWillMount = async () => {
    const initialConnectionState = await NetInfo.getConnectionInfo();

    this.setState(() => ({
      isOnline: resolveConnectionStatus(initialConnectionState.type),
    }));

    this._netInfoListener = NetInfo.addEventListener(
      'connectionChange',
      info => {
        this.setState(() => ({ isOnline: resolveConnectionStatus(info.type) }));
      },
    );

    // set up animation interpolation
    this._topAnimation = this.state.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-100, 0],
      extrapolate: 'clamp',
    });
  };

  componentWillUnmount = () => {
    NetInfo.removeEventListener(this._netInfoListener);
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (!this.state.isOnline && prevState.isOnline) {
      // we lost internet connect :(
      Animated.spring(this.state.animatedValue, {
        toValue: 1,
        duration: 250,
      }).start();
    }

    if (this.state.isOnline && !prevState.isOnline) {
      // we have internet!
      Animated.spring(this.state.animatedValue, {
        toValue: 0,
        duration: 250,
      }).start();
    }
  };

  render() {
    return (
      <Animated.View style={[styles.container, { top: this._topAnimation }]}>
        <Text style={styles.message}>You are currently offline.</Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: 100,
    width: '100%',
    backgroundColor: 'red',
    top: -100,
  },
  message: {
    fontSize: 12,
    color: '#ffffff',
  },
});
