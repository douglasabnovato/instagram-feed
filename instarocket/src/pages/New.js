import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Image } from 'react-native'

export default class New extends Component {

    static navigationOptions = {
        headerTitle: "Nova publicação"
    };

    state = {
        author: "",
        place: "",
        description: "",
        hashtags: "",
    } 

    render() {
        return (
            <View style={ styles.container }>
                <TouchableOpacity style={ styles.selectButton } onPress={() => {}}>
                    <Text style={ styles.selectButtonText }>Selecionar Imagem</Text>
                </TouchableOpacity>

                <TextInput
                    style={style.input}
                    autoCorrect={false}
                    autoCapitalize="none"
                    placeholder="Nome do autor"
                    placeholderTextColor="#999"
                    value={this.state.author}
                    onChangeText={author => this.setState({ author })}
                />
                
                <TextInput
                    style={style.input}
                    autoCorrect={false}
                    autoCapitalize="none"
                    placeholder="Local da Foto"
                    placeholderTextColor="#999"
                    value={this.state.place}
                    onChangeText={author => this.setState({ author })}
                />
                
                <TextInput
                    style={style.input}
                    autoCorrect={false}
                    autoCapitalize="none"
                    placeholder="Descrição"
                    placeholderTextColor="#999"
                    value={this.state.description}
                    onChangeText={author => this.setState({ author })}
                />
                
                <TextInput
                    style={style.input}
                    autoCorrect={false}
                    autoCapitalize="none"
                    placeholder="Hadhtags"
                    placeholderTextColor="#999"
                    value={this.state.hashtags}
                    onChangeText={author => this.setState({ author })}
                />
                
                <TouchableOpacity style={ styles.shareButton } onPress={() => {}}>
                    <Text style={ styles.shareButtonText }>Compartilhar</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

