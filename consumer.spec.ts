import {InteractionObject, Pact} from "@pact-foundation/pact";
import {pactWith} from "jest-pact";
import {loadMessages, createMessage} from './api/apiCalls';
import {like, term} from "@pact-foundation/pact/src/dsl/matchers";

pactWith(
    {consumer: 'ledgerm', provider: 'guestLedgerM'},
    (provider: Pact) => {
        describe("Get messages", () => {
            const page = 1;
            const pageData = [
                {email: "test@mail.com5", message: "test message5"},
                {email: "test@mail.com", message: "test message"},
                {email: "test@mail.com3", message: "test message3"},
                {email: "test@mail.com4", message: "test message4"},
                {email: "test@mail.com4", message: "test message4"},
                {email: "test@mail.com2", message: "test message2"},
                {email: "msg@msg.com6", message: "hello people"},
                {email: "msg@msg.com5", message: "hello people"},
                {email: "msg@msg.com2", message: "hello people"},
                {email: "msg@msg.com9", message: "hello people"}
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
                        query: `page=${like(page)}`,
                        headers: {
                            Accept: 'application/json; charset=utf-8'
                        }
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
                process.env.apiBaseUrl = "http://localhost:8080"
                    //provider.mockService.baseUrl;
                console.log("XXX "+ process.env.apiBaseUrl);
                await loadMessages(page);
            });
        });
        describe("Create message", () => {
            const createData = {
                "email": "msg@msg.com12",
                "message": "hello people"
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
                            'Content-Type': 'application/json;charset=utf-8',
                        },
                        body: like(createData)
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
                process.env.apiBaseUrl = provider.mockService.baseUrl;
                await createMessage(createData);
            });
        });
    });

