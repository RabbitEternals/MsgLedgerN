import {InteractionObject, Pact} from "@pact-foundation/pact";
import {pactWith} from "jest-pact";
import {loadMessages, createMessage} from '../../api/apiCalls';
import {like, term} from "@pact-foundation/pact/src/dsl/matchers";
import axios from "axios";

pactWith(
  {consumer: 'ledgerm', provider: 'guestLedgerM', cors: true},
  (provider: Pact) => {
    describe("Get messages", () => {
      const page = 1;
      const pageData = [
        {email: "msg@msg.com2", message: "hello people2"},
        {email: "msg@msg.com3", message: "hello people3"},
        {email: "msg@msg.com4", message: "hello people4"},
        {email: "msg@msg.com5", message: "hello people5"},
        {email: "msg@msg.com6", message: "hello people6"},
        {email: "msg@msg.com7", message: "hello people7"},
        {email: "msg@msg.com8", message: "hello people8"},
        {email: "msg@msg.com9", message: "hello people9"},
        {email: "msg@msg.com10", message: "hello people20"},
        {email: "msg@msg.com11", message: "hello people11"},
      ];
      beforeEach(() => {
        const interaction: InteractionObject = {
          state: 'The are messages',
          uponReceiving: 'a get request to get messages',
          withRequest: {
            method: 'GET',
            path: term({
              generate: `/list`,
              matcher: '/list'
            }),
            query: `page=${page}`,
            /*headers: {
              Accept: 'application/json; charset=utf-8'
            }*/
          },
          willRespondWith: {
            status: 200,
            body: like(pageData),
            headers: {'Content-Type': 'application/json'}
          }
        };
        return provider.addInteraction(interaction);
      });
      it('Given page When request loadData Then should return emails and messages', async () => {
        axios.defaults.baseURL = provider.mockService.baseUrl;
        await loadMessages(page);
      });
    });
    describe("Create message", () => {
      const createData = {
        email: "acTest@mail.com",
        message: "acTest message"
      };
      beforeEach(() => {
        const interaction: InteractionObject = {
          state: 'There are message to save',
          uponReceiving: 'a post request to save message',
          withRequest: {
            method: 'POST',
            path: term({
              generate: `/create`,
              matcher: '/create'
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            body: createData
          },
          willRespondWith: {
            status: 200,
            body: "200",
            headers: {'Content-Type': 'application/json'}
          }
        };
        return provider.addInteraction(interaction);
      });
      it('Given message When request create Then should return status OK', async () => {
        axios.defaults.baseURL = provider.mockService.baseUrl;
        await createMessage(createData);
      });
    });
  });

