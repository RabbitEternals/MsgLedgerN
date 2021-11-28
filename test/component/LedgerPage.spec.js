import {render, screen, waitFor} from "@testing-library/vue";
import LedgerPage from "../../pages/LedgerPage";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import {rest} from "msw";
import {setupServer} from "msw/node";

let requestBody;
let counter = 0;

const server = setupServer(
    rest.get("/list", (req, res, ctx) => {
        let page = Number.parseInt(req.url.searchParams.get("page")) - 1;
        return res(ctx.status(200), ctx.json(pageData.slice(page * 10, (page * 10) + 10)));
    }),
    rest.post("/create", (req, res, ctx) => {
        requestBody = req.body;
        counter += 1;
        return res(ctx.status(200), ctx.json("200"));
    })
);

beforeAll(() => server.listen());
beforeEach(() => {
    counter = 0;
    server.resetHandlers();
});
afterAll(() => server.close());


describe("Ledger Page", () => {
    describe("Layout", () => {
        it("has email input", () => {
            render(LedgerPage);
            const input = screen.queryByLabelText("Email");
            expect(input).toBeInTheDocument();
        });
        it("has message input", () => {
            render(LedgerPage);
            const input = screen.queryByLabelText("Message");
            expect(input).toBeInTheDocument();
        });
        it("has button input", () => {
            render(LedgerPage);
            const button = screen.queryByRole("button", {name: "Add"});
            expect(button).toBeInTheDocument();
        });
    });
    describe("Interactions", () => {
        it("initially displays first message card on screen", async () => {
            await render(LedgerPage);
            const text = screen.findByText("msg@msg.com0");
            expect(text).toBeDefined();
        });
        it("initially displays ten message card on screen", async () => {
            await render(LedgerPage);
            await screen.findByText("msg@msg.com9");
            const text = await screen.findAllByText(/msg@msg.com/);
            expect(text.length).toBe(10);
        });
        it("displays next page link at first page", async () => {
            await render(LedgerPage);
            await screen.findByText("msg@msg.com9");
            const nextButton = screen.queryByText("Next");
            expect(nextButton).toBeVisible();
        });
        it("hides previous page link at first page", async () => {
            await render(LedgerPage);
            await screen.findByText("msg@msg.com9");
            const previousButton = screen.queryByText("Previous");
            expect(previousButton).not.toBeVisible();
        });
        it("displays next page after clicking next", async () => {
            await render(LedgerPage);
            await screen.findByText("msg@msg.com9");
            const nextButton = screen.queryByText("Next");
            await userEvent.click(nextButton);
            const secondPageData = await screen.findByText("msg@msg.com11");
            expect(secondPageData).toBeInTheDocument();
        });
        it("hides next page link at second page", async () => {
            await render(LedgerPage);
            await screen.findByText("msg@msg.com9");
            const nextButton = screen.queryByText("Next");
            await userEvent.click(nextButton);
            await screen.findByText("msg@msg.com11");
            expect(nextButton).not.toBeVisible();
        });
        it("displays previous page link at second page", async () => {
            await render(LedgerPage);
            await screen.findByText("msg@msg.com9");
            const nextButton = screen.queryByText("Next");
            await userEvent.click(nextButton);
            await screen.findByText("msg@msg.com11");
            const previousButton = screen.queryByText("Previous");
            expect(previousButton).toBeVisible();
        });
        it("enables button after typing into input fields", async () => {
            await render(LedgerPage);
            const emailInput = screen.queryByLabelText("Email");
            const messageInput = screen.queryByLabelText("Message");
            await userEvent.type(emailInput, "some@email.com");
            await userEvent.type(messageInput, "some message");
            const addButton = await screen.findByRole("button", {name: "Add"});
            expect(addButton).toBeEnabled();
        });
        it("displays help after typing not email type to email input", async () => {
            await render(LedgerPage);
            const emailInput = screen.queryByLabelText("Email");
            const messageInput = screen.queryByLabelText("Message");
            await userEvent.type(emailInput, "some message");
            await userEvent.type(messageInput, "test mail");
            const addButton = screen.queryByRole("button", {name: "Add"});
            await userEvent.click(addButton);
            const helpMessage = screen.queryByText("Invalid mail");
            expect(helpMessage).toBeVisible();
        });
        it("hides help after start typing to email input", async () => {
            await render(LedgerPage);
            const emailInput = screen.queryByLabelText("Email");
            const messageInput = screen.queryByLabelText("Message");
            await userEvent.type(emailInput, "some message");
            await userEvent.type(messageInput, "test mail");
            const addButton = screen.queryByRole("button", {name: "Add"});
            await userEvent.click(addButton);
            await userEvent.type(emailInput, "some@email.com");
            const helpMessage = screen.queryByText("Invalid mail");
            expect(helpMessage).not.toBeVisible();
        });
        it("sends info to backend after clicking button", async () => {
            await render(LedgerPage);
            const emailInput = screen.queryByLabelText("Email");
            const messageInput = screen.queryByLabelText("Message");
            await userEvent.type(emailInput, "some@email.com");
            await userEvent.type(messageInput, "some message");
            const addButton = screen.queryByRole("button", {name: "Add"});
            await userEvent.click(addButton);
            expect(requestBody).toEqual({
                email: "some@email.com",
                message: "some message",
            });
        });
        it("clears inputs after clicking button", async () => {
            await render(LedgerPage);
            const emailInput = screen.queryByLabelText("Email");
            const messageInput = screen.queryByLabelText("Message");
            await userEvent.type(emailInput, "some@email.com");
            await userEvent.type(messageInput, "some message");
            const addButton = screen.queryByRole("button", {name: "Add"});
            await userEvent.click(addButton);
            await waitFor(() => {
                expect(emailInput.value).toBe("");
                expect(screen.queryByLabelText("Message").value).toBe("");
            });
        });
        it("disables clicking while there is ongoing api call", async () => {
            await render(LedgerPage);
            const emailInput = screen.queryByLabelText("Email");
            const messageInput = screen.queryByLabelText("Message");
            await userEvent.type(emailInput, "some@email.com");
            await userEvent.type(messageInput, "some message");
            const addButton = screen.queryByRole("button", {name: "Add"});
            await userEvent.click(addButton);
            userEvent.click(addButton);
            expect(counter).toBe(1);
        });
    });
});


const pageData = [
    {
        "email": "msg@msg.com0",
        "message": "hello people"
    },
    {
        "email": "msg@msg.com1",
        "message": "hello people"
    },
    {
        "email": "msg@msg.com2",
        "message": "hello people"
    },
    {
        "email": "msg@msg.com3",
        "message": "hello people"
    },
    {
        "email": "msg@msg.com4",
        "message": "hello people"
    },
    {
        "email": "msg@msg.com5",
        "message": "hello people"
    },
    {
        "email": "msg@msg.com6",
        "message": "hello people"
    },
    {
        "email": "msg@msg.com7",
        "message": "hello people"
    },
    {
        "email": "msg@msg.com8",
        "message": "hello people"
    },
    {
        "email": "msg@msg.com9",
        "message": "hello people"
    },
    {
        "email": "msg@msg.com10",
        "message": "hello people"
    },
    {
        "email": "msg@msg.com11",
        "message": "hello people"
    },
    {
        "email": "hello@mail.com",
        "message": "1234"
    }
];
