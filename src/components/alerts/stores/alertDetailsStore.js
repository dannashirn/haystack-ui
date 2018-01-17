/*
 * Copyright 2017 Expedia, Inc.
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
import axios from 'axios';
import {observable, action} from 'mobx';
import { fromPromise } from 'mobx-utils';

function AlertsException(data) {
    this.message = 'Unable to resolve promise';
    this.data = data;
}

export class AlertDetailsStore {
    @observable alertDetails = null;
    @observable promiseState = null;

    @action fetchAlertDetails(alertId) {
        this.promiseState = fromPromise(
            axios
                .get(`/api/alert/${alertId}`)
                .then((result) => {
                    this.alertDetails = result.data;
                })
                .catch((result) => {
                    throw new AlertsException(result);
                })
        );
    }
}

export default new AlertDetailsStore();
