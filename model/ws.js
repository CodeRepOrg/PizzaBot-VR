// Copyright 2020 João Pedro Poloni Ponce

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const Assistant = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

class WS {
    constructor(apikey, assistantId, url) {
        this.apikey = apikey;
        this.assistantId = assistantId;
        this.url = url;
        this.session = null;

        this.assistant = new Assistant({
            version: '2020-04-01',
            authenticator: new IamAuthenticator({
                apikey: this.apikey
            }),
            url: this.url
        });
    }

    getSession() {
        return new Promise((resolve, reject) => {
            this.assistant
                .createSession({
                    assistantId: this.assistantId
                })
                .then(sess => {
                    console.log('sess', JSON.stringify(sess))
                    resolve(sess.result.session_id)
                })
                .catch(err => reject(err));
        });
    }

    chat(payload) {
        return new Promise((resolve, reject) => {
            console.log(payload)
            if (payload.sessionId == undefined || payload.sessionId == null) {
                this.getSession()
                    .then(data => {
                        this.session = data;
                        console.log('session', data)
                        payload.sessionId = data
                        payload.assistantId = this.assistantId
                        this.assistant.message(payload)
                        .then(res => {
                            console.log(JSON.stringify(res))
                            res.result.output.sessionId = data
                            resolve(res.result.output)
                        })
                        .catch(err => {
                            console.error(JSON.stringify(err));
                            reject({ 'response_type': 'err', text: 'Tente novamente mais tarde' });
                        });
                    }).catch(error => {
                        console.error(JSON.stringify(error));
                        reject({ 'response_type': 'err', text: 'Volte mais tarde' })
                    })
            }
            else {
                payload.assistantId = this.assistantId;
                console.log(payload)
                this.assistant.message(payload)
                .then(res => {
                    console.log(JSON.stringify(res))
                    res.result.output.sessionId = payload.sessionId
                    resolve(res.result.output)
                })
                .catch(err => {
                    console.error(JSON.stringify(err));
                    reject({ 'response_type': 'err', text: 'Tente novamente mais tarde' });
                })
            }
        });
    }
}

module.exports = WS;