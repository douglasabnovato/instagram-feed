import React, { Component } from 'react';
import './Feed.css';
import api from '../services/api';

import more from '../assets/more.svg'; 
import like from '../assets/like.svg';
import comment from '../assets/comment.svg';
import send from '../assets/send.svg';
import image1 from '../assets/image-rocketseat.png'
import image2 from '../assets/image-semana-omnistack-7.jpg'

class Feed extends Component{

    state = {
        feed: [],
    };

    async componentDidMount(){

        const response = await api.get('posts');
        this.setState({ feed: response.data });

    }

    render(){
        return(
            <section id="post-list">
                {this.state.feed.map(post => (
                    <article>
                        <header>
                            <div className="user-info">
                                <span>{post.author}</span>
                                <span className="place">{post.place}</span>
                            </div>
                            <img src={ more } alt="Mais" />
                        </header>

                        <img src={`http://localhost:3333/files/${post.image}`} alt="Rocketseat" />
                        
                        <footer>
                            <div className="actions">
                                <img src={like} alt="like" />
                                <img src={comment} alt="comment" />
                                <img src={send} alt="send" />
                            </div>
                            <strong>{post.likes} curtidas</strong>
                            <p>
                                {post.description}
                                <span>{post.hashtags}</span>
                            </p>
                        </footer>
                    </article>
                ))}
            </section>
        );
    }
}
export default Feed;