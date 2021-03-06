/* eslint-disable react/prefer-stateless-function */
/*
 * Copyright 2018 Expedia Group
 *
 *         Licensed under the Apache License, Version 2.0 (the "License");
 *         you may not use this file except in compliance with the License.
 *         You may obtain a copy of the License at
 *
 *             http://www.apache.org/licenses/LICENSE-2.0
 *
 *         Unless required by applicable law or agreed to in writing, software
 *         distributed under the License is distributed on an "AS IS" BASIS,
 *         WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *         See the License for the specific language governing permissions and
 *         limitations under the License.
 */

import React from 'react';
import { withRouter} from 'react-router';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';

// layout elements
import Header from '../layout/slimHeader';
import Footer from '../layout/footer';

// universal search view
import Tabs from './tabs/tabs';
import SearchBar from './searchBar/searchBar';
import { convertUrlQueryToSearch } from './utils/urlUtils';
import linkBuilder from '../../utils/linkBuilder';

// styling
import './universalSearch.less';

// SSO timeout modal
import authenticationStore from '../../stores/authenticationStore';
import AuthenticationTimeoutModal from '../layout/authenticationTimeoutModal';

// Root component for universal search
// deserialize location to create search object
// search object contains all the information to trigger any search for any subsystem in tabs
// flow search object to all the child modules, child components should not deserialize location
//
// LegacyHeader creates search object and pushes it in URL and that triggers receiveProps for UniversalSearch,
// which in turn re-triggers all tabs
@observer
class UniversalSearch extends React.Component {
    static DEFAULT_TIME_WINDOW = '1h';

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    // if no time window specified, default to last DEFAULT_TIME_WINDOW
    static createSearch(urlQuery) {
        const search = convertUrlQueryToSearch(urlQuery);

        if (!search.time) {
            search.time = { preset: UniversalSearch.DEFAULT_TIME_WINDOW };
        }

        return search;
    }

    constructor(props) {
        super(props);
        this.state = {search: UniversalSearch.createSearch(props.location.search)};
        this.handleSearch = this.handleSearch.bind(this);
        this.handleTabSelection = this.handleTabSelection.bind(this);
    }

    // on update of url query, update the search object
    componentWillReceiveProps(nextProps) {
        this.setState({search: UniversalSearch.createSearch(nextProps.location.search)});
    }

    // on update of search in search-bar,
    // convert search to url query string and push to browser history
    handleSearch(search) {
        this.props.history.push(linkBuilder.universalSearchLink(search));
    }

    // on update of search in search-bar,
    // convert search to url query string and push to browser history
    handleTabSelection(tabId) {
        this.props.history.push(linkBuilder.universalSearchLink({...this.state.search, tabId}));
    }

    // on load, render search bar and tabs
    // on updation of query, re-render tabs
    render() {
        const { history, location } = this.props;
        const { search } = this.state;

        return (
            <article className="universal-search-panel">
                {window.haystackUiConfig.enableSSO && authenticationStore.timedOut ? <AuthenticationTimeoutModal /> : null}
                <Header/>
                <SearchBar search={search} handleSearch={this.handleSearch} />
                <Tabs search={search} handleTabSelection={this.handleTabSelection} history={history} location={location} />
                <Footer/>
            </article>
        );
    }
}

export default withRouter(UniversalSearch);
