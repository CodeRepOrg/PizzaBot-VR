# Copyright 2020 João Pedro Poloni Ponce

# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at

#     http://www.apache.org/licenses/LICENSE-2.0

# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

FROM node:lts-alpine

WORKDIR /usr/app

COPY . /usr/app

RUN npm install

ENV APIKEY=
ENV ASSISTANTID=
ENV URL=
ENV VR_APIKEY=
ENV VR_URL=
ENV VR_CLASSIFIER=

CMD ["npm", "start"]