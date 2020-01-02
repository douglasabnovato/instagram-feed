import React, { Component } from 'react';
import './Feed.css';

import more from '../assets/more.svg'; 
import like from '../assets/like.svg';
import comment from '../assets/comment.svg';
import send from '../assets/send.svg';
import image1 from '../assets/image-rocketseat.png'
import image2 from '../assets/image-semana-omnistack-7.jpg'

class Feed extends Component{
    render(){
        return(
            <section id="post-list">
                <article>
                    <header>
                        <div className="user-info">
                            <span>douglasabnovato</span>
                            <span className="place">Juiz de Fora, MG</span>
                        </div>
                        <img src={ more } alt="Mais" />
                    </header>

                    <img src={ image1 } alt="Rocketseat" />
                    
                    <footer>
                        <div className="actions">
                            <img src={like} alt="like" />
                            <img src={comment} alt="comment" />
                            <img src={send} alt="send" />
                        </div>
                        <strong>901 curtidas</strong>
                        <p>
                            Projeto Semana Omnistack 7.0
                            <span>#react #omnistack #rocketseat</span>
                        </p>
                    </footer>
                </article>
                <article>
                    <header>
                        <div className="user-info">
                            <span>douglasabnovato</span>
                            <span className="place">Juiz de Fora, MG</span>
                        </div>
                        <img src={ more } alt="Mais" />
                    </header>

                    <img src={ image2 } alt="semana-omnistack-7" />

                    <footer>
                        <div className="actions">
                            <img src={like} alt="like" />
                            <img src={comment} alt="comment" />
                            <img src={send} alt="send" />
                        </div>
                        <strong>1001 curtidas</strong>
                        <p>
                            Code Review da Semana Omnistack 7.0
                            <span>#react #omnistack #rocketseat</span>
                        </p>
                    </footer>
                </article>
            </section>
        );
    }
}
export default Feed;