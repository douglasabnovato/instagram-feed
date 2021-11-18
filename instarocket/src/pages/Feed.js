import React, { Component } from 'react'
import { View, Image, TouchableOpacity } from 'react-native';

import camera from "../assets/camera.svg";

export default class Feed extends Component {
    
    static navigationOptions = {
        headerRight: (
            <TouchableOpacity style={{ marginRight: 20 }} onPress={() => {}} >
                <Image source={camera}/>
            </TouchableOpacity>
        ),
    };
    
    render() {
        return (
            <View/>
        )
    }

}
