/* Feed do app: lista posts, recebe novos posts e curtidas em tempo real e permite curtir */
import React, { Component } from "react";
import io from "socket.io-client";
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import api from "../services/api";
import { API_URL } from "../config";
import camera from "../assets/camera.png";
import more from "../assets/more.png";
import like from "../assets/like.png";
import comment from "../assets/comment.png";
import send from "../assets/send.png";

/* Insere ou substitui um post (antes o map sem return apagava o feed a cada curtida) */
export function upsert(feed, post) {
  return feed.some((p) => p._id === post._id) ? feed.map((p) => (p._id === post._id ? post : p)) : [post, ...feed];
}

export default class Feed extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: () => (
      <TouchableOpacity style={{ marginRight: 20 }} onPress={() => navigation.navigate("New")} accessibilityRole="button" accessibilityLabel="Nova publicação">
        <Image source={camera} />
      </TouchableOpacity>
    ),
  });

  state = { feed: [], loading: true, error: "" };

  /* Conecta ao tempo real e carrega o feed */
  async componentDidMount() {
    this.socket = io(API_URL);
    this.socket.on("post", (p) => this.setState(({ feed }) => ({ feed: upsert(feed, p) })));
    this.socket.on("like", (p) => this.setState(({ feed }) => ({ feed: upsert(feed, p) })));
    try {
      const { data } = await api.get("posts");
      this.setState({ feed: data, loading: false });
    } catch {
      this.setState({ loading: false, error: "Não foi possível carregar o feed." });
    }
  }

  /* Fecha o socket ao sair da tela */
  componentWillUnmount() {
    if (this.socket) this.socket.disconnect();
  }

  /* Curte o post */
  handleLike = async (id) => {
    try {
      const { data } = await api.post(`/posts/${id}/like`);
      this.setState(({ feed }) => ({ feed: upsert(feed, data) }));
    } catch {
      this.setState({ error: "Não foi possível curtir agora." });
    }
  };

  render() {
    const { feed, loading, error } = this.state;
    return (
      <View style={styles.container}>
        {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
        {error ? <Text style={styles.error} accessibilityRole="alert">{error}</Text> : null}
        <FlatList
          data={feed}
          keyExtractor={(post) => post._id}
          ListEmptyComponent={!loading && !error ? <Text style={styles.empty}>Nenhuma publicação ainda.</Text> : null}
          renderItem={({ item }) => (
            <View style={styles.feedItem}>
              <View style={styles.feedItemHeader}>
                <View>
                  <Text style={styles.name}>{item.author}</Text>
                  {item.place ? <Text style={styles.place}>{item.place}</Text> : null}
                </View>
                <Image source={more} />
              </View>
              <Image style={styles.feedImage} source={{ uri: item.image_url }} accessibilityLabel={`Foto de ${item.author}`} />
              <View style={styles.feedItemFooter}>
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.action} onPress={() => this.handleLike(item._id)} accessibilityRole="button" accessibilityLabel={`Curtir a foto de ${item.author}`}>
                    <Image source={like} />
                  </TouchableOpacity>
                  <Image style={styles.action} source={comment} />
                  <Image style={styles.action} source={send} />
                </View>
                <Text style={styles.likes}>{item.likes} {item.likes === 1 ? "curtida" : "curtidas"}</Text>
                {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
                {item.hashtags ? <Text style={styles.hashtags}>{item.hashtags}</Text> : null}
              </View>
            </View>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  error: { color: "#b3261e", margin: 15 },
  empty: { color: "#555", margin: 15 },
  feedItem: { marginTop: 20 },
  feedItemHeader: { paddingHorizontal: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { fontSize: 14, color: "#000", fontWeight: "bold" },
  place: { fontSize: 12, color: "#555", marginTop: 2 },
  feedImage: { width: "100%", height: 400, marginVertical: 15 },
  feedItemFooter: { paddingHorizontal: 15 },
  actions: { flexDirection: "row", alignItems: "center" },
  action: { marginRight: 8, padding: 4 },
  likes: { marginTop: 15, fontWeight: "bold", color: "#000" },
  description: { lineHeight: 18, color: "#000" },
  hashtags: { color: "#5b45b0" },
});
/* Fim de Feed.js */
