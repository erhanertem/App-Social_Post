/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import { Component } from 'react';
import { useParams } from 'react-router-dom';

import Image from '../../../components/Image/Image';
import './SinglePost.css';

/**
 * Higher-order component that injects route parameters into the wrapped component.
 *
 * @param {React.ComponentType} Component - The component to wrap.
 * @returns {React.FC} A functional component that renders the wrapped component with route parameters.
 */
function withRouter(Component) {
  return (props) => {
    const params = useParams();
    return <Component {...props} params={params} />;
  };
}

class SinglePost extends Component {
  state = {
    title: '',
    author: '',
    date: '',
    image: '',
    content: '',
  };

  componentDidMount() {
    const postId = this.props.params.postId;
    fetch('http://localhost:8080/feed/post/' + postId)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch status');
        }
        return res.json();
      })
      .then((resData) => {
        this.setState({
          title: resData.post.title,
          author: resData.post.creator.name,
          image: 'http://localhost:8080/' + resData.post.imageUrl,
          date: new Date(resData.post.createdAt).toLocaleDateString('en-US'),
          content: resData.post.content,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <section className='single-post'>
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className='single-post__image'>
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

const SinglePostWithRouter = withRouter(SinglePost);
export default SinglePostWithRouter;
