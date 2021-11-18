import React, { Component } from 'react'
import { View, Image, TouchableOpacity } from 'react-native';
import api from '../services/api';

import camera from "../assets/camera.svg";

export default class Feed extends Component {
    
    static navigationOptions = ({ navigation }) => ({
        headerRight: (
            <TouchableOpacity style={{ marginRight: 20 }} onPress={() => navigation.navigate("New")} >
                <Image source={camera}/>
            </TouchableOpacity>
        ),
    });

    state = {
        feed: [],
    };

    async componentDidMount(){
        this.registerToSocket();
        const response = await api.get('posts');
        this.setState({ feed: response.data });
    }
    
    render() {
        return (
            <View/>
        )
    }

}
