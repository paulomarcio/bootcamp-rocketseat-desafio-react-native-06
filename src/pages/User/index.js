import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
      setOptions: PropTypes.func,
    }).isRequired,
    route: PropTypes.shape({
      params: PropTypes.shape(),
    }).isRequired,
  };

  state = {
    stars: [],
    user: {},
    loading: true,
    nextPage: 1,
    pageCount: 1,
    per_page: 5,
  };

  async componentDidMount() {
    const { navigation, route } = this.props;
    const { nextPage, per_page } = this.state;
    const { user } = route.params;
    const response = await api.get(`/users/${user.login}/starred`, {
      params: {
        page: nextPage,
        per_page,
      },
    });
    const { link } = response.headers;
    const { page } = this.parseHeaderLink(link);

    await this.setState({
      stars: response.data,
      user,
      loading: false,
      nextPage: nextPage + 1,
      pageCount: page,
    });

    navigation.setOptions({ title: user.name });
  }

  loadMore = async () => {
    const { nextPage, pageCount, per_page, user, stars } = this.state;
    const response = await api.get(`/users/${user.login}/starred`, {
      params: {
        page: nextPage,
        per_page,
      },
    });

    if (nextPage <= pageCount) {
      await this.setState({
        nextPage: nextPage + 1,
        stars: [...stars, ...response.data],
      });
    }
  };

  parseHeaderLink = link => {
    const paginationArray = link.split(',');
    const lastPaginationLink = paginationArray[paginationArray.length - 1];
    const lastPaginationLinkArray = lastPaginationLink.split(';');
    const paginationURL = lastPaginationLinkArray[0]
      .replace('<', '')
      .replace('>', '');
    const urlElementsArray = paginationURL.split('?');
    const queryString = urlElementsArray[1];
    const queryStringArray = queryString.split('&');
    const params = {};

    for (let i = 0; i < queryStringArray.length; i += 1) {
      const keys = queryStringArray[i].split('=');
      const [key, value] = keys;
      params[key] = value;
    }

    return params;
  };

  render() {
    const { stars, user, loading } = this.state;
    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <ActivityIndicator color="#7159c1" />
        ) : (
          <Stars
            data={stars}
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMore}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}
